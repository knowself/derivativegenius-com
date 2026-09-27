import React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Bug, Stethoscope } from "lucide-react";

export const metadata = {
  title: "Free 5-Minute Website Audit | Derivative Genius",
  description:
    "Local service business owners: find out exactly where you're invisible online. Pick your industry and claim your free five-minute website audit.",
};

const INDUSTRIES = [
  {
    icon: Flame,
    name: "Heating & Cooling",
    slug: "/free-audit-hvac",
    available: true,
    blurb: "HVAC shops: be the name Google and AI assistants say at 9 PM.",
  },
  {
    icon: Bug,
    name: "Pest Control",
    slug: "/free-audit-pest-control",
    available: true,
    blurb: "Pest control operators: be the name Google says when the ants invade.",
  },
  {
    icon: Stethoscope,
    name: "Dentists",
    slug: "#",
    available: false,
    blurb: "Coming soon.",
  },
];

export default function FreeAuditIndexPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Derivative <span className="text-amber-400">Genius</span>
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Free 5-minute website audit
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400">
          Pick your industry. You&apos;ll see exactly where your business is
          invisible online — and the first thing we&apos;d fix.
        </p>

        <div className="mt-10 grid gap-5 text-left sm:grid-cols-3">
          {INDUSTRIES.map((ind) =>
            ind.available ? (
              <Link
                key={ind.name}
                href={ind.slug}
                className="group rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6 transition hover:border-amber-400/70"
              >
                <ind.icon className="h-8 w-8 text-amber-400" />
                <h2 className="mt-4 text-lg font-bold">{ind.name}</h2>
                <p className="mt-2 text-sm text-neutral-400">{ind.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-amber-300">
                  Start my audit{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ) : (
              <div
                key={ind.name}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 opacity-50"
              >
                <ind.icon className="h-8 w-8 text-neutral-500" />
                <h2 className="mt-4 text-lg font-bold text-neutral-300">
                  {ind.name}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">{ind.blurb}</p>
              </div>
            )
          )}
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
