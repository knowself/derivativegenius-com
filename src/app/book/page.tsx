import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Quote,
  Phone,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
} from "lucide-react";
import { getStewartQuotes } from "@/lib/stewart-quotes";
import { BookNavigation, type TocItem } from "@/components/book/BookNavigation";
import { BookQuotesIndex } from "@/components/book/BookQuotesIndex";

export const metadata = {
  title: "Local Internet Presence — The Mike Stewart Playbook | Derivative Genius",
  description:
    "The Mike Stewart playbook retold for local business owners: 5 pillars, SERP-term jingles, YouTube pre-roll arbitrage, and high-converting video pages.",
};

const toc: TocItem[] = [
  { href: "#promise", label: "The Promise: Found, Remembered, Called", page: "1" },
  { href: "#intro", label: "Introduction · Who is Mike Stewart", page: "3" },
  { href: "#ch-1", label: "Chapter 1 · The Creed: Leads, Not Laurels", page: "6" },
  { href: "#ch-2", label: "Chapter 2 · The 5 Pillars of Local Dominance", page: "9" },
  { href: "#ch-3", label: "Chapter 3 · Weapon A: The Jingle That Sticks", page: "13" },
  { href: "#ch-4", label: "Chapter 4 · Weapon B: The YouTube Loophole", page: "17" },
  { href: "#ch-5", label: "Chapter 5 · Weapon C: The Page That Rings", page: "20" },
  { href: "#ch-6", label: "Chapter 6 · Save Your Money: Two Traps to Avoid", page: "24" },
  { href: "#ch-7", label: "Chapter 7 · Proof from Real Towns", page: "27" },
  { href: "#ch-8", label: "Chapter 8 · What to Do Monday: 20-Min Audit", page: "31" },
  { href: "#ch-9", label: "Chapter 9 · Weapon D: How Content Gets Made", page: "34" },
  { href: "#ch-10", label: "Chapter 10 · The AI Factory: You Approve, We Produce", page: "38" },
  { href: "#audit", label: "Appendix A · 5-Minute Self-Audit Worksheet", page: "41" },
  { href: "#glossary", label: "Appendix B · Plain-English Glossary", page: "44" },
  { href: "#quotes-index", label: "Appendix C · The Stewart Index (Mike Stewart Quotes)", page: "48" },
];

const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Local Internet Presence: How Local Businesses Get Found, Remembered, and Called",
  author: { "@type": "Person", name: "Mike Stewart playbook, retold for owners" },
  about: [
    "Local SEO",
    "Google Business Profile",
    "Video Sales Letter",
    "YouTube Ads",
    "Lead generation",
  ],
};

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-[#0f766e]/40 select-none">
      <span className="h-px w-12 bg-[#e7e0d0]" />
      <span className="font-serif text-sm">❦</span>
      <span className="h-px w-12 bg-[#e7e0d0]" />
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
      {children}
    </p>
  );
}

function BookChapter({
  id,
  children,
  pageNumber,
}: {
  id: string;
  children: React.ReactNode;
  pageNumber?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 sm:scroll-mt-20 rounded-xl sm:rounded-2xl border border-[#e7e0d0] bg-[#fffdf7] p-6 sm:p-10 shadow-xs relative space-y-5 transition-shadow hover:shadow-sm"
    >
      {/* Subtle paper spine crease edge gradient on left */}
      <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-stone-900/4 to-transparent pointer-events-none rounded-l-xl sm:rounded-l-2xl" />

      {/* Chapter content */}
      <div className="space-y-4">{children}</div>

      {/* Running bottom folio / page footer */}
      {pageNumber && (
        <div className="mt-8 pt-4 border-t border-[#e7e0d0]/60 flex items-center justify-between font-mono text-[11px] text-[#5b5b5b] select-none">
          <span>Local Internet Presence</span>
          <span className="font-serif font-bold text-[#1a1a1a]">· {pageNumber} ·</span>
          <a href="#top" className="hover:text-[#0f766e] transition">Top ↑</a>
        </div>
      )}
    </section>
  );
}

function LessonBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5 font-sans text-sm leading-relaxed text-[#1a1a1a] shadow-xs">
      {children}
    </div>
  );
}

function TrapBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 font-sans text-sm leading-relaxed text-[#1a1a1a] shadow-xs">
      {children}
    </div>
  );
}

function ProofBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5 font-sans text-sm leading-relaxed text-[#1a1a1a] shadow-xs">
      {children}
    </div>
  );
}

