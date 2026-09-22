import * as postmark from 'postmark';

/**
 * Lazy-initialized Postmark client.
 */
export function getPostmarkClient() {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    throw new Error('POSTMARK_SERVER_TOKEN is not configured in environment variables');
  }
  return new postmark.ServerClient(token);
}

export interface NewsletterRecipient {
  email: string;
  unsubscribeToken?: string;
}

export interface BroadcastOptions {
  recipients: NewsletterRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  stream?: string;
}

/**
 * Send an email broadcast to a list of subscribers in batches of 500.
 */
export async function sendNewsletterBroadcast(options: BroadcastOptions) {
  const client = getPostmarkClient();
  const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'joe@derivativegenius.com';
  const stream = options.stream || process.env.POSTMARK_MESSAGE_STREAM || 'broadcast';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://derivativegenius.com';

  const BATCH_SIZE = 500;
  const results: any[] = [];

  for (let i = 0; i < options.recipients.length; i += BATCH_SIZE) {
    const chunk = options.recipients.slice(i, i + BATCH_SIZE);
    const messages = chunk.map((recipient) => {
      const unsubUrl = `${appUrl}/newsletter/unsubscribe?token=${encodeURIComponent(recipient.unsubscribeToken || recipient.email)}`;

      // Append unsubscribe footer to HTML if not present
      const personalizedHtml = options.htmlContent.includes('unsubscribe')
        ? options.htmlContent.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubUrl)
        : `${options.htmlContent}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #94a3b8; text-align: center; font-family: sans-serif;">
            <p>You received this email because you subscribed to the Derivative Genius newsletter.</p>
            <p><a href="${unsubUrl}" style="color: #38bdf8; text-decoration: underline;">Unsubscribe from this newsletter</a></p>
          </div>`;

      return {
        From: fromEmail,
        To: recipient.email,
        Subject: options.subject,
        HtmlBody: personalizedHtml,
        TextBody: options.textContent || undefined,
        MessageStream: stream,
        Headers: [
          { Name: 'List-Unsubscribe', Value: `<${unsubUrl}>` },
          { Name: 'List-Unsubscribe-Post', Value: 'List-Unsubscribe=One-Click' },
        ],
        TrackOpens: true,
      };
    });

    const batchResponse = await client.sendEmailBatch(messages);
    results.push(...batchResponse);
  }

  return results;
}
