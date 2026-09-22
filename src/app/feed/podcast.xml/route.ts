import { NextResponse } from "next/server";
import { desc, and, eq, isNotNull } from "drizzle-orm";
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

  let episodes: any[] = [];
  try {
    if (db) {
      episodes = await db
        .select()
        .from(schema.contentPosts)
        .where(
          and(
            eq(schema.contentPosts.isPublished, true),
            isNotNull(schema.contentPosts.audioUrl)
          )
        )
        .orderBy(desc(schema.contentPosts.publishedAt));
    }
  } catch (err) {
    console.error("[Podcast Feed XML Error]", err);
  }

  const itemsXml = episodes
    .map((ep) => {
      const pubDate = ep.publishedAt
        ? new Date(ep.publishedAt).toUTCString()
        : new Date().toUTCString();
      const enclosureLength = ep.audioSizeBytes || 15728640; // Default 15MB if unrecorded
      const durationSeconds = ep.audioDurationSeconds || 900;
      const episodeUrl = `${appUrl}/blog/${ep.slug}`;

      return `
    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.excerpt || ep.title)}</description>
      <link>${episodeUrl}</link>
      <guid isPermaLink="true">${episodeUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${escapeXml(ep.audioUrl)}" length="${enclosureLength}" type="audio/mpeg" />
      <itunes:duration>${durationSeconds}</itunes:duration>
      <itunes:author>${escapeXml(ep.authorName || "Joe Terry")}</itunes:author>
      <itunes:summary>${escapeXml(ep.excerpt || ep.title)}</itunes:summary>
      ${ep.episodeNumber ? `<itunes:episode>${ep.episodeNumber}</itunes:episode>` : ""}
      <itunes:explicit>no</itunes:explicit>
    </item>`;
    })
    .join("\n");

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Derivative Genius — Local Search &amp; AI Briefings</title>
    <link>${appUrl}/podcasts</link>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Derivative Genius</copyright>
    <description>Tactical audio playbooks, teardowns, and interviews showing how local service businesses turn search traffic into booked service calls.</description>
    <itunes:author>Joe Terry</itunes:author>
    <itunes:summary>Tactical audio playbooks and teardowns showing how local service businesses dominate Google search and turn visits into booked service calls.</itunes:summary>
    <itunes:owner>
      <itunes:name>Joe Terry</itunes:name>
      <itunes:email>joe@derivativegenius.com</itunes:email>
    </itunes:owner>
    <itunes:category text="Business">
      <itunes:category text="Marketing"/>
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>
    <itunes:image href="${appUrl}/logo.png"/>
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
