import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { estimateReadingTime } from "@/lib/markdown";
import { Headphones, BookOpen, Mail, Clock, ArrowRight, Calendar } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "Blog, Podcasts & Local SEO Insights | Derivative Genius",
  description: "Actionable playbooks, podcasts, and insights on local search rankings, AI digital employees, and converting website visitors into booked phone calls.",
};

export const revalidate = 60; // ISR 60s

export default async function BlogIndexPage() {
  let posts: any[] = [];
  try {
    if (db) {
      posts = await db
        .select()
        .from(schema.contentPosts)
        .where(eq(schema.contentPosts.isPublished, true))
        .orderBy(desc(schema.contentPosts.publishedAt));
    }
  } catch (err) {
    console.warn("[Blog Index] Error fetching posts, fallback to empty:", err);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <span>Insights · Podcasts · Playbooks</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Old Ideas Done Right.
        </h1>
        <p className="text-lg text-slate-300 sm:text-xl leading-relaxed">
          The tactical strategies, audio briefings, and field notes we use to get local service businesses to the top of Google and turn searches into booked calls.
        </p>
      </div>

      {/* Post Grid */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center backdrop-blur-md">
          <BookOpen className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-bold text-white">First Editions Dropping Soon</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            We are recording our inaugural podcast episodes and publishing local search playbooks. Subscribe below to receive them in your inbox the moment they go live.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const readingTime = estimateReadingTime(post.contentMarkdown || "");
            const isPodcast = !!post.audioUrl || post.postType === "podcast";
            const tags = post.tags ? JSON.parse(post.tags) : [];

            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-slate-900 hover:shadow-emerald-950/20"
              >
                <div className="space-y-4">
                  {/* Category / Type Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                        isPodcast
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border border-blue-500/30 bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {isPodcast ? (
                        <>
                          <Headphones className="h-3.5 w-3.5" />
                          <span>Podcast</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Article</span>
                        </>
                      )}
                    </span>

                    <span className="flex items-center space-x-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{readingTime} min read</span>
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white transition-colors group-hover:text-emerald-400 line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">{post.excerpt}</p>}
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-1 font-semibold text-emerald-400 transition-transform group-hover:translate-x-1"
                  >
                    <span>{isPodcast ? "Listen" : "Read"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Newsletter Section */}
      <section className="pt-8">
        <Newsletter />
      </section>
    </div>
  );
}
