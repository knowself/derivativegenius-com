'use client';

import React, { useState, useMemo } from 'react';
import { Quote, Search, Copy, Check, BookMarked, Filter } from 'lucide-react';
import type { StewartQuote } from '@/lib/stewart-quotes';

const TOPIC_METADATA: Record<string, { label: string; chapterRef: string; chapterId: string }> = {
  'traffic-conversion': { label: 'Traffic & Conversion', chapterRef: 'The Promise · Ch. 2', chapterId: 'promise' },
  'websites': { label: 'Websites & Friction', chapterRef: 'Ch. 5 · Ch. 6', chapterId: 'ch-5' },
  'money': { label: 'Economics & Revenue', chapterRef: 'Ch. 1 · Ch. 8', chapterId: 'ch-1' },
  'reviews': { label: 'Reviews & Map Pack', chapterRef: 'Ch. 2 (Pillar 1)', chapterId: 'ch-2' },
  'owned-media': { label: 'Owned Media vs Walled Gardens', chapterRef: 'Ch. 2 · Ch. 6', chapterId: 'ch-6' },
  'content': { label: 'Content & Transcription', chapterRef: 'Ch. 9', chapterId: 'ch-9' },
  'headlines': { label: 'Headlines & Risk Reversal', chapterRef: 'Ch. 5', chapterId: 'ch-5' },
  'video': { label: 'Video Sales Letters (VSL)', chapterRef: 'Intro · Ch. 5', chapterId: 'intro' },
  'jingles': { label: 'Jingles & Earworms', chapterRef: 'Ch. 3 · Ch. 4', chapterId: 'ch-3' },
  'ser-terms': { label: 'SERP Terms & Memory', chapterRef: 'Ch. 3', chapterId: 'ch-3' },
  'tap-to-call': { label: 'Mobile Tap-to-Call', chapterRef: 'Ch. 5 · Audit', chapterId: 'ch-5' },
  'marketing': { label: 'Direct Response Creed', chapterRef: 'Ch. 1', chapterId: 'ch-1' },
  'presence': { label: 'Local Internet Presence', chapterRef: 'Intro · Ch. 2', chapterId: 'intro' },
  'ai': { label: 'AI & Automation Factory', chapterRef: 'Ch. 10', chapterId: 'ch-10' },
  'business-model': { label: 'The Retainer Model', chapterRef: 'Ch. 7 · Ch. 10', chapterId: 'ch-10' },
};

export function BookQuotesIndex({ quotes }: { quotes: StewartQuote[] }) {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Available topic pills with quote counts
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of quotes) {
      counts[q.topic] = (counts[q.topic] || 0) + 1;
    }
    return counts;
  }, [quotes]);

  const uniqueTopics = useMemo(() => {
    return Object.keys(topicCounts).sort();
  }, [topicCounts]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
      const meta = TOPIC_METADATA[q.topic];
      const topicLabel = meta ? meta.label : q.topic;
      const matchesSearch =
        search.trim() === '' ||
        q.quote.toLowerCase().includes(search.toLowerCase()) ||
        topicLabel.toLowerCase().includes(search.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [quotes, selectedTopic, search]);

  const copyQuote = (quoteText: string, idx: number) => {
    navigator.clipboard.writeText(`"${quoteText}" — Mike Stewart`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="quotes-index" className="scroll-mt-24 space-y-6 pt-2">
      {/* Index Header */}
      <div className="border-b border-stone-200 dark:border-slate-800 pb-5 transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Appendix C · Subject Index
          </p>
          <span className="font-mono text-xs text-amber-700 dark:text-amber-400/90 font-medium">
            {filteredQuotes.length} of {quotes.length} Axioms
          </span>
        </div>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          The Stewart Index: Direct-Response Axioms
        </h2>
        <p className="mt-2 font-serif text-sm sm:text-base italic text-stone-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          Alphabetical &amp; topical index of core principles from Mike Stewart&apos;s 35 years in broadcast audio, direct marketing, and local internet strategy.
        </p>
      </div>

      {/* Search and Responsive Topic Filter Bar */}
      <div className="space-y-3 rounded-xl sm:rounded-2xl border border-stone-200/90 bg-stone-100/60 p-4 sm:p-5 shadow-2xs dark:border-slate-800/90 dark:bg-slate-950/70 dark:shadow-inner transition-colors duration-200">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes by keyword (e.g. jingle, bounce, traffic, AI, VSL)..."
            className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-16 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-stone-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20 transition shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-stone-200 px-2 py-1 text-xs text-stone-700 hover:bg-stone-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Swipeable / Scrollable Topic Carousel for Mobile + Wrapped on Desktop */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 px-0.5">
            <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[11px] text-stone-600 dark:text-slate-400">
              <Filter className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span>Filter by Topic:</span>
            </span>
            <span className="text-[11px] font-mono text-stone-400 dark:text-slate-500 sm:hidden">
              Swipe left →
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent sm:flex-wrap">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-sans font-medium transition active:scale-95 ${
                selectedTopic === 'all'
                  ? 'bg-stone-900 text-white font-bold shadow-xs dark:bg-emerald-500 dark:text-slate-950 dark:shadow-emerald-500/30'
                  : 'border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:text-stone-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
              }`}
            >
              All Topics ({quotes.length})
            </button>
            {uniqueTopics.map((topic) => {
              const meta = TOPIC_METADATA[topic];
              const label = meta ? meta.label : topic;
              const count = topicCounts[topic];
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-sans transition active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs dark:bg-emerald-500 dark:text-slate-950 dark:shadow-emerald-500/30'
                      : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-500/40 hover:text-emerald-700 dark:border-slate-800/90 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-stone-100'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Index Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuotes.map((item, idx) => {
          const meta = TOPIC_METADATA[item.topic] || {
            label: item.topic,
            chapterRef: 'Book Body',
            chapterId: 'promise',
          };
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-emerald-500/40 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:hover:shadow-lg"
            >
              {/* Quote content */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-block rounded-md border border-amber-300/60 bg-amber-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-800 uppercase tracking-wider dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                    {meta.label}
                  </span>
                  <button
                    onClick={() => copyQuote(item.quote, idx)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 active:scale-95 transition"
                    title="Copy quote"
                    aria-label="Copy quote to clipboard"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <blockquote className="mt-3 font-serif text-base sm:text-[17px] leading-relaxed text-stone-800 dark:text-stone-200">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Attribution & Chapter Citation */}
              <div className="mt-5 pt-3 border-t border-stone-200/80 dark:border-slate-800/70 flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-slate-400 gap-2">
                <span className="font-serif italic font-medium text-stone-700 dark:text-stone-300">
                  — Mike Stewart
                </span>
                <a
                  href={`#${meta.chapterId}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline underline-offset-4 transition"
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  <span>{meta.chapterRef}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <p className="font-serif text-stone-500 dark:text-slate-400">
            No axioms matched your search &ldquo;{search}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTopic('all');
            }}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-4"
          >
            Reset search and filters
          </button>
        </div>
      )}
    </section>
  );
}
