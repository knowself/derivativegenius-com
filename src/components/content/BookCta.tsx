import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";

const BOOK_URL = "https://www.amazon.com/dp/B0HL43MYJY";

/**
 * BookCta — "Get the book" call-to-action block for episode pages.
 * Currently features The AI Income Second Act over 50 (2nd edition).
 * To feature a different book later, pass title/url/prices as props.
 */
interface Props {
  title?: string;
  url?: string;
  blurb?: string;
  prices?: string;
}

export default function BookCta({
  title = "The AI Income Second Act over 50",
  url = BOOK_URL,
  blurb = "Turn decades of experience into AI-powered income — no coding, no hype. 10 chapters, 19 worksheets, 10 copy-ready outreach scripts, 15 AI prompt templates.",
  prices = "Ebook $0.99 · Paperback $12.99 · Hardcover $22.99",
}: Props) {
  return (
    <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30">
          <BookOpen className="h-7 w-7 text-amber-400" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Get the book from this episode
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {title}{" "}
            <span className="text-slate-400 font-semibold text-lg">— Second Edition</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{blurb}</p>
          <p className="text-sm font-bold text-amber-300">{prices}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-400 transition-colors"
        >
          <span>Buy on Amazon</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
