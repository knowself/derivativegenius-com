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
        .filter((item) => item.top <= 160);

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
      {/* Mobile Sticky Reading Bar */}
      <aside 
        aria-label="Book reading controls" 
        className="sticky top-0 z-40 w-full border-b border-[#e7e0d0] bg-[#fffdf7]/95 backdrop-blur-md px-3 py-2.5 shadow-sm transition-all lg:hidden"
      >
        <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#e7e0d0] bg-[#f5f1e4] px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] shadow-sm active:scale-95 transition"
            aria-label="Open Table of Contents"
          >
            <List className="h-4 w-4 text-[#0f766e]" />
            <span>Contents</span>
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <span className="block truncate text-xs font-serif font-medium text-[#1a1a1a]">
              {activeItem.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#quotes-index"
              className="flex items-center gap-1 rounded-lg border border-[#e7e0d0] bg-white px-2 py-1.5 text-xs font-medium text-[#5b5b5b] hover:text-[#0f766e] active:scale-95 transition"
              title="Jump to Quotes Index"
            >
              <Quote className="h-3.5 w-3.5 text-[#0f766e]" />
              <span className="hidden sm:inline">Index</span>
            </a>
            <span className="text-[11px] font-mono text-[#5b5b5b] w-7 text-right">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress line */}
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#e7e0d0]/50">
          <div
            className="h-full bg-[#0f766e] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-[#e7e0d0] bg-[#fffdf7] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7e0d0] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#0f766e]" />
                <h3 className="font-serif text-base font-bold tracking-tight text-[#1a1a1a]">
                  Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-[#5b5b5b] hover:bg-[#f5f1e4] active:scale-95 transition"
                aria-label="Close Table of Contents"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#5b5b5b] font-serif italic mb-3">
              Tap any chapter to jump directly to that page:
            </p>

            <nav className="divide-y divide-[#e7e0d0]/60 text-sm">
              {toc.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-2 rounded-md transition ${
                      isActive
                        ? 'bg-[#0f766e]/10 text-[#0f766e] font-semibold'
                        : 'text-[#1a1a1a] hover:bg-[#f5f1e4]'
                    }`}
                  >
                    <span className="font-serif pr-2">{item.label}</span>
                    <span className="text-xs font-mono text-[#5b5b5b] flex items-center gap-1 shrink-0">
                      {item.page && <span>p. {item.page}</span>}
                      <ChevronRight className="h-3.5 w-3.5 text-[#0f766e]" />
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-5 pt-3 border-t border-[#e7e0d0] flex items-center justify-between text-xs text-[#5b5b5b]">
              <a
                href="#top"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1 hover:text-[#0f766e]"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Return to Top</span>
              </a>
              <span className="font-serif italic text-emerald-800">
                Mike Stewart Playbook
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
