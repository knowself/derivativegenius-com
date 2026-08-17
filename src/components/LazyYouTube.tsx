"use client";

import React, { useState } from "react";
// use native <img> for remote YouTube thumbnails to avoid next/image host config

interface Props {
  url: string;
  title?: string;
  caption?: string;
}

function extractYouTubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : null;
}

export default function LazyYouTube({ url, title, caption }: Props) {
  const [loaded, setLoaded] = useState(false);
  const id = extractYouTubeId(url) || url;
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <figure className="relative w-full rounded-2xl overflow-hidden border border-slate-800">
      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="relative block w-full h-0 pb-[56.25%] bg-black"
          aria-label={`Play video ${title || id}`}
        >
          <img
            src={thumb}
            alt={title || "YouTube thumbnail"}
            className="object-cover w-full h-full absolute inset-0"
            style={{ width: '100%', height: '100%', position: 'absolute', objectFit: 'cover' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/60 p-3">
              <svg viewBox="0 0 24 24" width="48" height="48" className="text-white">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <div className="w-full h-0 pb-[56.25%] relative">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}
      {caption && <figcaption className="mt-2 text-sm text-slate-400">{caption}</figcaption>}
    </figure>
  );
}

