import React from "react";
import Link from "next/link";
import { Cpu, Layers, Zap, Globe, CheckCircle, ArrowRight, MessageSquareText, Search, Workflow } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ServicesPage() {
  const servicePackages = [
    {
      title: "AI-Native Web Application Sprint",
      subtitle: "Plain English: Your Smart Digital Employee",
      plainExplanation:
        "Instead of a static brochure website where users just read text, your website acts like a smart digital employee that interacts with visitors in real time.",
      icon: Cpu,
      price: "Custom Scope",
      features: [
        "Full-stack Next.js 16 App Router & React 19 architecture",
        "Embedded LLM inference (OpenAI, Claude, custom endpoints)",
        "Responsive Tailwind CSS UI with glassmorphic aesthetics",
        "Server-side Zod validation & secure API routes",
        "Sub-second loading & Core Web Vitals optimization",
      ],
    },
    {
      title: "Embedded Smart Thinking & Thinking",
      subtitle: "Plain English: 24/7 Digital Assistant",
      plainExplanation:
        "Having a 24/7 assistant sitting inside your app. When a client submits a question or uploads a document, the app instantly understands it, summarizes it, or writes a response.",
      icon: MessageSquareText,
      price: "Custom Scope",
      features: [
        "Secure user authentication & role-based permissions",
        "Automated client onboarding & workflow triggers",
        "Real-time analytics & interactive chart visualizations",
        "Durable database persistence & backup setup",
        "Multi-tenant data isolation & privacy compliance",
      ],
    },
    {
      title: "Smart Semantic Search",
      subtitle: "Plain English: Search by Meaning, Not Exact Words",
      plainExplanation:
        "Like asking a human librarian 'Find me something on starting a small business' instead of typing exact book titles. The search bar understands what users mean, even with typos.",
      icon: Search,
      price: "Custom Scope",
      features: [
        "Vector embeddings (text-embedding-3) & similarity search",
        "Semantic search & document indexing setup",
        "AI chatbot & autonomous agent widget embedding",
        "Third-party API orchestration & webhooks",
        "Comprehensive API documentation & SDK setup",
      ],
    },
    {
      title: "Autonomous Workflows & Modernization",
      subtitle: "Plain English: Digital Dominoes",
      plainExplanation:
        "When a customer fills out a form on your site, the app automatically emails them a custom estimate, creates their client record, and alerts your team without manual copy-pasting.",
      icon: Workflow,
      price: "Custom Scope",
      features: [
        "Migration from legacy web frameworks to Next.js 16",
        "TypeScript static type safety & error reduction",
        "Tailwind CSS v3 design system conversion",
        "SEO & Generative Engine Optimization (GEO) setup",
        "Vercel & Firebase multi-cloud deployment setup",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="mx-auto inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          AI Automation Agency
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI-First Web Development Services
        </h1>
        <p className="text-lg text-slate-300">
          We build the digital systems that help small businesses and growth-stage teams streamline operations, improve customer experience, and convert more opportunity into action.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {servicePackages.map((pkg, idx) => {
          const IconComp = pkg.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <IconComp className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-2xl">{pkg.title}</CardTitle>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  {pkg.subtitle}
                </div>
                <p className="text-xs text-slate-300 bg-slate-950/60 rounded-lg p-3 border border-slate-800/80 mt-2 leading-relaxed">
                  💡 {pkg.plainExplanation}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm text-slate-300">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500"
                  >
                    <span>Request Scoping Proposal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
