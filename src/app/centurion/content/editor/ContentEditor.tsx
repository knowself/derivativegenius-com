"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Save,
  Send,
  Upload,
  Radio,
  FileText,
  Mail,
  Eye,
  Edit3,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { marked } from "marked";

interface ContentPost {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  postType: "article" | "podcast" | "newsletter" | "hybrid";
  contentMarkdown: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  audioUrl?: string | null;
  audioDurationSeconds?: number | null;
  audioSizeBytes?: number | null;
  episodeNumber?: number | null;
  seasonNumber?: number | null;
  authorName: string;
  tags?: string | null;
  isPublished: boolean;
  publishedAt?: string | null;
  newsletterSentAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface Props {
  initialPost?: ContentPost;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ContentEditor({ initialPost, isNew = false }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<ContentPost>(
    initialPost || {
      title: "",
      slug: "",
      subtitle: "",
      postType: "article",
      contentMarkdown: "# Introduction\n\nWrite your insights or show notes here in markdown...",
      excerpt: "",
      coverImageUrl: "",
      audioUrl: "",
      audioDurationSeconds: 0,
      audioSizeBytes: 0,
      episodeNumber: 1,
      seasonNumber: 1,
      authorName: "Joe Terry",
      tags: '["Local SEO", "AI"]',
      isPublished: false,
      seoTitle: "",
      seoDescription: "",
    }
  );

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [uploadingAudio, setUploadingAudio] = useState(false);

  // Newsletter broadcast state
  const [testEmail, setTestEmail] = useState("joe@derivativegenius.com");
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Compute preview when markdown changes or preview tab opens
  const previewHtml = useMemo(() => {
    if (activeTab !== "preview") return "";
    const parsed = marked.parse(form.contentMarkdown || "", { gfm: true, breaks: true });
    return typeof parsed === "string" ? parsed : "";
  }, [form.contentMarkdown, activeTab]);

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: isNew && (!prev.slug || prev.slug === slugify(prev.title)) ? slugify(val) : prev.slug,
      seoTitle: !prev.seoTitle || prev.seoTitle === prev.title ? val : prev.seoTitle,
    }));
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("audio") && !file.name.endsWith(".mp3") && !file.name.endsWith(".m4a")) {
      toast.error("Please select a valid audio file (MP3 or M4A).");
      return;
    }

    setUploadingAudio(true);
    const toastId = toast.loading("Uploading audio to Vercel Blob...");

    try {
      // Calculate duration client-side
      const audioEl = new Audio();
      const objectUrl = URL.createObjectURL(file);
      audioEl.src = objectUrl;
      audioEl.onloadedmetadata = () => {
        const sec = Math.round(audioEl.duration);
        setForm((prev) => ({ ...prev, audioDurationSeconds: sec }));
        URL.revokeObjectURL(objectUrl);
      };

      const res = await fetch(`/api/upload/audio?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "audio/mpeg",
        },
        body: file,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audio upload failed");
      }

      setForm((prev) => ({
        ...prev,
        audioUrl: data.url,
        audioSizeBytes: file.size,
        postType: prev.postType === "article" ? "podcast" : prev.postType,
      }));

      toast.success("Audio uploaded successfully to Vercel Blob!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload audio", { id: toastId });
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSave = async (publishOverride?: boolean) => {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(isNew ? "Creating post..." : "Saving changes...");

    const payload = {
      ...form,
      isPublished: publishOverride !== undefined ? publishOverride : form.isPublished,
    };

    try {
      const url = isNew ? "/api/centurion/content" : `/api/centurion/content/${form.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      toast.success(
        payload.isPublished
          ? "Post published live! Automatically refreshed on /blog and /podcasts."
          : "Draft saved successfully.",
        { id: toastId }
      );

      if (isNew && data.post?.id) {
        router.push(`/centurion/content/${data.post.id}`);
      } else {
        setForm((prev) => ({ ...prev, ...data.post }));
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving post", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!form.id) {
      toast.error("Please save the post first before sending test emails.");
      return;
    }
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid test email address.");
      return;
    }

    setSendingTest(true);
    const toastId = toast.loading(`Sending test via Postmark to ${testEmail}...`);

    try {
      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: form.id,
          subject: form.title,
          isTest: true,
          testEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test email");

      toast.success(`Test email delivered via Postmark to ${testEmail}!`, { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to send test email", { id: toastId });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcastNewsletter = async () => {
    if (!form.id) {
      toast.error("Please save and publish the post first.");
      return;
    }

    setBroadcasting(true);
    const toastId = toast.loading("Broadcasting newsletter to subscribers via Postmark...");

    try {
      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: form.id,
          subject: form.title,
          isTest: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to broadcast newsletter");

      toast.success(data.message || "Broadcast successfully sent!", { id: toastId });
      setShowBroadcastModal(false);
      setForm((prev) => ({ ...prev, newsletterSentAt: new Date().toISOString() }));
    } catch (err: any) {
      toast.error(err.message || "Broadcast failed", { id: toastId });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/centurion/content"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Content Studio
            </span>
            <h1 className="text-2xl font-bold text-white">
              {isNew ? "Create New Publication" : form.title || "Edit Publication"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isNew && form.isPublished && (
            <Link
              href={`/blog/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 hover:shadow-emerald-500/50 transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {form.isPublished ? "Update Published" : "Publish Live"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Publication Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The 3 Things That Actually Make a Contractor's Phone Ring"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-lg font-bold text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  URL Slug (/blog/[slug]) *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="contractors-phone-ring"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Publication Type
                </label>
                <select
                  value={form.postType}
                  onChange={(e) => setForm((prev) => ({ ...prev, postType: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="article">Article / Playbook</option>
                  <option value="podcast">Podcast Episode</option>
                  <option value="newsletter">Newsletter Dispatch</option>
                  <option value="hybrid">Hybrid (Article + Podcast + Newsletter)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Subtitle / Deck (Optional)
              </label>
              <input
                type="text"
                value={form.subtitle || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="A 10-minute masterclass in eliminating hero waste and driving instant phone calls."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Podcast Audio Upload Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <Radio className="w-4 h-4" />
                <span>Podcast Audio (Vercel Blob Edge Streaming)</span>
              </div>
              {form.audioUrl && (
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Attached: {form.audioDurationSeconds ? `${Math.round(form.audioDurationSeconds / 60)} mins` : "Ready"}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              Upload an MP3 for this episode. It is automatically stored in Vercel Blob, streamed at the edge, and added to the Apple Podcasts / Spotify RSS enclosure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Upload MP3 / Audio File
                </label>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp4,audio/m4a"
                  onChange={handleAudioUpload}
                  disabled={uploadingAudio}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Or Direct Audio URL
                </label>
                <input
                  type="text"
                  value={form.audioUrl || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, audioUrl: e.target.value }))}
                  placeholder="https://...blob.vercel-storage.com/episode.mp3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-1.5 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {form.audioUrl && (
              <div className="pt-2">
                <audio controls src={form.audioUrl} className="w-full h-9 rounded-lg" />
              </div>
            )}
          </div>

          {/* Markdown Content Editor / Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "edit" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Markdown Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>

              <span className="text-xs text-slate-400">
                {form.contentMarkdown ? `${form.contentMarkdown.split(/\s+/).length} words` : "0 words"}
              </span>
            </div>

            {activeTab === "edit" ? (
              <textarea
                value={form.contentMarkdown}
                onChange={(e) => setForm((prev) => ({ ...prev, contentMarkdown: e.target.value }))}
                rows={18}
                placeholder="Write your article in GitHub-flavored markdown..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            ) : (
              <div
                className="prose prose-invert prose-slate max-w-none min-h-[350px] p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Controls Column (1/3) */}
        <div className="space-y-6">
          {/* Postmark Newsletter Dispatch Box */}
          <div className="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-6 backdrop-blur space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Postmark Broadcast Engine</span>
            </div>

            <p className="text-xs text-slate-300">
              Send this article directly to your subscribers via Postmark’s verified Broadcast stream.
            </p>

            {form.newsletterSentAt && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                ✓ Broadcast sent on {new Date(form.newsletterSentAt).toLocaleString()}
              </div>
            )}

            {/* Test Send */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Send Test Email to:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="joe@derivativegenius.com"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest || !form.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 shrink-0"
                >
                  {sendingTest ? "Sending..." : "Test"}
                </button>
              </div>
              {!form.id && (
                <p className="text-[11px] text-amber-400">Save draft first to enable test sends.</p>
              )}
            </div>

            {/* Full Broadcast Trigger */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(true)}
                disabled={!form.id || broadcasting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Broadcast to All Subscribers
              </button>
            </div>
          </div>

          {/* Publishing & Meta Settings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Publishing & SEO Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Excerpt (Search Previews)
              </label>
              <textarea
                value={form.excerpt || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                placeholder="Summary snippet shown in blog cards and search engines..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (JSON array or comma-separated)
              </label>
              <input
                type="text"
                value={form.tags || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder='["HVAC", "Local SEO", "Audio"]'
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Episode # (for Podcasts)
              </label>
              <input
                type="number"
                value={form.episodeNumber || 1}
                onChange={(e) => setForm((prev) => ({ ...prev, episodeNumber: parseInt(e.target.value) || 1 }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Live Newsletter Broadcast */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-blue-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-blue-400">
              <Mail className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Confirm Newsletter Broadcast</h3>
            </div>
            <p className="text-sm text-slate-300">
              You are about to dispatch <strong>&ldquo;{form.title}&rdquo;</strong> to all active subscribers via Postmark&apos;s broadcast stream.
            </p>
            <p className="text-xs text-slate-400">
              Each email will automatically include RFC 8058 compliant one-click unsubscribe headers.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBroadcastNewsletter}
                disabled={broadcasting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
              >
                {broadcasting ? "Dispatching..." : "Yes, Broadcast Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
