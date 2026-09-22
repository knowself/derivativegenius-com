"use client";

import Link from 'next/link';
import React from 'react';
import { CENTURIONS_PROJECTS } from '../data/portfolio';
import FallbackImage from './FallbackImage';

function localImagePath(id: string) {
  return `/images/portfolio/${id}.png`;
}

export function PortfolioGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CENTURIONS_PROJECTS.map((p) => (
        <article key={p.id} className="group rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <Link href={`/portfolio/${p.id}`} className="relative block overflow-hidden rounded-md">
            <div className="relative h-44 w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
              <FallbackImage src={p.image ?? localImagePath(p.id)} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.description}</p>
            </div>
          </Link>

          <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: 'portfolio_click', project: p.id }) })}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Live
              </a>
              <Link href={`/portfolio/${p.id}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors">
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
