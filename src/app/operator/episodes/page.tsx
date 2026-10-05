import React from "react";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { Plus, Mic } from "lucide-react";
import EpisodeRowActions from "./EpisodeRowActions";

export const dynamic = "force-dynamic";

export default async function EpisodesPage() {
  let posts: any[] = [];
  try {
    if (db) {
      posts = await db
        .select()
        .from(schema.contentPosts)
        .orderBy(desc(schema.contentPosts.createdAt));
    }
  } catch (err) {
    console.warn("[Operator Episodes] DB error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mic className="h-6 w-6 text-emerald-400" />
            Episodes & Posts
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Publish podcast episodes and articles. Published podcasts appear on{" "}
            <Link href="/podcasts" className="text-emerald-400 hover:underline">
              /podcasts
            </Link>{" "}
            and in the RSS feed.
          </p>
        </div>
        <Link
          href="/operator/episodes/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New episode
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <Mic className="mx-auto h-10 w-10 text-slate-500" />
          <h3 className="mt-4 text-lg font-bold text-white">No episodes yet</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Publish your first episode — upload the MP3, paste the show notes, and hit publish.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{post.title}</div>
                    <div className="text-xs text-slate-500">
                      /blog/{post.slug}
                      {post.episodeNumber ? ` · Ep #${post.episodeNumber}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      {post.postType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {post.isPublished ? (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-700/40 border border-slate-700 px-2.5 py-0.5 text-xs font-bold text-slate-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <EpisodeRowActions
                      id={post.id}
                      slug={post.slug}
                      isPublished={post.isPublished}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
