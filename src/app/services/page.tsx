import React from "react";
import Link from "next/link";
import { Cpu, Layers, Zap, Globe, CheckCircle, ArrowRight, MessageSquareText, Search, Workflow } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ServicesPage() {
  const servicePackages = [
    {
      title: "AI Web Apps",
      problem: "Your business is stuck with slow, outdated, or manual workflows.",
      solution: "We build custom AI-powered web apps that automate repetitive work and improve the customer experience.",
      outcome: "The result is faster operations, better conversion, and a system your team actually wants to use.",
      icon: Cpu,
      features: [
        "Custom web app builds",
        "AI-assisted user experiences",
        "Clean UX + strong conversion strategy",
      ],
    },
    {
      title: "Client Portals",
      problem: "Customers and internal teams are juggling email, spreadsheets, and disconnected tools.",
      solution: "We create secure portals where people can log in, submit requests, track progress, and get the right information instantly.",
      outcome: "You reduce back-and-forth, improve visibility, and create a smoother client experience.",
      icon: MessageSquareText,
      features: [
        "Client dashboards",
        "Secure access controls",
        "Workflow automation",
      ],
    },
    {
      title: "AI Integration",
      problem: "Your team has data, tools, and processes, but they don’t talk to each other.",
      solution: "We connect your apps, tools, and AI features so the right information moves automatically.",
      outcome: "You get faster decisions, less manual work, and systems that scale with your business.",
      icon: Workflow,
      features: [
        "API and automation work",
        "AI copilots and assistants",
        "Tool integrations",
      ],
    },
    {
      title: "Website Redesign",
      problem: "Your current website is not converting visitors into qualified opportunities.",
      solution: "We redesign your site around clarity, trust, and conversion-focused messaging.",
      outcome: "You look more credible, explain your offer better, and generate more inbound leads.",
      icon: Globe,
      features: [
        "Modern UX and messaging",
        "Lead capture and CTAs",
        "Performance and SEO support",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <div className="mx-auto inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          AI Automation Agency
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Build the systems that save time and win more business.
        </h1>
        <p className="text-lg text-slate-300">
          Most businesses do not need more ideas. They need clearer systems, smoother operations, and a website that turns interest into action.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500"
          >
            Start Your Project
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            See Our Work
          </Link>
        </div>
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
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3 text-sm text-slate-300">
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Problem</div>
                    <p>{pkg.problem}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Solution</div>
                    <p>{pkg.solution}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Outcome</div>
                    <p>{pkg.outcome}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500"
                >
                  <span>Request a Proposal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/60 to-slate-950/80 p-8 text-center">
        <h2 className="text-3xl font-bold text-white">Need a better system, not more busywork?</h2>
        <p className="mt-3 text-slate-300">
          We help teams replace friction with automation, clarity, and digital experiences that actually drive results.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Book a Discovery Call
          </Link>
        </div>
      </div>
    </div>
  );
}
