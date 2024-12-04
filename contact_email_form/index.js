const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create transport outside the function to reuse the connection
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection
transporter.verify().then(() => {
  logger.info('SMTP connection verified successfully');
}).catch((error) => {
  logger.error('SMTP verification failed:', {
    error: error.message,
    code: error.code,
    name: error.name,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER ? '(set)' : '(not set)',
    pass: process.env.SMTP_PASS ? '(set)' : '(not set)'
  });
});

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

exports.sendContactEmail = onRequest({
  region: 'us-west1',
  memory: '256MiB',
  timeoutSeconds: 60,
  minInstances: 0,
  maxInstances: 10,
  cors: {
    origin: ['http://localhost:8080', 'https://derivativegenius.com'],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    maxAge: 3600
  }
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
    // Log request details
    logger.info('Request received', {
      method: req.method,
      origin: req.headers.origin,
      contentType: req.headers['content-type']
    });

    // Only allow POST
    if (req.method !== 'POST') {
      throw new Error('Method not allowed. This endpoint only accepts POST requests.');
    }

    // Validate content type
    if (!req.headers['content-type']?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    const { name, email, message } = req.body;

    // Validate required fields
    if (!name?.trim()) {
      throw new Error('Name is required');
    }
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    if (!message?.trim()) {
      throw new Error('Message is required');
    }
    if (!isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    // Check rate limiting
    if (await isRateLimited(email)) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    // Store in Firestore
    const contactRef = await db.collection('contacts').add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      timestamp: admin.firestore.Timestamp.now(),
      status: 'pending',
      ip: req.ip || 'Unknown',
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    // Send notification email
    const notificationMailOptions = {
      from: process.env.SMTP_FROM,
      to: 'joe@derivativegenius.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
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

    // Send confirmation email
    const confirmationMailOptions = {
      from: process.env.SMTP_FROM,
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

    // Send both emails
    try {
      logger.info('Attempting to send emails...');
      await Promise.all([
        transporter.sendMail(notificationMailOptions),
        transporter.sendMail(confirmationMailOptions)
      ]);
      logger.info('Emails sent successfully');
    } catch (emailError) {
      logger.error('Failed to send emails:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode,
        smtpConfig: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? 'configured' : 'missing',
          pass: process.env.SMTP_PASS ? 'configured' : 'missing',
          from: process.env.SMTP_FROM ? 'configured' : 'missing'
        }
      });
      throw emailError;
    }

    // Update contact status
    await contactRef.update({
      status: 'completed',
      completedAt: admin.firestore.Timestamp.now()
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.'
    });

  } catch (error) {
    logger.error('Error in contact form:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // Determine appropriate status code
    const statusCode = error.message.includes('not allowed') ? 405
      : error.message.includes('Content-Type') ? 415
      : error.message.includes('required') || error.message.includes('valid email') ? 400
      : error.message.includes('too many requests') ? 429
      : 500;

    // Send error response
    res.status(statusCode).json({
      error: statusCode === 500
        ? 'We encountered an error processing your request. Please try again later or contact us directly at joe@derivativegenius.com'
        : error.message
    });
  }
});
