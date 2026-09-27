import React from "react";
import Link from "next/link";
import {
  Search,
  Bot,
  MapPin,
  ArrowRight,
  Phone,
  PlayCircle,
  ClipboardList,
  Wrench,
} from "lucide-react";
import { AuditForm } from "@/components/AuditForm";

export const metadata = {
  title: "Free HVAC Website Audit for Heating & Cooling Shops | Derivative Genius",
  description:
    "HVAC owners: find out exactly where your shop is invisible online. Watch Joe's 51-second video, then claim your free five-minute HVAC website audit.",
  keywords: [
    "HVAC website audit",
    "HVAC marketing",
    "heating and cooling SEO",
    "HVAC lead generation",
    "free website audit",
  ],
  openGraph: {
    title: "Free HVAC Website Audit | Derivative Genius",
    description:
      "When someone's AC dies at 9 PM, does Google say your name? Get a free five-minute audit for your HVAC shop.",
    type: "website",
  },
};

const AUDIT_POINTS = [
  {
    icon: Search,
    title: "Google visibility check",
    body: "Where your HVAC shop ranks when someone nearby searches for heating and cooling help — and which competitors outrank you.",
  },
  {
    icon: Bot,
    title: "AI-assistant citability",
    body: "Whether ChatGPT and other AI assistants name your shop when a homeowner asks who to call at 9 PM.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile review",
    body: "The quick wins hiding in your profile: categories, photos, reviews, and the fields most HVAC shops leave empty.",
  },
];

const STEPS = [
  {
    icon: PlayCircle,
    title: "Watch the video",
    body: "51 seconds. Joe explains exactly why great HVAC shops stay invisible — and what fixes it.",
  },
  {
    icon: ClipboardList,
    title: "Fill in the form",
    body: "Shop name and website. Thirty seconds, no phone tag, no pressure.",
  },
  {
    icon: Wrench,
    title: "Get your first fix",
    body: "You'll see exactly where you're invisible online — and the first thing Joe would fix.",
  },
];

export default function FreeAuditHvacPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Derivative <span className="text-amber-400">Genius</span>
        </Link>
        <a
          href="#claim"
          className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-neutral-950 transition hover:bg-amber-300"
        >
          Claim free audit
        </a>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-8 text-center">
        <p className="mb-4 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
          For heating &amp; cooling shop owners
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          When someone&apos;s AC dies at 9 PM, does Google say{" "}
          <span className="text-amber-400">your name</span>?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-400">
          Most great HVAC shops are invisible online. Watch this 51-second
          video, then get a free five-minute audit showing exactly where
          you&apos;re invisible — and what to fix first.
        </p>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl shadow-black/60">
          <video
            className="aspect-video w-full bg-black"
            controls
            playsInline
            preload="metadata"
            poster="/videos/founder-poster.jpg"
          >
            <source
              src="/videos/founder-video-joe-terry.mp4"
              type="video/mp4"
            />
            Your browser doesn&apos;t support embedded video.
          </video>
        </div>

        <a
          href="#claim"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-lg font-bold text-neutral-950 transition hover:bg-amber-300"
        >
          Claim my free 5-minute audit <ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-3 text-sm text-neutral-500">
          No pressure. No invented numbers. Just the truth about your visibility.
        </p>
      </section>

      {/* what you get */}
      <section className="border-t border-neutral-900 bg-neutral-900/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            What the HVAC audit covers
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {AUDIT_POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6"
              >
                <p.icon className="h-8 w-8 text-amber-400" />
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-neutral-800">
                {i + 1}
              </span>
              <s.icon className="h-8 w-8 text-amber-400" />
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* claim form */}
        <div id="claim" className="mx-auto mt-12 max-w-2xl scroll-mt-24">
          <h3 className="text-center text-2xl font-extrabold">
            Ready to be the obvious call?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-center text-neutral-400">
            A real human review of your HVAC shop&apos;s online visibility —
            free, with zero obligation.
          </p>
          <div className="mt-6">
            <AuditForm industry="hvac" />
          </div>
          <p className="mt-6 text-center text-sm text-neutral-500">
            Rather talk?{" "}
            <a
              href="tel:+13103799822"
              className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-200"
            >
              <Phone className="h-4 w-4" /> (310) 379-9822
            </a>
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Derivative Genius · Lake County, CA
          </p>
          <div className="flex items-center gap-5">
            <Link href="/free-audit" className="hover:text-neutral-300">
              Other industries
            </Link>
            <Link href="/" className="hover:text-neutral-300">
              Back to homepage
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
