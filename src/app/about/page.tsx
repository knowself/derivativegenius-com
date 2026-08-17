import React from "react";
import Link from "next/link";
import { Code2, Terminal, Shield, Cpu, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Edit these to add your photo and personal message
const AUTHOR_IMAGE = "/images/author.jpg"; // place your photo at /public/images/author.jpg
const AUTHOR_NAME = "Joe Terry";
const AUTHOR_MESSAGE = `Hi — I'm the founder of Derivative Genius. I help teams apply AI to real business problems, build reliable automation, and ship high-velocity web products.`;

export default function AboutPage() {
  const pillars = [
    {
      title: "Agentic Engineering Methodology",
      description:
        "We harness specialized AI developer agents (`.agent/` suite) to compress development timelines from months to days while enforcing clean code standards.",
      icon: Terminal,
    },
    {
      title: "Strict Security & Validation",
      description:
        "Every client application is built with server-side Zod input schemas, strict environment credential isolation, and secure edge API routing.",
      icon: Shield,
    },
    {
      title: "Modern Next.js 16 Stack",
      description:
        "We build exclusively on modern, high-speed technologies: Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v3.",
      icon: Cpu,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="max-w-4xl space-y-5">
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          AI Automation Agency
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          About Derivative Genius
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          We are an AI-first web development agency helping businesses turn manual work into automated systems, stale websites into growth engines, and hard-to-navigate experiences into clear digital journeys.
        </p>
        <p className="text-slate-300 leading-relaxed">
          We believe the most important advantage in business today is not just having tools—it is knowing how to apply them with clarity, speed, and real operational outcomes. Derivative Genius brings that advantage to modern brands, service businesses, and ambitious teams.
        </p>
        <div className="mt-6 flex items-center space-x-6">
          <img
            src={AUTHOR_IMAGE}
            alt={AUTHOR_NAME}
            className="h-64 w-64 rounded-full object-cover border border-slate-700 bg-slate-800"
          />
          <div>
            <h3 className="text-xl font-semibold text-white">{AUTHOR_NAME}</h3>
            <p className="mt-2 text-slate-300 leading-relaxed max-w-2xl">{AUTHOR_MESSAGE}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pillars.map((pil, idx) => {
          const IconComp = pil.icon;
          return (
            <Card key={idx}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <IconComp className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-xl">{pil.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {pil.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold text-white">We stand on the shoulders of giants.</h2>
        <p className="text-slate-300 leading-relaxed">
          Living in an era where every person can access powerful intellectual tools once reserved for large institutions, we build technology that helps businesses make better decisions, respond faster, and serve customers with more clarity.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Our job is to turn that possibility into a practical advantage: from AI workflow automation to custom web applications, search experiences, and intelligent business systems that actually reduce friction and increase revenue.
        </p>
        <p className="text-slate-300 leading-relaxed">
          There is so much about why, Derivative Genius. The original idea was TMOTI, the millennium of the individual, many years ago. But that only captures the impact of digital communications on the world. Digital value transfer, cryptocurrency and now digital intelligence amplification — “AI everywhere” — mark a new and transformative age and require a new Zeitgeist.
        </p>
        <p className="text-slate-300 leading-relaxed">
          That evolution means individuals and small teams can access tooling and infrastructure that used to require vast organizations. We design pragmatic systems that translate these capabilities into dependable products: predictable data pipelines, auditable model integrations, and UX that makes AI useful rather than mysterious.
        </p>
        <p className="text-slate-300 leading-relaxed">
          At Derivative Genius we focus on practical adoption — helping you move from experiments to reliable, measurable outcomes: automations that save time, search and recommendation systems that increase engagement, and bespoke apps that unlock new business models.
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            <span>Discuss Your Web Project</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
