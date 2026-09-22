import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db, schema } from "@/db";
import { sendNewsletterBroadcast } from "@/lib/postmark";
import { renderMarkdownToHtml } from "@/lib/markdown";

const BroadcastSchema = z.object({
  postId: z.string().uuid("Invalid post ID"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  isTest: z.boolean().default(false),
  testEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    // Check operator authorization
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      // Allow dev test if auth bypass
    }

    const body = await req.json();
    const { postId, subject, isTest, testEmail } = BroadcastSchema.parse(body);

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Fetch post
    const [post] = await db
      .select()
      .from(schema.contentPosts)
      .where(eq(schema.contentPosts.id, postId))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Convert markdown to rich email HTML
    const htmlBodyContent = await renderMarkdownToHtml(post.contentMarkdown);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://derivativegenius.com";
    const postUrl = `${appUrl}/blog/${post.slug}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; padding: 32px;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <span style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.15em;">Derivative Genius Insights</span>
              <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 8px 0 0 0; line-height: 1.25;">${post.title}</h1>
              ${post.subtitle ? `<p style="font-size: 16px; color: #94a3b8; margin: 8px 0 0 0;">${post.subtitle}</p>` : ""}
            </td>
          </tr>

          ${
            post.audioUrl
              ? `<!-- Podcast Audio Alert -->
          <tr>
            <td style="padding: 20px 0;">
              <div style="background-color: #0f172a; border: 1px solid #10b981; border-radius: 12px; padding: 16px; text-align: center;">
                <span style="color: #10b981; font-weight: bold; font-size: 14px;">🎙️ Audio Episode Available</span>
                <p style="font-size: 13px; color: #cbd5e1; margin: 6px 0 12px 0;">Listen to the complete audio teardown on our player or Apple Podcasts.</p>
                <a href="${postUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 13px; display: inline-block;">Listen & Read Online &rarr;</a>
              </div>
            </td>
          </tr>`
              : ""
          }

          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
              ${htmlBodyContent}
            </td>
          </tr>

          <!-- Footer CTA -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #334155; text-align: center;">
              <a href="${postUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">
                Read & Comment on Derivative Genius
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // 1. Test Email
    if (isTest) {
      if (!testEmail) {
        return NextResponse.json({ error: "testEmail is required when isTest is true" }, { status: 400 });
      }

      await sendNewsletterBroadcast({
        recipients: [{ email: testEmail, unsubscribeToken: "test" }],
        subject: `[TEST] ${subject}`,
        htmlContent: emailHtml,
        textContent: post.excerpt || post.title,
      });

      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`,
      });
    }

    // 2. Full Live Broadcast
    const subscribers = await db
      .select({
        email: schema.newsletterSubscribers.email,
        unsubscribeToken: schema.newsletterSubscribers.unsubscribeToken,
      })
      .from(schema.newsletterSubscribers)
      .where(eq(schema.newsletterSubscribers.status, "subscribed"));

    if (subscribers.length === 0) {
      return NextResponse.json({
        error: "No active subscribers found in database to broadcast to.",
      }, { status: 400 });
    }

    const recipients = subscribers.map((s) => ({
      email: s.email,
      unsubscribeToken: s.unsubscribeToken || undefined,
    }));

    const results = await sendNewsletterBroadcast({
      recipients,
      subject,
      htmlContent: emailHtml,
      textContent: post.excerpt || post.title,
    });

    // Record campaign in database
    await db.insert(schema.newsletterBroadcasts).values({
      postId: post.id,
      subject,
      recipientCount: recipients.length,
      status: "sent",
      postmarkMessageIds: JSON.stringify(results.map((r: any) => r.MessageID || r.ErrorCode)),
    });

    // Mark post with sent timestamp
    await db
      .update(schema.contentPosts)
      .set({ newsletterSentAt: new Date() })
      .where(eq(schema.contentPosts.id, post.id));

    return NextResponse.json({
      success: true,
      recipientCount: recipients.length,
      message: `Broadcast successfully dispatched to ${recipients.length} subscriber(s)!`,
    });
  } catch (err: any) {
    console.error("[Newsletter Broadcast Error]", err);
    return NextResponse.json({ error: err.message || "Failed to broadcast newsletter" }, { status: 500 });
  }
}
