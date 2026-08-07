import React from "react";
import Link from "next/link";
import { Sparkles, Code2, Cpu, ArrowRight, CheckCircle2, MessageSquareText, Search, Workflow, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DemosShowcase } from "@/components/DemosShowcase";
import { ProjectCalculator } from "@/components/ProjectCalculator";
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
    "A lightning-fast website that looks stunning and modern.",
    "Saves dozens of hours of manual administrative work every week.",
    "Turns casual website visitors into qualified, paying clients automatically.",
  ];

  return (
    <div className="space-y-24 pb-20 pt-12">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-First Web Development Agency</span>
        </div>

        <h1 className="mt-6 font-extrabold text-4xl tracking-tight text-white sm:text-6xl lg:text-7xl">
          Build Intelligent Web Apps <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Powered by Autonomous AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed">
          <em className="text-white italic">"We are all standing on the shoulders of giants."</em> Living in a time when each of us can utilize the intellectual tools ever conceived by humankind to revolutionize our businesses. Derivative Genius builds the AI-first web applications and knowledge bases that power your growth.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
          >
            <span>Start Your Web Project</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/solutions"
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-slate-600 hover:bg-slate-800"
          >
            <span>Explore Industry Demos</span>
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

      {/* Demos Showcase from live website */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DemosShowcase />
      </section>

      {/* Interactive Project Calculator */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProjectCalculator />
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
