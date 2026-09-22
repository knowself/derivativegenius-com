import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { desc, and, eq, isNotNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { PodcastPlayer } from "@/components/content/PodcastPlayer";
import { Rss, Radio, Headphones, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Derivative Genius Podcast | Local Search & AI Briefings",
  description: "Bite-sized audio briefings, teardowns, and tactical interviews for local service contractors and founders.",
};

export const revalidate = 60;

export default async function PodcastsIndexPage() {
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
    console.warn("[Podcasts Index] DB error, fallback to empty:", err);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Radio className="h-4 w-4" />
          <span>The Derivative Genius Audio Series</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The Local Presence Podcast
        </h1>
        <p className="text-lg text-slate-300 sm:text-xl leading-relaxed">
          Tactical 10-to-15 minute breakdowns of what makes the phone ring for local service contractors. Zero fluff, real audit teardowns.
        </p>

        {/* RSS Syndication Badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/feed/podcast.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
          >
            <Rss className="h-4 w-4 text-amber-500" />
            <span>Apple Podcasts & Spotify RSS Feed</span>
          </a>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-10">
        {episodes.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-md">
            <Headphones className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-xl font-bold text-white">Episodes In Production</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              We are currently recording our first season of local contractor audio teardowns. Check back shortly or subscribe to the RSS feed.
            </p>
          </div>
        ) : (
          episodes.map((ep) => (
            <div
              key={ep.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {ep.episodeNumber ? `Episode #${ep.episodeNumber}` : "Latest Episode"}
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
                    <Link href={`/blog/${ep.slug}`}>{ep.title}</Link>
                  </h2>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-400 shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {ep.publishedAt
                      ? new Date(ep.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>
              </div>

              {ep.excerpt && (
                <p className="text-sm text-slate-300 leading-relaxed">{ep.excerpt}</p>
              )}

              {/* In-Line Audio Player */}
              <PodcastPlayer
                src={ep.audioUrl}
                title={ep.title}
                episodeNumber={ep.episodeNumber}
                durationSeconds={ep.audioDurationSeconds}
              />

              <div className="flex justify-end pt-2">
                <Link
                  href={`/blog/${ep.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>View Episode Notes & Transcript</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
