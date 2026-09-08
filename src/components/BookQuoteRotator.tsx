'use client';

import { useEffect, useState } from 'react';
import type { StewartQuote } from '@/lib/stewart-quotes';

const ROTATE_MS = 15_000;

export function BookQuoteRotator({ quotes }: { quotes: StewartQuote[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const current = quotes[index] ?? quotes[0];

  return (
    <>
      <span key={index} className="block text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
        &ldquo;{current.quote}&rdquo;
      </span>
      <span className="mt-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        — Mike Stewart · Read the free playbook that powers our audits
      </span>
    </>
  );
}
