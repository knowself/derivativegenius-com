import React from 'react';
import Link from 'next/link';
import { Globe, CheckCircle2, ArrowRight, ShieldCheck, Clock, Sparkles, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Fixed-Scope Website Packages ($2,000 - $5,000) | Derivative Genius',
  description: 'High-converting, high-speed website engineering built specifically for established businesses to win more customers.',
};

export default function WebsiteServicesPage() {
  const packages = [
    {
      name: "Starter Site",
      price: "$2,000",
      timeline: "2 Weeks",
      target: "Established service businesses needing an immediate credibility upgrade and clear lead capture.",
      features: [
        "Up to 5 custom-designed high-speed pages",
        "Mobile-first ergonomic design & touch zones",
        "Zod-validated lead intake form",
        "Google Maps & local SEO foundation",
        "Sub-100ms Core Web Vitals optimization",
      ],
      notIncluded: ["Custom web app portals", "E-commerce inventory engine"],
    },
    {
      name: "Growth Engine",
      price: "$3,500",
      badge: "Most Popular",
      timeline: "2 - 3 Weeks",
      target: "Growing companies looking to capture higher-value commercial inquiries and outperform local competitors.",
      features: [
        "Up to 10 custom conversion-built pages",
        "Plain-English service explainer framework",
        "Dynamic interactive quote / scoping calculator",
        "Automated email notification dispatch",
        "Full SEO & GEO (Generative Engine) schema markup",
        "30 days post-launch technical support",
      ],
      notIncluded: ["Custom GPU LLM hosting"],
    },
    {
      name: "Enterprise Conversion Portal",
      price: "$5,000",
      timeline: "3 Weeks",
      target: "Established multi-location practices or commercial firms requiring intelligent customer interactions.",
      features: [
        "Full multi-page custom Next.js 16 web application",
        "Embedded AI Assistant / Lead Qualifier bot",
        "Dedicated Client Request & Intake Portal",
        "Advanced Analytics & First-Party Event Tracking",
        "Priority 90-day maintenance & SLA assurances",
      ],
      notIncluded: ["Ongoing third-party ad spend"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="mx-auto max-w-4xl text-center space-y-6">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          <Globe className="w-3.5 h-3.5" /> High-Impact Website Engagements
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Fixed-Scope Website Packages That Justify Investment in 1–2 New Clients.
        </h1>
        <p className="text-lg text-slate-300">
          We engineer high-speed, modern Next.js 16 websites designed specifically to convert public traffic into qualified commercial conversations.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition"
          >
            Request a Free Website Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <Card key={idx} className={`relative flex flex-col justify-between ${pkg.badge ? 'border-blue-500/50 bg-slate-900/90 shadow-2xl' : ''}`}>
            {pkg.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow">
                {pkg.badge}
              </div>
            )}
            <CardHeader className="pt-6">
              <CardTitle className="text-2xl text-white">{pkg.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{pkg.price}</span>
                <span className="text-xs text-slate-400">fixed price</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 mt-2">
                <Clock className="w-3.5 h-3.5" /> Timeline: {pkg.timeline}
              </div>
              <CardDescription className="mt-3 text-xs text-slate-300 leading-relaxed">
                {pkg.target}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="border-t border-slate-800 pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">What is included</div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {pkg.notIncluded && (
                <div className="border-t border-slate-800 pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Exclusions</div>
                  <ul className="space-y-1 text-xs text-slate-500">
                    {pkg.notIncluded.map((exc, eIdx) => (
                      <li key={eIdx} className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow hover:bg-blue-500 transition"
              >
                Select Package & Get Scoped <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Process & Maintenance Options */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Standard Development Process & Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-300">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-blue-400 text-sm">Step 1: Discovery & Audit</div>
            <p>Inspect existing site, define conversion target, approve package scope.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-blue-400 text-sm">Step 2: Design & Copy</div>
            <p>Plain-English messaging, mobile ergonomics, and modern UI tokens.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-blue-400 text-sm">Step 3: Engineering</div>
            <p>Next.js 16 App Router, Zod validation, Drizzle ORM persistence.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <div className="font-bold text-blue-400 text-sm">Step 4: Launch & Hand-off</div>
            <p>Production deployment, DNS verification, and optional monthly maintenance ($150/mo).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
