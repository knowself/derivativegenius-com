import React from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  FileSpreadsheet,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { CompanionKitSignup } from "@/components/CompanionKitSignup";

export const metadata = {
  title: "Free Companion Kit — The AI Income Second Act over 50 | Derivative Genius",
  description:
    "Five free workbooks and planners that go with The AI Income Second Act over 50: turn your experience into a sellable offer, price it, and launch.",
};

const FILES = [
  {
    href: "/companion-kit/expertise-to-offer-workbook.pdf",
    filename: "Expertise-to-Offer-Workbook.pdf",
    title: "Expertise to Offer Workbook",
    blurb: "Turn your career history into a sellable offer, step by step.",
    icon: FileText,
  },
  {
    href: "/companion-kit/30-day-client-launch-workbook.pdf",
    filename: "30-Day-Client-Launch-Workbook.pdf",
    title: "30-Day Client Launch Workbook",
    blurb: "Four-week launch plan with space for notes and message drafts.",
    icon: FileText,
  },
  {
    href: "/companion-kit/income-pricing-and-capacity-planner.xlsx",
    filename: "Income-Pricing-and-Capacity-Planner.xlsx",
    title: "Income, Pricing & Capacity Planner",
    blurb: "Turn your income goal into prices and tiers.",
    icon: FileSpreadsheet,
  },
  {
    href: "/companion-kit/prospect-and-follow-up-tracker.xlsx",
    filename: "Prospect-and-Follow-Up-Tracker.xlsx",
    title: "Prospect & Follow-Up Tracker",
    blurb: "Run your outreach without letting anyone slip.",
    icon: FileSpreadsheet,
  },
  {
    href: "/companion-kit/companion-kit-guide.pdf",
    filename: "Companion-Kit-Guide.pdf",
    title: "Companion Kit Guide",
    blurb: "How to use all five files together.",
    icon: FileText,
  },
];

const AMAZON_AUTHOR_URL = "https://www.amazon.com/author/josephsterryjr";

export default function CompanionKitPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Derivative <span className="text-amber-400">Genius</span>
        </Link>
        <a
          href={AMAZON_AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-400 transition hover:text-amber-300"
        >
          The book <ArrowUpRight className="h-4 w-4" />
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          Free companion kit
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          The AI Income Second Act over 50
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400">
          Five free workbooks and planners that go with the book. Download
          them below, or get the whole kit by email.
        </p>
      </section>

      {/* Download cards */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FILES.map((file) => (
            <div
              key={file.filename}
              className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 transition hover:border-amber-400/50"
            >
              <file.icon className="h-8 w-8 text-amber-400" />
              <h2 className="mt-4 text-lg font-bold">{file.title}</h2>
              <p className="mt-2 flex-1 text-sm text-neutral-400">
                {file.blurb}
              </p>
              <a
                href={file.href}
                download={file.filename}
                className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-bold text-neutral-950 transition hover:bg-amber-300 active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              <p className="mt-3 truncate text-xs text-neutral-600">
                {file.filename}
              </p>
            </div>
          ))}

          {/* Book promo card fills the sixth grid slot */}
          <div className="flex flex-col rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6">
            <BookOpen className="h-8 w-8 text-amber-400" />
            <h2 className="mt-4 text-lg font-bold">Reading without the book?</h2>
            <p className="mt-2 flex-1 text-sm text-neutral-400">
              The kit follows the book chapter by chapter. Grab your copy and
              work through them together.
            </p>
            <a
              href={AMAZON_AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-amber-400/60 px-4 text-sm font-bold text-amber-300 transition hover:bg-amber-400/10 active:scale-95"
            >
              Get the book on Amazon
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <CompanionKitSignup />
      </section>

      {/* Book promo block */}
      <section className="border-t border-neutral-900">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-amber-400" />
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Your experience is enough. The book shows you how to sell it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            <em>The AI Income Second Act over 50</em> is a plain-English
            roadmap for turning decades of professional judgment into a
            one-person AI consulting business — no coding, no hype, just the
            method. The companion kit above is its working half.
          </p>
          <a
            href={AMAZON_AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-amber-400 px-7 text-base font-bold text-neutral-950 transition hover:bg-amber-300 active:scale-95"
          >
            Get the book on Amazon
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="mt-4 text-xs text-neutral-600">
            By Joseph S. Terry Jr. · Second edition in progress — kit readers
            hear about it first.
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Derivative Genius · Lake County, CA</p>
          <Link href="/" className="hover:text-neutral-300">
            Back to homepage
          </Link>
        </div>
      </footer>
    </main>
  );
}
