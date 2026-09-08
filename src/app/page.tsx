import React from "react";
import Link from "next/link";
import { Cpu, ArrowRight, CheckCircle2, MessageSquareText, Search, Workflow, UserCheck, Phone, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newsletter } from "@/components/Newsletter";

export default function HomePage() {
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

  return (
    <div className="space-y-24 pb-20 pt-12">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mt-6 text-balance font-extrabold leading-[1.08] tracking-tight text-white text-3xl sm:text-6xl lg:text-7xl">
          We Build Websites & Prime Local Search Engines <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            To Make Your Phone Ring
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
        <div className="mx-auto mt-6 flex max-w-2xl justify-center">
          <Link
            href="/book"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 text-center shadow-lg shadow-emerald-950/30 backdrop-blur-md transition-all hover:border-emerald-400/60 hover:bg-emerald-500/20 sm:gap-4 sm:px-8"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-600/20">
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </span>
            <span className="text-left">
              <span className="mb-0.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                New · Free Book
              </span>
              <span className="block text-base font-semibold leading-snug text-white sm:text-lg">
                Read Local Internet Presence — the Mike Stewart playbook that powers our audits
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-emerald-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
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

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-bold text-3xl text-white sm:text-4xl">
            Our Web Development Packages
          </h2>
          <p className="mt-3 text-slate-400">
            Tailored web applications engineered for speed, engagement, and conversion.
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
