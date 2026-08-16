"use client";

import Link from 'next/link';
import React from 'react';
import { CENTURIONS_PROJECTS } from '../data/portfolio';

function localImagePath(id: string) {
  return `/images/portfolio/${id}.png`;
}

function imageExistsSync(url: string) {
  try {
    // quick heuristic: assume local images present under public/images/portfolio
    // We'll try to fetch via Image component at runtime; here just return true to
    // prefer local path — runtime will naturally 404 if missing and fallback will show external.
    return true;
  } catch (e) {
    return false;
  }
}

export function PortfolioGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CENTURIONS_PROJECTS.map((p) => (
        <article key={p.id} className="group rounded-xl bg-slate-900/60 p-4 shadow-md">
          <Link href={`/portfolio/${p.id}`} className="relative block overflow-hidden rounded-md">
            <div className="relative h-44 w-full overflow-hidden rounded-md bg-slate-800">
              {/* prefer local screenshot or project-provided image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image ?? localImagePath(p.id)} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{p.description}</p>
            </div>
          </Link>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: 'portfolio_click', project: p.id }) })}
                className="text-sm font-semibold text-blue-400"
              >
                View Live
              </a>
              <Link href={`/portfolio/${p.id}`} className="rounded-full bg-slate-800/60 px-3 py-1 text-sm font-semibold text-slate-200">
                Details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PortfolioGrid;
