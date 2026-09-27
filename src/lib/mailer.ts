/**
 * Resilient email dispatch helper for lead intake and notification workflows.
 * Sends real transactional alerts via Postmark (already wired for newsletters).
 */

import { getPostmarkClient } from "./postmark";

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendLeadNotification(
  payload: LeadNotificationPayload
): Promise<{ sent: boolean; provider: string }> {
  const adminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || "joe@derivativegenius.com";

  const subject = `New lead: ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`;

  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.service ? `Service: ${payload.service}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    ``,
    payload.message,
    ``,
    `Lead ID: ${payload.leadId}`,
    `Received: ${payload.createdAt}`,
  ].filter((l): l is string => l !== null);

  const textBody = lines.join("\n");
  const htmlBody = `<div style="font-family: sans-serif; line-height: 1.6;">${lines
    .map((l) => (l === "" ? "<br/>" : `<p style="margin: 4px 0;">${escapeHtml(l)}</p>`))
    .join("")}</div>`;

  try {
    const client = getPostmarkClient();
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || "joe@derivativegenius.com";
    await client.sendEmail({
      From: fromEmail,
      To: adminEmail,
      Subject: subject,
      TextBody: textBody,
      HtmlBody: htmlBody,
      MessageStream: "outbound",
    });
    console.log(`[Mailer] Postmark alert sent to ${adminEmail} for lead ${payload.leadId}`);
    return { sent: true, provider: "postmark" };
  } catch (error) {
    console.error("[Mailer Error] Failed to send lead notification:", error);
    console.info(
      `[Mailer Fallback] Lead notification captured for ${payload.email} (${payload.name}). Lead ID: ${payload.leadId}`
    );
    return { sent: false, provider: "none" };
  }
}
