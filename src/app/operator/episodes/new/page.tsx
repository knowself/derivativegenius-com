"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function NewEpisodePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [postType, setPostType] = useState("podcast");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number | null>(null);
  const [audioSizeBytes, setAudioSizeBytes] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function onFilePicked(file: File) {
    setError("");
    setUploading(true);
    try {
      // Read duration + size from the file itself
      const duration = await new Promise<number>((resolve) => {
        const el = document.createElement("audio");
        el.preload = "metadata";
        el.onloadedmetadata = () => resolve(Math.round(el.duration || 0));
        el.onerror = () => resolve(0);
        el.src = URL.createObjectURL(file);
      });
      setAudioDurationSeconds(duration || null);
      setAudioSizeBytes(file.size);

      const res = await fetch(
        `/api/upload/audio?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file, headers: { "Content-Type": file.type || "audio/mpeg" } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setAudioUrl(data.url);
    } catch (e: any) {
      setError(e.message || "Audio upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/centurion/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          postType,
          episodeNumber: episodeNumber ? parseInt(episodeNumber, 10) : undefined,
          audioUrl: audioUrl || undefined,
          audioDurationSeconds: audioDurationSeconds ?? undefined,
          audioSizeBytes: audioSizeBytes ?? undefined,
          videoUrl: videoUrl.trim() || undefined,
          excerpt: excerpt.trim() || undefined,
          contentMarkdown,
          coverImageUrl: coverImageUrl.trim() || undefined,
          tags: tags.trim()
            ? JSON.stringify(tags.split(",").map((t) => t.trim()).filter(Boolean))
            : undefined,
          authorName: "Joe Terry",
          isPublished,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create episode");
      router.push("/operator/episodes");
    } catch (e: any) {
      setError(e.message || "Failed to create episode");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none";
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/operator/episodes"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to episodes
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">New episode</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload the MP3, paste the show notes, and publish. It appears on /podcasts and in the RSS feed instantly.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <label className={labelCls}>Title</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Episode title"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Slug</label>
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="episode-slug"
            />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select className={inputCls} value={postType} onChange={(e) => setPostType(e.target.value)}>
              <option value="podcast">Podcast</option>
              <option value="article">Article</option>
              <option value="newsletter">Newsletter</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Episode number</label>
            <input
              className={inputCls}
              type="number"
              min={1}
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
              placeholder="1"
            />
          </div>
          <div>
            <label className={labelCls}>YouTube video URL (optional)</label>
            <input
              className={inputCls}
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Audio MP3</label>
          {audioUrl ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
              <div className="font-semibold text-emerald-300">Uploaded ✓</div>
              <div className="text-xs text-slate-400 break-all mt-1">{audioUrl}</div>
              <div className="text-xs text-slate-400 mt-1">
                {audioDurationSeconds ? `${Math.floor(audioDurationSeconds / 60)}:${String(audioDurationSeconds % 60).padStart(2, "0")} min` : ""}
                {audioSizeBytes ? ` · ${(audioSizeBytes / 1048576).toFixed(1)} MB` : ""}
              </div>
              <button
                type="button"
                onClick={() => {
                  setAudioUrl("");
                  setAudioDurationSeconds(null);
                  setAudioSizeBytes(null);
                }}
                className="mt-2 text-xs font-semibold text-slate-400 hover:text-red-400"
              >
                Replace file
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-8 text-sm text-slate-400 cursor-pointer hover:border-emerald-500/40 hover:text-emerald-300 transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Choose MP3 file
                </>
              )}
              <input
                type="file"
                accept="audio/mpeg,audio/mp3"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFilePicked(f);
                }}
              />
            </label>
          )}
        </div>

        <div>
          <label className={labelCls}>Excerpt (short summary)</label>
          <textarea
            className={inputCls}
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="One or two sentences for the episode card and RSS."
          />
        </div>

        <div>
          <label className={labelCls}>Show notes (markdown)</label>
          <textarea
            className={inputCls + " font-mono"}
            rows={10}
            value={contentMarkdown}
            onChange={(e) => setContentMarkdown(e.target.value)}
            placeholder="## Chapters&#10;&#10;0:00 Welcome…"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Cover image URL (optional)</label>
            <input
              className={inputCls}
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input
              className={inputCls}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai income, second act"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          <span className="text-sm font-semibold text-white">
            Publish immediately
            <span className="block text-xs font-normal text-slate-400">
              If off, the episode is saved as a draft.
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
        >
          {(saving || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Create episode"}
        </button>
      </form>
    </div>
  );
}
