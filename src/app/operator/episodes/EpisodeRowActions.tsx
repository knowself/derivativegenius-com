"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  slug: string;
  isPublished: boolean;
}

export default function EpisodeRowActions({ id, slug, isPublished }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublish() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/centurion/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (busy) return;
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/centurion/content/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <a
        href={`/operator/episodes/${id}/edit`}
        className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
      >
        Edit
      </a>
      <a
        href={`/blog/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
      >
        View
      </a>
      <button
        onClick={togglePublish}
        disabled={busy}
        className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors disabled:opacity-50"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs font-semibold text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
