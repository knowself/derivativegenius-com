const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Define secrets for SMTP configuration
const SMTP_HOST = defineSecret('SMTP_HOST', 'v1');
const SMTP_PORT = defineSecret('SMTP_PORT', 'v1');
const SMTP_USER = defineSecret('SMTP_USER', 'v1');
const SMTP_PASS = defineSecret('SMTP_PASS', 'v1');
const SMTP_FROM = defineSecret('SMTP_FROM', 'v1');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Rate limiting check
const isRateLimited = async (email) => {
  const now = admin.firestore.Timestamp.now();
  const fiveMinutesAgo = new Date(now.toMillis() - 5 * 60 * 1000);
  
  const recentSubmissions = await db
    .collection('contacts')
    .where('email', '==', email)
    .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(fiveMinutesAgo))
    .get();
  
  return recentSubmissions.size >= 3;
};

// Save contact to Firestore and return success
const saveContact = async (contactData) => {
  try {
    const contactRef = await db.collection('contacts').add({
      ...contactData,
      timestamp: admin.firestore.Timestamp.now(),
      status: 'pending',
      emailSent: true
    });
    return contactRef;
  } catch (error) {
    logger.error('Error saving to Firestore:', error);
    throw new Error('Failed to save contact information');
  }
};

// Send emails if transporter is configured
const sendEmails = async ({ transporter }, notificationEmail, confirmationEmail) => {
  try {
    await Promise.all([
      transporter.sendMail(notificationEmail),
      transporter.sendMail(confirmationEmail)
    ]);
    logger.info('Emails sent successfully');
  } catch (error) {
    logger.error('Failed to send emails:', error);
    throw new Error('Failed to send confirmation emails');
  }
};

exports.sendContactEmail = onRequest({
  region: 'us-west1',
  memory: '256MiB',
  timeoutSeconds: 60,
  secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM]
}, async (req, res) => {
  // Add CORS headers for preflight
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');
  res.set('Access-Control-Max-Age', '3600');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Log the start of the request
    logger.info('Starting contact form request', {
      method: req.method,
      contentType: req.headers['content-type'],
      body: req.body
    });

    // Create transporter for this request
    logger.info('Creating SMTP transporter with config', {
      host: SMTP_HOST.value(),
      port: parseInt(SMTP_PORT.value()),
      secure: true,
      auth: {
        user: SMTP_USER.value(),
        // Don't log the password!
      }
    });

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port: parseInt(SMTP_PORT.value()),
      secure: true,
      auth: {
        user: SMTP_USER.value(),
        pass: SMTP_PASS.value()
      }
    });

    // Verify SMTP connection
    try {
      logger.info('Attempting to verify SMTP connection...');
      await transporter.verify();
      logger.info('SMTP connection verified successfully');
    } catch (error) {
      logger.error('SMTP verification failed:', {
        error: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        command: error.command,
        response: error.response
      });
      throw new Error(`Failed to establish SMTP connection: ${error.message}`);
    }

    // Validate request
    if (req.method !== 'POST') {
      throw new Error('Method not allowed. This endpoint only accepts POST requests.');
    }

    if (!req.headers['content-type']?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name?.trim()) throw new Error('Name is required');
    if (!email?.trim()) throw new Error('Email is required');
    if (!message?.trim()) throw new Error('Message is required');
    if (!isValidEmail(email)) throw new Error('Please provide a valid email address');
    if (phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
      throw new Error('Please provide a valid phone number');
    }

    // Check rate limiting
    if (await isRateLimited(email)) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      ip: req.ip || 'Unknown',
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: admin.firestore.Timestamp.now()
    };

    // Save to Firestore
    await saveContact(contactData);

    // Prepare email content
    const notificationMailOptions = {
      from: SMTP_FROM.value() || 'noreply@derivativegenius.com',
      to: 'joe@derivativegenius.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">
            Submitted on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    const confirmationMailOptions = {
      from: SMTP_FROM.value() || 'noreply@derivativegenius.com',
      to: email,
      subject: 'Thank you for contacting Derivative Genius',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Thank You for Reaching Out</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${name},</p>
            <p>Thank you for contacting Derivative Genius. We have received your message and will get back to you as soon as possible.</p>
            <p>For your records, here's a copy of your message:</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>The Derivative Genius Team</p>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">
            ${new Date().getFullYear()} Derivative Genius. All rights reserved.
          </p>
        </div>
      `
    };

    // Try to send emails
    try {
      logger.info('Attempting to send emails...');
      await sendEmails({ transporter }, notificationMailOptions, confirmationMailOptions);
      logger.info('Emails sent successfully');
    } catch (error) {
      logger.error('Failed to send emails:', {
        error: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack,
        command: error.command,
        response: error.response
      });
      throw error;
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error) {
    logger.error('Error in contact form:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name,
      command: error.command,
      response: error.response
    });

    const statusCode = error.message.includes('not allowed') ? 405
      : error.message.includes('Content-Type') ? 415
      : error.message.includes('required') || error.message.includes('valid') ? 400
      : error.message.includes('too many requests') ? 429
      : error.message.includes('SMTP connection') ? 500
      : 500;

    res.status(statusCode).json({
      success: false,
      error: statusCode === 500
        ? 'We encountered an error processing your request. Please try again later or contact us directly at joe@derivativegenius.com'
        : error.message
    });
  }
});
