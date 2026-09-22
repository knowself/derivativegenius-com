'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, List, X, ArrowUp, Quote, ChevronRight } from 'lucide-react';

export interface TocItem {
  href: string;
  label: string;
  category?: string;
  page?: string;
}

export function BookNavigation({ toc }: { toc: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('promise');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setProgress(Math.round(currentProgress));
      }

      // Determine active section
      const sectionElements = toc
        .map((item) => {
          const id = item.href.replace('#', '');
          const el = document.getElementById(id);
          return { id, top: el ? el.getBoundingClientRect().top : 99999 };
        })
        .filter((item) => item.top <= 200);

      if (sectionElements.length > 0) {
        const current = sectionElements[sectionElements.length - 1];
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const activeItem = toc.find((item) => item.href === `#${activeSection}`) || toc[0];

  return (
    <>
      {/* Mobile Sticky Reading HUD (Positioned under the sticky main header, Theme-Sensitive) */}
      <aside 
        aria-label="Book reading controls" 
        className="sticky top-[64px] sm:top-[72px] md:top-[84px] z-30 w-full border-b border-stone-200/90 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950/92 backdrop-blur-xl px-3 py-2.5 shadow-sm dark:shadow-lg transition-colors duration-200 lg:hidden"
      >
        <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-100/80 px-3 py-2 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-200 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:text-white dark:hover:bg-slate-800 active:scale-95 transition"
            aria-label="Open Table of Contents"
          >
            <List className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Contents</span>
          </button>

          <div className="min-w-0 flex-1 text-center px-2">
            <span className="block truncate font-serif text-xs font-medium text-stone-800 dark:text-stone-200">
              {activeItem.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#quotes-index"
              className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-medium text-stone-600 hover:text-emerald-700 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:border-slate-700 active:scale-95 transition"
              title="Jump to Quotes Index"
            >
              <Quote className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Index</span>
            </a>
            <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 w-8 text-right">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress line */}
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-stone-200/80 dark:bg-slate-800/80">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 dark:bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-stone-200 bg-white p-5 pb-24 shadow-2xl safe-area-bottom dark:border-slate-800 dark:bg-slate-950 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-serif text-base font-bold tracking-tight text-stone-900 dark:text-white">
                  Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white active:scale-95 transition"
                aria-label="Close Table of Contents"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 dark:text-slate-400 font-serif italic mb-3">
              Tap any chapter to turn directly to that page:
            </p>

            <nav className="divide-y divide-stone-200/60 dark:divide-slate-800/60 text-sm">
              {toc.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-3 px-3 rounded-lg transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="font-serif pr-2">{item.label}</span>
                    <span className="text-xs font-mono text-stone-400 dark:text-slate-400 flex items-center gap-1 shrink-0">
                      {item.page && <span>p. {item.page}</span>}
                      <ChevronRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-6 pt-3 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
              <a
                href="#top"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 py-1 text-stone-600 dark:text-slate-300"
              >
                <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Return to Top</span>
              </a>
              <span className="font-serif italic text-emerald-700 dark:text-emerald-400/80">
                Mike Stewart Playbook
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
