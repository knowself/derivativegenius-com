const { onCall } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const nodemailer = require('nodemailer');

initializeApp();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Sanitize text to prevent XSS
const sanitizeText = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&#034;')
    .replace(/'/g, '&#039;');
};

// Rate limiting helper
const isRateLimited = async (email) => {
  const db = getFirestore();
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const recentSubmissions = await db
    .collection('contacts')
    .where('email', '==', email)
    .where('timestamp', '>', fiveMinutesAgo)
    .get();

  return recentSubmissions.size >= 3;
};

exports.sendContactEmail = onCall({
  region: 'us-west1',
  maxInstances: 10,
}, async (request) => {
  const { data } = request;
  
  // Input validation
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    throw new Error('All fields are required: name, email, and message');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Please provide a valid email address');
  }

  try {
    // Check rate limiting
    if (await isRateLimited(data.email)) {
      throw new Error('Too many requests. Please try again in a few minutes.');
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeText(data.name.trim()),
      email: data.email.trim().toLowerCase(),
      message: sanitizeText(data.message.trim()),
    };

    // Store in Firestore
    const db = getFirestore();
    await db.collection('contacts').add({
      ...sanitizedData,
      timestamp: new Date(),
      userAgent: request.rawRequest?.headers?.['user-agent'] || 'Unknown',
      ip: request.rawRequest?.ip || 'Unknown',
    });

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'joe@derivativegenius.com',
      subject: `New Contact Form Submission from ${sanitizedData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${sanitizedData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">
            Submitted on ${new Date().toLocaleString()} from ${request.rawRequest?.ip || 'Unknown'}
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: sanitizedData.email,
      subject: 'Thank you for contacting Derivative Genius',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Thank You for Reaching Out</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${sanitizedData.name},</p>
            <p>Thank you for contacting Derivative Genius. We have received your message and will get back to you as soon as possible.</p>
            <p>For your records, here's a copy of your message:</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${sanitizedData.message.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>The Derivative Genius Team</p>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">
            ${new Date().getFullYear()} Derivative Genius. All rights reserved.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing contact form:', {
      error,
      data,
      userAgent: request.rawRequest?.headers?.['user-agent'],
      ip: request.rawRequest?.ip,
    });

    throw new Error(
      'We encountered an error processing your request. Please try again later or contact us directly at joe@derivativegenius.com'
    );
  }
});
