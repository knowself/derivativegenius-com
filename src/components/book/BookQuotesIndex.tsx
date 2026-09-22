'use client';

import React, { useState, useMemo } from 'react';
import { Quote, Search, ExternalLink, Copy, Check, Sparkles, BookMarked } from 'lucide-react';
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
    <section id="quotes-index" className="scroll-mt-20 space-y-6 pt-4">
      {/* Index Header */}
      <div className="border-b-2 border-[#1a1a1a] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#0f766e]">
            Appendix C · Subject Index
          </p>
          <span className="font-mono text-xs text-[#5b5b5b]">
            {filteredQuotes.length} of {quotes.length} Axioms
          </span>
        </div>
        <h2 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
          The Stewart Index: Direct-Response Axioms
        </h2>
        <p className="mt-2 font-serif text-sm italic text-[#5b5b5b] leading-relaxed">
          Alphabetical &amp; topical index of core principles from Mike Stewart&apos;s 35 years in broadcast audio, direct marketing, and local internet strategy.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 rounded-xl border border-[#e7e0d0] bg-[#fbf9f4] p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5b5b5b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes by keyword (e.g. jingle, bounce, traffic, AI, VSL)..."
            className="w-full rounded-lg border border-[#e7e0d0] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#5b5b5b]/70 focus:border-[#0f766e] focus:outline-none focus:ring-1 focus:ring-[#0f766e] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5b5b5b] hover:text-[#1a1a1a]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`rounded-full px-3 py-1 text-xs font-sans transition ${
              selectedTopic === 'all'
                ? 'bg-[#1a1a1a] text-white font-medium'
                : 'border border-[#e7e0d0] bg-white text-[#5b5b5b] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
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
                className={`rounded-full px-2.5 py-1 text-xs font-sans transition ${
                  isSelected
                    ? 'bg-[#0f766e] text-white font-medium shadow-xs'
                    : 'border border-[#e7e0d0] bg-white text-[#5b5b5b] hover:border-[#0f766e] hover:text-[#0f766e]'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
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
              className="group relative flex flex-col justify-between rounded-xl border border-[#e7e0d0] bg-white p-5 shadow-xs transition hover:border-[#0f766e]/40 hover:shadow-sm"
            >
              {/* Quote text */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-block rounded-md bg-[#f5f1e4] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0f766e] uppercase tracking-wider">
                    {meta.label}
                  </span>
                  <button
                    onClick={() => copyQuote(item.quote, idx)}
                    className="text-[#5b5b5b] hover:text-[#0f766e] transition p-1"
                    title="Copy quote"
                    aria-label="Copy quote to clipboard"
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <blockquote className="mt-3 font-serif text-[15px] sm:text-base leading-relaxed text-[#1a1a1a]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Attribution & Chapter Citation */}
              <div className="mt-4 pt-3 border-t border-[#e7e0d0]/60 flex flex-wrap items-center justify-between text-xs text-[#5b5b5b] gap-2">
                <span className="font-serif italic font-medium text-[#1a1a1a]">
                  — Mike Stewart
                </span>
                <a
                  href={`#${meta.chapterId}`}
                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#0f766e] hover:underline underline-offset-2"
                >
                  <BookMarked className="h-3 w-3" />
                  <span>{meta.chapterRef}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#e7e0d0] p-8 text-center">
          <p className="font-serif text-[#5b5b5b]">
            No axioms matched your search &ldquo;{search}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTopic('all');
            }}
            className="mt-3 text-xs font-semibold text-[#0f766e] underline underline-offset-4"
          >
            Reset search and filters
          </button>
        </div>
      )}
    </section>
  );
}
