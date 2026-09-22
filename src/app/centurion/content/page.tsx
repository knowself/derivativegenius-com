"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  Radio,
  BookOpen,
  Mail,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  postType: string;
  audioUrl?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  newsletterSentAt?: string | null;
  createdAt: string;
}

export default function CenturionContentPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/centurion/content");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch {
      toast.error("Failed to load content posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitialPosts() {
      try {
        const res = await fetch("/api/centurion/content");
        const data = await res.json();
        if (!ignore && data.success) {
          setPosts(data.posts || []);
        }
      } catch {
        if (!ignore) toast.error("Failed to load content posts");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadInitialPosts();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/centurion/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete post");
      }
    } catch {
      toast.error("Error deleting post");
    }
  };

  const totalPublished = posts.filter((p) => p.isPublished).length;
  const totalPodcasts = posts.filter((p) => !!p.audioUrl || p.postType === "podcast").length;
  const totalNewsletters = posts.filter((p) => !!p.newsletterSentAt).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Centurion Media Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Blog, Podcast &amp; Newsletter Publishing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Unified content engine running directly on Vercel, Neon Postgres, and Postmark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/centurion/content/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition"
          >
            <Plus className="w-4 h-4" /> Create New Publication
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <span className="text-xs font-medium text-slate-400">Total Publications</span>
          <p className="mt-1 text-2xl font-bold text-white">{posts.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <span className="text-xs font-medium text-emerald-400">Live &amp; Published</span>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{totalPublished}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <span className="text-xs font-medium text-blue-400">Podcast Episodes</span>
          <p className="mt-1 text-2xl font-bold text-blue-400">{totalPodcasts}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur">
          <span className="text-xs font-medium text-amber-400">Newsletters Broadcast</span>
          <p className="mt-1 text-2xl font-bold text-amber-400">{totalNewsletters}</p>
        </div>
      </div>

      {/* Publications Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading publications...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <Newspaper className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="text-lg font-bold text-white">No publications drafted yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first blog post, attach an audio episode, or broadcast an email update.
            </p>
            <Link
              href="/centurion/content/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              <Plus className="w-3.5 h-3.5" /> Start First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title / Slug</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Audio / Media</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Newsletter</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/centurion/content/${post.id}`}
                        className="font-bold text-white hover:text-emerald-400 transition line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <span className="text-xs font-mono text-slate-500">/blog/{post.slug}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold capitalize bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        {post.postType === "podcast" ? (
                          <Radio className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <BookOpen className="w-3 h-3 text-blue-400" />
                        )}
                        {post.postType}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {post.audioUrl ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Radio className="w-3 h-3" /> MP3 Attached
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">None</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {post.newsletterSentAt ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          <Mail className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Not Sent</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.isPublished && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="View live public post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/centurion/content/${post.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
