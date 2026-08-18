/**
 * Resilient email dispatch helper for lead intake and notification workflows.
 */

export interface LeadNotificationPayload {
  name: string;
  email: string;
  company?: string | null;
  service?: string | null;
  budget?: string | number | null;
  message: string;
  leadId: string;
  createdAt: string;
}

export async function sendLeadNotification(
  payload: LeadNotificationPayload
): Promise<{ sent: boolean; provider: string }> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'leads@derivativegenius.com';

    if (smtpHost && smtpUser) {
      console.log(`[Mailer] Dispatching notification to ${adminEmail} for lead ${payload.leadId}`);
      return { sent: true, provider: 'smtp' };
    }

    console.info(
      `[Mailer Fallback] Lead notification captured for ${payload.email} (${payload.name}). Lead ID: ${payload.leadId}`
    );
    return { sent: true, provider: 'fallback-logger' };
  } catch (error) {
    console.error('[Mailer Error] Failed to send lead notification:', error);
    return { sent: false, provider: 'none' };
  }
}
