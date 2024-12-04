const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin if not already initialized
try {
  initializeApp();
} catch (e) {
  // App already initialized
}

exports.processContactFormNotification = onDocumentCreated('notifications/{notificationId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  const notification = snapshot.data();
  if (notification.type !== 'contact_form' || notification.status !== 'pending') {
    return;
  }

  try {
    const { data } = notification;
    
    // Update notification status
    const db = getFirestore();
    await snapshot.ref.update({
      status: 'processing',
      processingStarted: new Date()
    });

    // Create an email task in a separate collection for email processing
    await db.collection('email_tasks').add({
      type: 'contact_form_notification',
      status: 'pending',
      to: 'joe@derivativegenius.com',
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">
            Submitted on ${data.timestamp.toDate().toLocaleString()} from ${data.ip}
          </p>
        </div>
      `,
      created: new Date(),
      retries: 0
    });

    // Create confirmation email task
    await db.collection('email_tasks').add({
      type: 'contact_form_confirmation',
      status: 'pending',
      to: data.email,
      subject: 'Thank you for contacting Derivative Genius',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Thank You for Reaching Out</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting Derivative Genius. We have received your message and will get back to you as soon as possible.</p>
            <p>For your records, here's a copy of your message:</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
            <p>Best regards,<br>The Derivative Genius Team</p>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">
            ${new Date().getFullYear()} Derivative Genius. All rights reserved.
          </p>
        </div>
      `,
      created: new Date(),
      retries: 0
    });

    // Update notification status to completed
    await snapshot.ref.update({
      status: 'completed',
      completedAt: new Date()
    });

  } catch (error) {
    console.error('Error processing notification:', error);
    await snapshot.ref.update({
      status: 'error',
      error: error.message,
      errorTimestamp: new Date()
    });
  }
});
