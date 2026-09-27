import React from "react";
import Link from "next/link";
import {
  Search,
  Bot,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Phone,
  PlayCircle,
  Wrench,
} from "lucide-react";

export const metadata = {
  title: "Free 5-Minute Website Audit | Derivative Genius",
  description:
    "Heating and cooling shop owners: find out exactly where you're invisible online. Watch Joe's 51-second video, then claim your free five-minute website audit.",
};

const AUDIT_POINTS = [
  {
    icon: Search,
    title: "Google visibility check",
    body: "Where your shop ranks when someone nearby searches for heating and cooling help — and who's outranking you.",
  },
  {
    icon: Bot,
    title: "AI-assistant citability",
    body: "Whether ChatGPT and other AI assistants name your shop when a homeowner asks who to call at 9 PM.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile review",
    body: "The quick wins hiding in your profile: categories, photos, reviews, and the fields most shops leave empty.",
  },
];

const STEPS = [
  {
    icon: PlayCircle,
    title: "Watch the video",
    body: "51 seconds. Joe explains exactly why great shops stay invisible — and what fixes it.",
  },
  {
    icon: Phone,
    title: "Claim your audit",
    body: "One email. No forms, no phone tag, no pressure. Just your shop name and website.",
  },
  {
    icon: Wrench,
    title: "Get your first fix",
    body: "You'll see exactly where you're invisible online — and the first thing Joe would fix.",
  },
];

const mailto =
  "mailto:joe@derivativegenius.com?subject=Free%205-minute%20website%20audit&body=Hi%20Joe%2C%0A%0AI%27d%20like%20my%20free%205-minute%20website%20audit.%0A%0AShop%20name%3A%20%0AWebsite%3A%20%0A%0AThanks!";

export default function FreeAuditPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Derivative <span className="text-amber-400">Genius</span>
        </Link>
        <a
          href={mailto}
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
          Most great shops are invisible online. Watch this 51-second video,
          then get a free five-minute audit showing exactly where you&apos;re
          invisible — and what to fix first.
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
          href={mailto}
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
            What the audit covers
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

        <div className="mt-12 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-8 text-center">
          <h3 className="text-2xl font-extrabold">
            Ready to be the obvious call?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            One email gets you a real human review of your shop&apos;s online
            visibility — free, with zero obligation.
          </p>
          <a
            href={mailto}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-lg font-bold text-neutral-950 transition hover:bg-amber-300"
          >
            <CheckCircle2 className="h-5 w-5" /> Claim my free audit
          </a>
        </div>
      </section>

      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Derivative Genius · Lake County, CA
          </p>
          <Link href="/" className="hover:text-neutral-300">
            Back to homepage
          </Link>
        </div>
      </footer>
    </main>
  );
}
