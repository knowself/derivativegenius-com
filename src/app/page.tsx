import React from "react";
import Link from "next/link";
import { Cpu, ArrowRight, CheckCircle2, MessageSquareText, Search, Workflow, UserCheck, Phone, BookOpen, Video, Mic, Music, Tv } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newsletter } from "@/components/Newsletter";
import { BookQuoteRotator } from "@/components/BookQuoteRotator";
import { EatYourOwnCooking } from "@/components/EatYourOwnCooking";
import { DemosShowcase } from "@/components/DemosShowcase";
import { getStewartQuotes } from "@/lib/stewart-quotes";

export default function HomePage() {
  const stewartQuotes = getStewartQuotes();
  const services = [
    {
      title: "AI-Native Custom Web Apps",
      subtitle: "Smart Digital Employee",
      description:
        "Instead of a static brochure site, your application acts like an intelligent digital employee that interacts with visitors in real time.",
      icon: Cpu,
      badge: "Core Offer",
    },
    {
      title: "Embedded Smart Thinking",
      subtitle: "24/7 Digital Assistant",
      description:
        "A 24/7 assistant inside your app that understands inquiries, summarizes documents, and writes instant responses.",
      icon: MessageSquareText,
      badge: "Intelligent",
    },
    {
      title: "Smart Semantic Search",
      subtitle: "Search by Meaning",
      description:
        "Like asking a human librarian—your site understands what users mean even if they misspell or use different words.",
      icon: Search,
      badge: "Concept Match",
    },
    {
      title: "Autonomous Workflows",
      subtitle: "Digital Dominoes",
      description:
        "Automated next steps: when a lead submits a form, your app instantly emails quotes, creates records, and alerts your team.",
      icon: Workflow,
      badge: "Automation",
    },
  ];

  const plainEnglishAnalogy = [
    {
      num: "01",
      title: "AI-Native Web Application",
      analogy: "Your Smart Digital Employee",
      text: "Instead of a static brochure website where users just read text, your website acts like a smart digital employee that interacts with visitors in real time.",
      icon: UserCheck,
    },
    {
      num: "02",
      title: "Embedded Smart Thinking",
      analogy: "24/7 Digital Assistant",
      text: "Having a 24/7 assistant sitting inside your app. When a client submits a question or uploads a document, the app instantly understands it, summarizes it, or writes a response.",
      icon: MessageSquareText,
    },
    {
      num: "03",
      title: "Smart Semantic Search",
      analogy: "Search by Meaning, Not Exact Words",
      text: "Like asking a human librarian 'Find me something on starting a small business' instead of having to type the exact book title. The search bar understands what the user means.",
      icon: Search,
    },
    {
      num: "04",
      title: "Autonomous Workflows",
      analogy: "Digital Dominoes",
      text: "When a customer fills out a form on your site, the app automatically emails them a custom estimate, creates their client record, and alerts your team without manual copy-pasting.",
      icon: Workflow,
    },
  ];

  const clientBenefits = [
    "A fast website that states what you do, who it's for, and how to call — above the fold on phones.",
    "Fewer repetitive inquiries: answers, intake, and booking handled on the site instead of by phone tag.",
    "A quote and booking path you can measure — calls, forms, and booked jobs, not pageviews.",
  ];

  const primaryOffers = [
    {
      title: "Single-Problem Video Landing Pages (VSL)",
      problem: "Paid clicks and homepage visitors bounce because one page tries to sell everything.",
      solution:
        "One problem, one page, no menu distractions. Problem-specific video container, instant trust proof, and a sticky 1-tap tel: call button for mobile.",
      bestFor: "Best for: HVAC emergency / replacement, plumbing, roofing — one high-intent search term per page.",
      icon: Video,
      badge: "Primary",
    },
    {
      title: "Local Authority & GEO Retainer",
      problem: "You're trapped on rented social land with nothing indexable for Google or AI assistants to cite.",
      solution:
        "Weekly owner-voice audio published on your domain as a rich transcript article, syndicated to Apple / Spotify / Amazon / YouTube for backlinks. Includes ongoing Google Business Profile maintenance.",
      bestFor: "Best for: shops that want to be cited by ChatGPT, Gemini, and Perplexity.",
      icon: Mic,
      badge: "Primary",
    },
    {
      title: "SERP-Term Jingle",
      problem: "People forget names, they remember tunes.",
      solution:
        "15-second musical signature built around your exact search term and phone anchor. Included in the Growth Retainer. Play it on your landing page, pre-roll, and shop hold line.",
      bestFor: "Best for: local recall when the customer finally needs you.",
      icon: Music,
      badge: "Primary",
    },
    {
      title: "Hyper-Local YouTube Pre-Roll",
      problem: "TV-grade branding felt out of reach for a single shop.",
      solution:
        "5-second skippable pre-roll architecture beamed to local living rooms and smart TVs. You pay $0 when skipped.",
      bestFor: "Best for: owning one town, not renting attention everywhere.",
      icon: Tv,
      badge: "Primary",
    },
  ];

  const pricingTiers = [
    {
      name: "Video Landing Page Package",
      price: "$1,500 fixed setup",
      note: "DT-18 pilot range: $1,500–$2,500 based on scope.",
      detail: "One-problem VSL landing page with video slot, proof strip, FAQ draft, and sticky call button.",
      secondary: false,
    },
    {
      name: "Core Local Presence & GEO Retainer",
      price: "$300/mo",
      note: "Recurring. Cancel anytime terms set at scoping.",
      detail: "Weekly audio + transcript article on your domain, podcast syndication for backlinks, GBP maintenance.",
      secondary: false,
    },
    {
      name: "Full-Service Growth Retainer",
      price: "$500/mo + client ad spend",
      note: "Recurring. Includes SERP-term jingle.",
      detail: "Everything in Core, plus jingle, pre-roll management, and reporting.",
      secondary: false,
    },
    {
      name: "Fixed-Scope Website (Secondary)",
      price: "$2,000–$5,000",
      note: "Sold secondarily.",
      detail: "Standalone site rebuild when a landing page isn't enough.",
      secondary: true,
    },
    {
      name: "MVP Web App Sprint (Secondary)",
      price: "$2,500–$5,000+",
      note: "Sold secondarily, on readiness.",
      detail: "Custom AI-native app work outside the local presence engine.",
      secondary: true,
    },
  ];

  return (
    <div className="space-y-24 pb-20 pt-12">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mt-6 text-balance font-extrabold leading-[1.08] tracking-tight text-white text-3xl sm:text-6xl lg:text-7xl">
          The Right Website and Local Search <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Makes Your Phone Ring
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed">
          We replace bloated agency websites with blazing-fast, single-problem landing pages and automated local presence engines engineered to turn search traffic into booked service calls.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-white">Need more calls for your service business?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-300">
          Call directly or request a zero-obligation 5-minute website and ad audit to see where you are leaking high-intent local customers.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="tel:+13103799822"
            className="inline-flex items-center space-x-2.5 rounded-xl bg-emerald-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/50 text-base"
          >
            <Phone className="h-5 w-5" />
            <span>Call Joe Terry: (310) 379-9822</span>
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-slate-600 hover:bg-slate-800 text-base"
          >
            <span>Request a Free Website Audit</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mx-auto mt-6 w-full">
          <Link
            href="/book"
            className="group flex w-full flex-col gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-5 text-left shadow-lg shadow-emerald-950/30 backdrop-blur-md transition-all hover:border-emerald-400/60 hover:bg-emerald-500/20 sm:flex-row sm:items-center sm:gap-5 sm:px-8"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-600/20">
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-1.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                New · Free Book — Local Internet Presence
              </span>
              <BookQuoteRotator quotes={stewartQuotes} />
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Eat Your Own Cooking: video + jingle + direct CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EatYourOwnCooking />
      </section>

      {/* In Plain English Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-8 sm:p-12 backdrop-blur-xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              💡 In Plain English: What We Build
            </h2>
            <p className="text-slate-300">
              You don’t need to manage vectors, servers, or API keys. We handle the heavy lifting behind the scenes so your business gets simple, powerful outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {plainEnglishAnalogy.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 space-y-3 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-400">{item.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {item.analogy}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Client Outcomes Banner */}
          <div className="border-t border-slate-800 pt-8 mt-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center sm:text-left">
              🔑 Why This Matters to Your Business
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {clientBenefits.map((ben, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-3 rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">{ben}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Offer: Local Presence / GEO / Direct-Response */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 backdrop-blur-xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Local Presence / GEO / Direct-Response — Our Primary Offer
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              The page that makes your phone ring.
            </h2>
            <p className="text-slate-300">
              Most local businesses don&apos;t need a bigger website. They need a single-problem page that turns search traffic into booked calls — plus a weekly presence engine that keeps Google and AI assistants citing you. That&apos;s what we build first.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {primaryOffers.map((offer, idx) => {
              const IconComp = offer.icon;
              return (
                <Card key={idx} className="relative overflow-hidden flex flex-col justify-between border-emerald-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                        {offer.badge}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-2xl">{offer.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed space-y-2">
                      <span className="block">
                        <span className="font-semibold text-slate-200">Problem: </span>
                        {offer.problem}
                      </span>
                      <span className="block">
                        <span className="font-semibold text-slate-200">What you get: </span>
                        {offer.solution}
                      </span>
                      <span className="block text-slate-400">{offer.bestFor}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Get Scope Estimate</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparent Pricing: primary-first */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-bold text-3xl text-white sm:text-4xl">Pricing, up front.</h2>
          <p className="mt-3 text-slate-400">
            Primary offers first. Custom app builds second, on readiness.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, idx) => (
            <Card
              key={idx}
              className={`relative overflow-hidden flex flex-col justify-between ${tier.secondary ? "opacity-90" : "border-emerald-500/20"}`}
            >
              <CardHeader>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {tier.price}
                </div>
                <CardTitle className="mt-2 text-xl">{tier.name}</CardTitle>
                <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {tier.detail}
                  <span className="mt-2 block text-xs text-slate-400">{tier.note}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Request a Proposal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
          <Card className="relative overflow-hidden flex flex-col justify-center border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">Need proof before you commit?</CardTitle>
              <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed">
                Request a zero-obligation 5-minute website and ad audit. We map one specific leak — no invented metrics, no pressure.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Request Free Audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Proof: live demo + scoped work (permission-safe, no invented claims) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DemosShowcase />
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-slate-500">
          Testimonials and verified reviews: [TBD — blocked on case-study citation permission. No quotes published until approved.]
        </p>
      </section>

      {/* Brand narrative: shoulders of giants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 text-center sm:text-left space-y-4">
          <h2 className="text-2xl font-bold text-white">We stand on the shoulders of giants.</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            Plain-English systems first, technical machinery second. That is why every offer above pairs a simple outcome — more calls, fewer missed jobs — with the build that produces it.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            <span>Read the agency story</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-bold text-3xl text-white sm:text-4xl">
            Secondary: Custom AI Web Apps — Sold on Readiness
          </h2>
          <p className="mt-3 text-slate-400">
            We do this work, but only after your call-generating presence is in place. Tailored web applications engineered for speed, engagement, and conversion.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <Card key={idx} className="relative overflow-hidden flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                      {srv.badge}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-2xl">{srv.title}</CardTitle>
                  <div className="text-xs font-semibold text-blue-400 mt-1">{srv.subtitle}</div>
                  <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {srv.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Get Scope Estimate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </div>
  );
}