export default function BookPage() {
  const stewartQuotes = getStewartQuotes();

  return (
    <div id="top" className="min-h-screen bg-[#f5f1e4] text-[#1a1a1a] selection:bg-[#0f766e]/20 selection:text-[#0f766e]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />

      {/* Mobile Top Navigation & Drawer */}
      <BookNavigation toc={toc} />

      {/* Book Exterior Folio Wrapper */}
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8">
        {/* Book Spine / Cover Header */}
        <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#091513] bg-[#0b1f1d] text-white shadow-2xl p-6 sm:p-12 lg:p-16">
          {/* Gold embossed accent border line */}
          <div className="absolute inset-2 sm:inset-4 rounded-xl sm:rounded-2xl border border-amber-500/30 pointer-events-none" />

          {/* Bookmark Ribbon */}
          <div className="absolute top-0 right-8 sm:right-16 w-8 sm:w-10 h-16 sm:h-20 bg-amber-600 shadow-lg clip-ribbon flex items-end justify-center pb-2">
            <Bookmark className="h-4 w-4 text-amber-100" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Free Unabridged Playbook · Direct Response Edition</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fffdf7] leading-[1.12]">
              Local Internet Presence
            </h1>
            <p className="font-serif text-xl sm:text-2xl text-amber-200/90 italic font-normal">
              How Local Businesses Get Found, Remembered, and Called
            </p>

            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              The Mike Stewart playbook — 35 years of broadcast audio, direct-response video, and local customer psychology, retold in plain English. No agency jargon. Just phone calls.
            </p>

            <div className="pt-2 text-xs font-mono text-emerald-200/70 border-t border-emerald-900/60">
              Source: <em className="text-white">Lessons of Local Internet Presence</em> · Nashville, TN · Retold for business owners
            </div>

            {/* Quick Action Buttons on Cover */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#promise"
                className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500 active:scale-95"
              >
                <span>Open First Page</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contents-leaf"
                className="inline-flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xs px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
              >
                <span>Table of Contents</span>
              </a>
              <a
                href="#quotes-index"
                className="inline-flex items-center space-x-2 rounded-xl border border-amber-400/40 bg-amber-500/20 px-5 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30 active:scale-95"
              >
                <Quote className="h-4 w-4 text-amber-300" />
                <span>Mike Stewart Quotes</span>
              </a>
            </div>
          </div>
        </header>

        {/* Notice of Draft / Working Copy */}
        <div className="rounded-xl border border-[#e7e0d0] bg-[#fffdf7] px-4 py-3 text-center text-xs font-serif text-[#5b5b5b] shadow-xs">
          <strong className="text-[#1a1a1a] font-sans font-semibold">Publisher&apos;s Review Edition:</strong>{" "}
          Unabridged text prepared with Mike Stewart for owners, operators, and agency partners prior to KDP hardbound release.
        </div>

        {/* Main Book Body Grid (Sticky TOC on Desktop + Book Pages on Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] items-start">
          {/* Desktop Table of Contents Sidebar / Leaf */}
          <aside aria-label="Book table of contents" className="hidden lg:block sticky top-8">
            <nav
              id="contents-sidebar"
              className="rounded-2xl border-2 border-[#e7e0d0] bg-[#fffdf7] p-6 shadow-md space-y-4"
            >
              <div className="border-b-2 border-[#1a1a1a] pb-3">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f766e]">
                  Table of
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Contents</h2>
              </div>

              <ol className="space-y-2 text-xs font-serif leading-snug">
                {toc.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group flex items-baseline justify-between gap-1 text-[#1a1a1a] hover:text-[#0f766e] transition py-1"
                    >
                      <span className="group-hover:underline underline-offset-2">
                        {item.label}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-[#5b5b5b]">
                        {item.page}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="pt-4 border-t border-[#e7e0d0] space-y-3">
                <a
                  href="#quotes-index"
                  className="flex items-center justify-between rounded-lg bg-[#f5f1e4] px-3 py-2 text-xs font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Quote className="h-3.5 w-3.5" />
                    <span>The Stewart Index</span>
                  </span>
                  <span className="font-mono text-[10px]">p. 48</span>
                </a>

                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0f766e] px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0c615a] transition"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Request Free Website Audit</span>
                </Link>
              </div>
            </nav>
          </aside>

          {/* Book Pages Leaf Container */}
          <main className="space-y-8 min-w-0 font-serif leading-relaxed text-[#1a1a1a]">
            {/* Front Matter / Formal Table of Contents Leaf */}
            <section
              id="contents-leaf"
              className="rounded-xl sm:rounded-2xl border-2 border-[#e7e0d0] bg-[#fffdf7] p-6 sm:p-10 shadow-xs space-y-6"
            >
              <div className="text-center border-b-2 border-[#1a1a1a] pb-6 space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#0f766e]">
                  Table of Contents
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1a1a1a]">
                  Summary of Chapters &amp; Appendices
                </h2>
                <p className="font-serif text-xs italic text-[#5b5b5b]">
                  Click any entry below to turn directly to that chapter.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {toc.map((item) => (
                  <div key={item.href} className="flex items-baseline justify-between gap-2">
                    <a
                      href={item.href}
                      className="font-serif text-[#1a1a1a] hover:text-[#0f766e] hover:underline underline-offset-4 transition font-medium"
                    >
                      {item.label}
                    </a>
                    <span className="flex-1 border-b border-dotted border-[#5b5b5b]/40 mx-2 hidden sm:block" />
                    <span className="font-mono text-xs text-[#5b5b5b] shrink-0">
                      p. {item.page}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Promise */}
            <BookChapter id="promise" pageNumber="1">
              <Kicker>Start here · 60 seconds</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                If they can&apos;t find you, remember you, and call you in seconds — you don&apos;t have a presence.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-serif first-letter:font-bold first-letter:text-[#0f766e] first-letter:leading-none">
                Mike Stewart simplifies the whole internet to two jobs:
              </p>
              <ol className="list-decimal space-y-3 pl-6 font-sans text-sm sm:text-base text-[#1a1a1a]">
                <li>
                  <strong className="font-semibold text-black">Traffic:</strong> get qualified locals to find you on the device they actually use — <strong className="font-semibold text-black">over 90% are on mobile phones</strong> for home services.
                </li>
                <li>
                  <strong className="font-semibold text-black">Conversion:</strong> within <strong className="font-semibold text-black">3 seconds</strong> of landing, convince them you&apos;re the trustworthy local fix for their urgent problem. If not, they bounce.
                </li>
              </ol>
              <LessonBox>
                <strong className="font-semibold text-[#0f766e] uppercase tracking-wider block text-xs mb-1">
                  Owner Takeaway:
                </strong>
                You don&apos;t need &ldquo;brand awareness.&rdquo; You need <strong className="underline decoration-[#0f766e] underline-offset-2">found</strong>, <strong className="underline decoration-[#0f766e] underline-offset-2">remembered</strong>, and <strong className="underline decoration-[#0f766e] underline-offset-2">called</strong>. Everything in this book serves those three.
              </LessonBox>
              <p className="text-sm sm:text-base">
                Traffic comes from only three places: <strong className="font-semibold">paid</strong> (Google / YouTube — fastest), <strong className="font-semibold">organic</strong> (reviews, map, content — compounds), and <strong className="font-semibold">borrowed</strong> (partners, networking — highest trust).
              </p>
            </BookChapter>

            {/* Intro */}
            <BookChapter id="intro" pageNumber="3">
              <Kicker>Introduction · Who this is and what this is</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                Who is Mike Stewart — and what is LocalInternetPresence.com?
              </h2>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                Who is Mike Stewart
              </h3>
              <p className="text-sm sm:text-base">
                Mike Stewart is a 35-year veteran of radio, television, music production, audio engineering, and direct marketing, based in Nashville, Tennessee. Former member of <em>The Box Tops</em>, co-producer of <em>Pac-Man Fever</em>, producer of every Waffle House jukebox record (Golden Waffle for &ldquo;Raisin Toast&rdquo;) — and one of the original pioneers of internet multimedia.
              </p>
              <p className="text-sm sm:text-base">
                Over 20 years ago, with copywriter Jim Edwards and direct-response legend Dan Kennedy, Mike <strong className="font-semibold">co-invented the Video Sales Letter (VSL)</strong> when Flash video arrived — proving plain human video with direct-response psychology beats million-dollar agency websites.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                What is LocalInternetPresence.com
              </h3>
              <p className="text-sm sm:text-base">
                His company, <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0f766e] underline decoration-[#0f766e]/40 underline-offset-4 hover:text-[#0c615a]">LocalInternetPresence.com</a>, is not a &ldquo;brand awareness&rdquo; agency. It is a done-for-you local presence system for service businesses — plumbers, HVAC, roofers, pest control, boat rentals, shops — built on <strong className="font-semibold">high-intent lead capture, earworms you can&apos;t forget, and zero-friction funnels</strong>.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <LessonBox>
                  <strong className="block font-semibold text-black mb-1">What it does:</strong>
                  Google profile + map, your-domain content that AI quotes, one-problem video pages, 15-sec jingle + YouTube pre-rolls, in-person audits. You talk 3 minutes; it does the rest.
                </LessonBox>
                <LessonBox>
                  <strong className="block font-semibold text-black mb-1">How you buy it:</strong>
                  Flat monthly retainer (~$300 core, ~$500 with ads managed + ad spend), no $2,000 studio bill, no writing, no dashboards. You reply YES to 4 topics a month.
                </LessonBox>
              </div>
              <blockquote className="border-l-4 border-[#0f766e] bg-[#f0faf8] p-4 text-sm sm:text-base italic text-[#1a1a1a]">
                &ldquo;Rather than posting a lot of jargon on this website that means nothing to most business owners… To GROW your business today, you must have a local internet presence. What I do for businesses, no one else is doing.&rdquo;
              </blockquote>
            </BookChapter>

            {/* Chapter 1 */}
            <BookChapter id="ch-1" pageNumber="6">
              <Kicker>Chapter 1 · The creed</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The philosophy: leads, not laurels
              </h2>
              <p className="text-sm sm:text-base">
                Conventional agencies sell vanity: pretty sliders, vague slogans, random social posts. Mike sells <strong className="font-semibold">high-intent lead capture, earworms people can&apos;t forget, and funnels with zero friction</strong> — built for plumbers, HVAC, roofers, pest control, rentals, and shops.
              </p>
              <blockquote className="border-l-4 border-[#0f766e] bg-[#f0faf8] p-4 text-sm sm:text-base italic text-[#1a1a1a]">
                &ldquo;Rather than posting a lot of jargon on this website that means nothing to most business owners… To GROW your business today, you must have a local internet presence. What I do for businesses, no one else is doing.&rdquo;
              </blockquote>
            </BookChapter>

            {/* Chapter 2 */}
            <BookChapter id="ch-2" pageNumber="9">
              <Kicker>Chapter 2 · The map</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The 5 pillars of local dominance
              </h2>
              <p className="text-sm sm:text-base">
                Think of these as five legs on one stool. Miss one and you wobble.
              </p>
              <div className="overflow-x-auto rounded-xl border border-[#e7e0d0] shadow-xs">
                <table className="w-full border-collapse font-sans text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#f5f1e4] text-left uppercase tracking-wider text-[#5b5b5b]">
                      <th className="border-b border-[#e7e0d0] p-3 font-bold">Pillar</th>
                      <th className="border-b border-[#e7e0d0] p-3 font-bold">What you do</th>
                      <th className="border-b border-[#e7e0d0] p-3 font-bold">Why it pays</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e0d0] text-[#1a1a1a]">
                    <tr>
                      <td className="p-3 font-semibold text-black">1 · Map &amp; reviews</td>
                      <td className="p-3">Claim Google Business Profile, fix name/address/phone, ask every happy customer for 5 stars, reply to all, post real job photos</td>
                      <td className="p-3">Most valuable asset you own; activity signals push you into the Map Pack</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-black">2 · Your website + word-spreading</td>
                      <td className="p-3">Publish answers on <em>your</em> domain, with transcripts; share audio to Apple/Spotify/YouTube</td>
                      <td className="p-3">Ranks on Google and gets quoted by AI answers; social-only posts don&apos;t</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-black">3 · Page + ads that match</td>
                      <td className="p-3">One problem = one page with video + reviews + tap-to-call; ads say the pain + &ldquo;Watch my video&rdquo;</td>
                      <td className="p-3">Paid clicks stop leaking; calls quadruple</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-black">4 · Jingle + YouTube</td>
                      <td className="p-3">15-second search-term song, front-loaded into skippable pre-rolls</td>
                      <td className="p-3">Millions hear you; Google often charges $0</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-black">5 · Handshakes</td>
                      <td className="p-3">Show up (BNI, chamber), run a 20-minute audit 1-on-1</td>
                      <td className="p-3">Owners buy from people who show the flaw, not pitch decks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <LessonBox>
                <strong className="font-semibold text-black">Pillar 1 is first for a reason:</strong> if your reviews are thin, your hours wrong, and your photos stale, ads just send people to distrust you faster.
              </LessonBox>
            </BookChapter>

            {/* Chapter 3 */}
            <BookChapter id="ch-3" pageNumber="13">
              <Kicker>Chapter 3 · Weapon A</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The jingle that sticks in their head
              </h2>
              <p className="text-sm sm:text-base">
                Every business has a 2–4 word phrase that puts them #1 — e.g. <em>&ldquo;Nashville Party Boat Rental,&rdquo; &ldquo;Pink Plumber,&rdquo; &ldquo;Mount Lawley Pest Control.&rdquo;</em> Problem: locals don&apos;t know to type it. Solution: plant it with melody.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                The 21-time rule
              </h3>
              <blockquote className="border-l-4 border-[#0f766e] bg-[#f0faf8] p-4 text-sm sm:text-base italic text-[#1a1a1a]">
                &ldquo;When you hear marketing information set to melody 20 times, on the 21st time you will never get it out of your subconscious for the rest of your life.&rdquo;
              </blockquote>
              <p className="text-sm sm:text-base">
                Proof: 30 years ago in Smyrna, Georgia, <em>The Pink Plumber</em> ran: <strong className="font-semibold">&ldquo;Google Pink, click the link, or call 404-222-PINK.&rdquo;</strong> Listeners still recite it decades later. Same mechanism as <em>800-588-2300 Empire Today</em>.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                The 15-second recipe
              </h3>
              <ol className="list-decimal space-y-2 pl-6 font-sans text-sm sm:text-base">
                <li><strong className="font-semibold">0–5s · The anchor:</strong> sing the exact search term + who you are. Must land before &ldquo;Skip&rdquo; appears.</li>
                <li><strong className="font-semibold">5–12s · The benefit:</strong> plain-spoken promise in owner voice.</li>
                <li><strong className="font-semibold">12–15s · The nudge:</strong> &ldquo;Search [term] today!&rdquo; or phone.</li>
              </ol>
              <TrapBox>
                <strong className="font-semibold text-black">Golden rule — don&apos;t &ldquo;help&rdquo; with lyrics.</strong> Owners love slogans and rhymes that kill the earworm. Mike&apos;s line: <em>&ldquo;We write the lyrics, we pick the music, we follow the formula. If you don&apos;t like the free AI version, we&apos;ll do a $2,000 studio version however you want.&rdquo;</em> Nobody ever pays the $2,000.
              </TrapBox>
            </BookChapter>

            {/* Chapter 4 */}
            <BookChapter id="ch-4" pageNumber="17">
              <Kicker>Chapter 4 · Weapon B</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The YouTube loophole (legal, built into Google&apos;s billing)
              </h2>
              <p className="text-sm sm:text-base">
                Over half of local YouTube now plays on <strong className="font-semibold">living-room Smart TVs</strong>. Skippable ads force 5 seconds of watching — and Google <strong className="font-semibold">charges $0 if they skip before 30 seconds</strong>.
              </p>
              <div className="overflow-x-auto rounded-xl border border-[#e7e0d0] shadow-xs">
                <table className="w-full border-collapse font-sans text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#f5f1e4] text-left uppercase tracking-wider text-[#5b5b5b]">
                      <th className="border-b border-[#e7e0d0] p-3 font-bold">0–5s (mandatory, free)</th>
                      <th className="border-b border-[#e7e0d0] p-3 font-bold">6–30s (skippable)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">Jingle starts instantly. Brand + search term sung. 100% hear it.</td>
                      <td className="p-3">Problem, proof, offer. Pay only if watched to 30s or clicked.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm sm:text-base">
                <strong className="font-semibold">The living-room effect:</strong> kids watching <em>Bluey</em>, remote on the coffee table — nobody dives to skip. Even at 70–80% skip rates, everyone heard you.
              </p>
              <ProofBox>
                <strong className="font-semibold text-black">Abilene, Texas pest control:</strong> 8 million skips (free saturation) + 3 million full views on ~$200–$400/mo ad spend. Revenue tripled and quadrupled. Families hummed it daily.
              </ProofBox>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                Targeting: geography beats guesswork
              </h3>
              <p className="text-sm sm:text-base">
                Don&apos;t micro-filter age, interests, parental status. Draw a tight <strong className="font-semibold">15–20 mile radius / zip cluster</strong> and let Google&apos;s machine find buyers.
              </p>
            </BookChapter>

            {/* Chapter 5 */}
            <BookChapter id="ch-5" pageNumber="20">
              <Kicker>Chapter 5 · Weapon C</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The page that rings: one problem, one video, one button
              </h2>
              <p className="text-sm sm:text-base">
                Mike&apos;s founding discovery: <strong className="font-semibold">&ldquo;People will watch before they read.&rdquo;</strong> Replace bloated 20-page sites with one focused Video Sales Letter per urgent problem.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                The 5-part page
              </h3>
              <ol className="list-decimal space-y-2 pl-6 font-sans text-sm sm:text-base">
                <li><strong className="font-semibold">Headline with risk reversal</strong> — see formula below</li>
                <li><strong className="font-semibold">45–60 sec video + jingle</strong> — solve the exact search, human face</li>
                <li><strong className="font-semibold">Proof strip</strong> — Google 5-stars / badges right under video</li>
                <li><strong className="font-semibold">Plain-spoken copy</strong> — agitate the pain, answer FAQs</li>
                <li><strong className="font-semibold">Sticky tap-to-call</strong> — always in the mobile thumb zone</li>
              </ol>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                The headline that has worked 15 years
              </h3>
              <blockquote className="border-l-4 border-[#0f766e] bg-[#f0faf8] p-4 text-sm sm:text-base italic text-[#1a1a1a]">
                &ldquo;We will give you the most thorough, amazing, unbelievable [service] guaranteed or it&apos;s free.&rdquo;
              </blockquote>
              <p className="text-sm sm:text-base">
                HVAC: <em>&ldquo;We will make your house ice cold or it&apos;s free.&rdquo;</em> Plumbing: <em>&ldquo;We will fix your leaky toilet today guaranteed or it&apos;s free.&rdquo;</em> Roofing: <em>&ldquo;Your roof will not leak, guaranteed or it&apos;s free.&rdquo;</em> Anxious homeowners just want safety. Almost nobody claims — they just call.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                Ads that feed it: Problem → Agitate → &ldquo;Watch my video&rdquo;
              </h3>
              <p className="text-sm sm:text-base">
                Dan Kennedy style: <em>&ldquo;Tired of termites? Scared they&apos;re eating your home? Want them gone today? Watch my video.&rdquo;</em> Adding <strong className="font-semibold">&ldquo;Watch my video&rdquo;</strong> quadrupled click-through — it promises clarity, not homework.
              </p>
            </BookChapter>

            {/* Chapter 6 */}
            <BookChapter id="ch-6" pageNumber="24">
              <Kicker>Chapter 6 · Save your money</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                Two traps that eat local budgets
              </h2>
              <TrapBox>
                <strong className="font-semibold text-black">Trap 1 · The award-winning website.</strong> Giant sliders, stock video, clever slogans (&ldquo;Excellence in Every Pipe&rdquo;) push your number below the fold. Result: ~90% bounce in 10 seconds. An award is often a <em>negative</em> indicator of calls. And never hide &ldquo;call&rdquo; behind a hamburger menu.
              </TrapBox>
              <TrapBox>
                <strong className="font-semibold text-black">Trap 2 · The social-media walled garden.</strong> Dopamine scrolling isn&apos;t emergency intent — nobody with a burst pipe opens Instagram. Worse, Facebook/Instagram hide posts from Google and AI crawlers. Posts on <em>your</em> domain compound for years; social posts evaporate.
              </TrapBox>
            </BookChapter>

            {/* Chapter 7 */}
            <BookChapter id="ch-7" pageNumber="27">
              <Kicker>Chapter 7 · It works in real towns</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                Proof, not promises
              </h2>
              <div className="space-y-4">
                <ProofBox>
                  <strong className="font-semibold text-black">West Texas Pest Patrol — Abilene, TX.</strong> 15-sec jingle + geo-only pre-rolls. 8M skips + 3M views. Revenue 3–4x. Kids&apos; TV did the selling.
                </ProofBox>
                <ProofBox>
                  <strong className="font-semibold text-black">Nashville Party Boat — Nashville, TN.</strong> Season wiped out in May. Exact-match domain + 1-page VSL (&ldquo;Book Your Boat&rdquo;) + jingle + $250/mo ads. $0 → $80,000 first summer, 40 charters, sold-out weekends, #1 Map Pack.
                </ProofBox>
                <ProofBox>
                  <strong className="font-semibold text-black">Local Nashville Honey — Nashville, TN.</strong> No shipping, just booth traffic. Local content + jingle. #1 for &ldquo;local honey near me,&rdquo; biggest months ever, $0 ad spend.
                </ProofBox>
                <ProofBox>
                  <strong className="font-semibold text-black">Mount Lawley Pest Control — Perth, Australia (Glenn Mott, solo operator).</strong> 5-year goal: $500k/yr. Deployed problem-specific video pages + SERP jingle + Dan Kennedy agitation ads. Hit the goal in <strong className="font-semibold">year 2</strong> — 3 years early.
                </ProofBox>
                <ProofBox>
                  <strong className="font-semibold text-black">Haynes Pest Control — Avon Park, FL.</strong> Full VSL + jingle + skippable pre-rolls (50% on living-room TVs). <strong className="font-semibold">+23% (+$172,500) in 7 months</strong>, +7 hires in 2025, 1M+ video views.
                </ProofBox>
                <ProofBox>
                  <strong className="font-semibold text-black">Ted Yeatts — Tampa, FL (agency proof).</strong> No audio/coding background. After <strong className="font-semibold">two 1-hour Zooms</strong>, launched a full-time retainer practice purely via BNI/chamber 1-on-1 audits — signing monthly clients and hosting podcasts for local groups. Proves the playbook transfers.
                </ProofBox>
              </div>
            </BookChapter>

            {/* Chapter 8 */}
            <BookChapter id="ch-8" pageNumber="31">
              <Kicker>Chapter 8 · What to do Monday</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                Your next step: a 20-minute audit
              </h2>
              <p className="text-sm sm:text-base">
                Small owners &ldquo;don&apos;t know what they don&apos;t know&rdquo; — and get spammed by faceless agencies. The fix is a short, in-person diagnostic:
              </p>
              <ol className="list-decimal space-y-2 pl-6 font-sans text-sm sm:text-base">
                <li>Google your money term — are you in the Map Pack?</li>
                <li>Open your site on your phone — can you call in one tap without scrolling or menus?</li>
                <li>Count reviews — under 20, unanswered 1-stars, no owner replies?</li>
                <li>Search your blog — zero indexed answers on your own domain?</li>
              </ol>
              <div className="rounded-xl bg-[#0f766e] p-5 font-sans text-sm font-medium text-white shadow-md">
                If you failed 2 or more: get the audit. Bring one problem (&ldquo;termites,&rdquo; &ldquo;leaky roof,&rdquo; &ldquo;slow season&rdquo;). Leave with one page, one video outline, and one jingle lyric to test.{" "}
                <a href="#audit" className="font-bold underline underline-offset-4 hover:text-emerald-200">
                  Run the 5-minute self-audit ↓
                </a>
              </div>
            </BookChapter>

            {/* Chapter 9 */}
            <BookChapter id="ch-9" pageNumber="34">
              <Kicker>Chapter 9 · Weapon D</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                How content gets made (without you writing)
              </h2>
              <p className="text-sm sm:text-base">
                <em>&ldquo;It&apos;s a shorter distance from your brain to your tongue than to your hands.&rdquo;</em> Owners freeze at keyboards but can&apos;t stop talking when asked the right technical question. So never start with &ldquo;write a blog.&rdquo; Start with talk, then transcribe.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                The 5-step extraction
              </h3>
              <ol className="list-decimal space-y-2 pl-6 font-sans text-sm sm:text-base">
                <li><strong className="font-semibold">Name 50 problems you solve.</strong> Not &ldquo;we kill bugs&rdquo; — list them: subterranean termites, drywood termites, bedbugs, German roaches, brown recluse, roof rats…</li>
                <li><strong className="font-semibold">Pick one diagnostic question:</strong> <em>&ldquo;What are subterranean termites, and why are they dangerous to a foundation?&rdquo;</em></li>
                <li><strong className="font-semibold">Record 3 minutes.</strong> Phone voice memo is fine — explain it like to a neighbor.</li>
                <li><strong className="font-semibold">Transcribe to your domain.</strong> Full text = blog post + FAQ schema. Audio stays embedded.</li>
                <li><strong className="font-semibold">Syndicate the audio.</strong> One RSS feed → Apple, Spotify, Amazon, YouTube = free authoritative backlinks.</li>
              </ol>
              <LessonBox>
                <strong className="font-semibold text-black">50-problems worksheet (15 min):</strong> Draw 5 columns × 10 rows. Columns: Pests / Complaints / Seasons / Prices asked / Jobs you love. Fill 50 cells. Circle the 4 most-asked — that&apos;s this month&apos;s content.
              </LessonBox>
              <LessonBox>
                <strong className="font-semibold text-black">Recorder checklist:</strong> Quiet truck/office · phone 6 inches away · 3 min max · state name + town + problem first · end with &ldquo;Search [SERP term] or tap to call.&rdquo;
              </LessonBox>
            </BookChapter>

            {/* Chapter 10 */}
            <BookChapter id="ch-10" pageNumber="38">
              <Kicker>Chapter 10 · Owner terms</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                The AI factory: you approve, we produce
              </h2>
              <p className="text-sm sm:text-base">
                What used to cost $2,000+ in studio time now runs monthly: scripts drafted for your town, voiced in your cloned voice incl. Spanish, 15-sec jingle, published + syndicated with full transcripts. Core ~$300/mo, full growth with ads management ~$500/mo + ad spend. Your heavy lifting: reply YES.
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1a1a1a] pt-2">
                SMS approval flow
              </h3>
              <ol className="list-decimal space-y-2 pl-6 font-sans text-sm sm:text-base">
                <li><strong className="font-semibold">1st of month:</strong> you get text with 4 topics (&ldquo;Reply YES to approve&rdquo;).</li>
                <li><strong className="font-semibold">You reply YES.</strong> We draft, voice, mix jingle intro/outro.</li>
                <li><strong className="font-semibold">Weekly:</strong> 1 post + episode goes live on your site, then Apple/Spotify/YouTube.</li>
                <li><strong className="font-semibold">End of month:</strong> 5-min Zoom: calls, rankings, next 4 topics.</li>
              </ol>
              <TrapBox>
                <strong className="font-semibold text-black">What you never do:</strong> write, edit audio, log into dashboards, pick music. If you want custom studio lyrics, that&apos;s the $2,000 option — nobody takes it because the free AI version rings the phone.
              </TrapBox>
            </BookChapter>

            {/* Appendix A */}
            <BookChapter id="audit" pageNumber="41">
              <Kicker>Appendix A · Tear-out worksheet</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                5-minute self-audit worksheet
              </h2>
              <ol className="list-decimal space-y-3 pl-6 font-sans text-sm sm:text-base">
                <li>Does your Google Ad (or search result) go to your homepage instead of one problem page?</li>
                <li>On mobile, is there a sticky tap-to-call button with no menu hunting?</li>
                <li>Does your hero waste the screen on sliders while hiding reviews + phone?</li>
                <li>GBP: &lt;20 reviews, unanswered 1-stars, zero owner replies, no fresh photos?</li>
                <li>All content trapped on Facebook/Instagram, zero articles/podcasts on your domain?</li>
              </ol>
              <p className="font-sans text-xs sm:text-sm font-semibold text-[#5b5b5b] pt-1">
                Score: 0 fails = defend the lead · 1–2 = fix this month · 3+ = you need the full playbook.
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0c615a] active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Failed 2 or more? Request Free Audit</span>
                </Link>
                <a
                  href="tel:+13103799822"
                  className="inline-flex items-center space-x-2 rounded-xl border border-[#e7e0d0] bg-white px-5 py-3 text-sm font-semibold text-[#1a1a1a] shadow-xs transition hover:bg-[#f5f1e4] active:scale-95"
                >
                  <Phone className="h-4 w-4 text-[#0f766e]" />
                  <span>Call Joe Terry: (310) 379-9822</span>
                </a>
              </div>
            </BookChapter>

            {/* Appendix B */}
            <BookChapter id="glossary" pageNumber="44">
              <Kicker>Appendix B · No jargon</Kicker>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                Plain-English glossary
              </h2>
              <p className="text-sm sm:text-base italic text-[#5b5b5b]">
                Every technical term in this book, in one place — each with the chapter where it pays off.
              </p>
              <dl className="divide-y divide-[#e7e0d0] rounded-xl border border-[#e7e0d0] bg-white shadow-xs">
                <div className="p-4 sm:p-5">
                  <dt className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-[#1a1a1a]">
                    1-on-1 audit <a href="#ch-8" className="rounded-full bg-[#f5f1e4] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition">Ch. 8</a>
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-sans text-[#5b5b5b]">
                    A 20-minute in-person diagnostic of a business&apos;s map listing, mobile site, reviews, and content. Owners buy from people who show the flaw, not pitch decks.
                  </dd>
                </div>
                <div className="p-4 sm:p-5">
                  <dt className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-[#1a1a1a]">
                    Earworm (SERP-term jingle) <a href="#ch-3" className="rounded-full bg-[#f5f1e4] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition">Ch. 3</a>
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-sans text-[#5b5b5b]">
                    A 15-second song built on your exact search term. Heard ~20 times, it lodges in memory permanently — e.g. &ldquo;Google Pink, click the link, or call 404-222-PINK.&rdquo;
                  </dd>
                </div>
                <div className="p-4 sm:p-5">
                  <dt className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-[#1a1a1a]">
                    Pre-roll arbitrage <a href="#ch-4" className="rounded-full bg-[#f5f1e4] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition">Ch. 4</a>
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-sans text-[#5b5b5b]">
                    Google charges $0 when viewers skip before 30 seconds — so millions hear your 5-second jingle free. Legal, built into Google&apos;s billing.
                  </dd>
                </div>
                <div className="p-4 sm:p-5">
                  <dt className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-[#1a1a1a]">
                    VSL (Video Sales Letter) <a href="#ch-5" className="rounded-full bg-[#f5f1e4] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition">Ch. 5</a>
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-sans text-[#5b5b5b]">
                    One page, one urgent problem, one 45–60 second video, one call button. People watch before they read — replace the 20-page brochure site.
                  </dd>
                </div>
                <div className="p-4 sm:p-5">
                  <dt className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-[#1a1a1a]">
                    Sticky tap-to-call <a href="#ch-5" className="rounded-full bg-[#f5f1e4] px-2.5 py-0.5 text-[11px] font-sans font-semibold text-[#0f766e] hover:bg-[#0f766e] hover:text-white transition">Ch. 5</a>
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-sans text-[#5b5b5b]">
                    A call button pinned in the mobile thumb zone on every page. One tap, no menu hunting — over 90% of your callers are on phones.
                  </dd>
                </div>
              </dl>
            </BookChapter>

            {/* Appendix C · The Stewart Quotes Index */}
            <BookChapter id="quotes-index-leaf" pageNumber="48">
              <BookQuotesIndex quotes={stewartQuotes} />
            </BookChapter>

            {/* Back Book Cover Leaf */}
            <div className="rounded-2xl border-2 border-[#e7e0d0] bg-[#fffdf7] p-8 text-center space-y-4 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#0f766e]">
                Colophon
              </p>
              <p className="text-xs font-serif text-[#5b5b5b] max-w-md mx-auto">
                Retold from <em>Lessons of Local Internet Presence</em> · Mike Stewart / LocalInternetPresence.com · Published by Derivative Genius.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-[#5b5b5b] pt-2">
                <Link href="/" className="inline-flex items-center gap-1 text-[#0f766e] hover:underline font-semibold">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Derivative Genius Home</span>
                </Link>
                <span>·</span>
                <Link href="/contact" className="text-[#0f766e] hover:underline font-semibold">
                  Request an Audit for Your Town
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
