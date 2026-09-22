import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://derivativegenius.com";

  let posts: any[] = [];
  try {
    if (db) {
      posts = await db
        .select()
        .from(schema.contentPosts)
        .where(eq(schema.contentPosts.isPublished, true))
        .orderBy(desc(schema.contentPosts.publishedAt))
        .limit(50);
    }
  } catch (err) {
    console.error("[Blog RSS Feed Error]", err);
  }

  const itemsXml = posts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      const postUrl = `${appUrl}/blog/${post.slug}`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <author>${escapeXml(post.authorName || "Joe Terry")}</author>
    </item>`;
    })
    .join("\n");

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Derivative Genius Blog</title>
    <link>${appUrl}/blog</link>
    <description>Local SEO, AI digital employees, and high-conversion landing page playbooks.</description>
    <language>en-us</language>
    <atom:link href="${appUrl}/feed/blog.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(feedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
