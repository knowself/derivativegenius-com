# Walkthrough: Unified Blog, Podcast & Newsletter Engine (100% Next.js + Neon + Vercel + Postmark)

We have built and deployed an open-source, serverless content engine that natively powers **Blogs**, **Podcasts**, and **Newsletters** inside the existing Derivative Genius stack without external CMS servers or MySQL containers.

---

## 1. Architecture Summary

| Component | Technology | Purpose |
|---|---|---|
| **Database & Schema** | **Neon PostgreSQL + Drizzle ORM** | Stores articles, show notes, podcast audio metadata, subscribers, and broadcast logs. |
| **Podcast Audio Storage** | **Vercel Blob** (`@vercel/blob`) | Edge-cached MP3 storage with HTTP byte-range support for Apple Podcasts, Spotify, and scrubber seeking. |
| **Podcast In-Browser Player** | **`PodcastPlayer.tsx`** | Custom HTML5 audio player (play/pause, ±15s jump, scrubber, 1x/1.25x/1.5x/2x speed toggle, MP3 download). |
| **Podcast & Blog Syndication** | **`/feed/podcast.xml` & `/feed/blog.xml`** | Standard iTunes/Spotify podcast specification RSS feed + blog RSS feed. |
| **Newsletter Delivery** | **Postmark** (`postmark`) | High-deliverability batch broadcasts via the `broadcast` message stream with RFC 8058 1-click unsubscribe headers. |
| **Operator Studio** | **`/centurion/content`** | Clerk-protected publishing studio with live Markdown preview, drag-and-drop audio uploader, test email dispatcher, and broadcast trigger. |

---

## 2. Key Files Created & Modified

### Database Schema
- [`src/db/schema.ts`](file:///home/knowself/dev/dg-web/src/db/schema.ts): Added `contentPosts`, `newsletterBroadcasts`, and enhanced `newsletterSubscribers` with `unsubscribeToken`.
- **Status:** Successfully applied to Neon via `drizzle-kit push`.

### Core Services & APIs
- [`src/lib/postmark.ts`](file:///home/knowself/dev/dg-web/src/lib/postmark.ts): Postmark client configured for batch email distribution (`client.sendEmailBatch`) and RFC 8058 `List-Unsubscribe` headers.
- [`src/lib/markdown.ts`](file:///home/knowself/dev/dg-web/src/lib/markdown.ts): Markdown-to-HTML parser using `marked` and reading time estimator.
- [`src/app/api/upload/audio/route.ts`](file:///home/knowself/dev/dg-web/src/app/api/upload/audio/route.ts): Direct audio upload route streaming MP3s into Vercel Blob.
- [`src/app/api/newsletter/broadcast/route.ts`](file:///home/knowself/dev/dg-web/src/app/api/newsletter/broadcast/route.ts): Postmark newsletter broadcast endpoint supporting both test emails and list broadcasts.
- [`src/app/api/newsletter/unsubscribe/route.ts`](file:///home/knowself/dev/dg-web/src/app/api/newsletter/unsubscribe/route.ts): 1-click unsubscribe API handler.

### Public Experience
- [`src/app/blog/page.tsx`](file:///home/knowself/dev/dg-web/src/app/blog/page.tsx): Searchable, category-filtered catalog of published articles and podcast briefings.
- [`src/app/blog/[slug]/page.tsx`](file:///home/knowself/dev/dg-web/src/app/blog/[slug]/page.tsx): Dynamic article view with Google `Article` + `LocalBusiness` JSON-LD schema, embedded `PodcastPlayer`, and newsletter subscription box.
- [`src/app/podcasts/page.tsx`](file:///home/knowself/dev/dg-web/src/app/podcasts/page.tsx): Dedicated audio series directory with in-page player, episode counts, and RSS links.
- [`src/components/content/PodcastPlayer.tsx`](file:///home/knowself/dev/dg-web/src/components/content/PodcastPlayer.tsx): Native audio player client component.
- [`src/app/newsletter/unsubscribe/page.tsx`](file:///home/knowself/dev/dg-web/src/app/newsletter/unsubscribe/page.tsx): Respectful unsubscribe landing page.

### Syndication Feeds
- [`src/app/feed/podcast.xml/route.ts`](file:///home/knowself/dev/dg-web/src/app/feed/podcast.xml/route.ts): Valid Apple Podcasts / Spotify XML feed with `<enclosure>` audio metadata.
- [`src/app/feed/blog.xml/route.ts`](file:///home/knowself/dev/dg-web/src/app/feed/blog.xml/route.ts): RSS 2.0 blog feed for news readers.

### Operator Console (/centurion)
- [`src/app/centurion/content/page.tsx`](file:///home/knowself/dev/dg-web/src/app/centurion/content/page.tsx): Publication management dashboard showing live/draft status, media indicators, and sent broadcasts.
- [`src/app/centurion/content/editor/ContentEditor.tsx`](file:///home/knowself/dev/dg-web/src/app/centurion/content/editor/ContentEditor.tsx): Unified studio with split-screen Markdown editor, live preview, Vercel Blob audio uploader, Postmark test email sender, and live broadcast modal.
- [`src/app/centurion/content/new/page.tsx`](file:///home/knowself/dev/dg-web/src/app/centurion/content/new/page.tsx): New post creation route.
- [`src/app/centurion/content/[id]/page.tsx`](file:///home/knowself/dev/dg-web/src/app/centurion/content/[id]/page.tsx): Post editor route.
- [`src/app/centurion/_components/CenturionNav.tsx`](file:///home/knowself/dev/dg-web/src/app/centurion/_components/CenturionNav.tsx): Added "Content Studio" to the operator navigation bar.

---

## 3. How to Use the System

### 1. Publishing a Post or Podcast Episode
1. Navigate to [`/centurion/content`](http://localhost:3000/centurion/content).
2. Click **Create New Publication**.
3. Enter the Title and Subtitle (URL slug auto-generates).
4. To attach a podcast episode:
   - Drag & drop an MP3 into the **Podcast Audio** card. It uploads to Vercel Blob, detects duration, and sets up Apple Podcasts streaming.
5. Write your article or show notes in the Markdown editor. Toggle **Live Preview** to check formatting.
6. Click **Publish Live** to push it immediately to `/blog` and `/podcasts`.

### 2. Broadcasting via Postmark
1. In the editor sidebar under **Postmark Broadcast Engine**:
   - Enter your email in **Send Test Email to** and click **Test** to preview the rendered email in your inbox.
2. When ready, click **Broadcast to All Subscribers**.
3. Confirm the modal to send the newsletter to all active subscribers via Postmark's `broadcast` stream.

### 3. Submitting to Apple Podcasts & Spotify
- Your podcast RSS feed URL is:
  `https://derivativegenius.com/feed/podcast.xml`
- Paste this feed into **Apple Podcasts Connect** and **Spotify for Podcasters** to syndicate all published audio episodes automatically.
