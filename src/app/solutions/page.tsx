import React from "react";
import Link from "next/link";
import { Building2, Stethoscope, ShoppingBag, Landmark, Briefcase, Home, Laptop, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SolutionsPage() {
  const industries = [
    {
      title: "Retail & E-Commerce",
      icon: ShoppingBag,
      summary: "AI-native shopping assistants, personalized product recommendations, and real-time inventory synchronization.",
      useCases: [
        "Semantic product catalog search",
        "Automated order status & return chatbots",
        "Dynamic pricing & inventory alerts",
      ],
    },
    {
      title: "Healthcare & Medical",
      icon: Stethoscope,
      summary: "HIPAA-compliant client intake forms, automated appointment triage, and patient query summaries.",
      useCases: [
        "Zod-validated patient intake forms",
        "Automated appointment scheduling workflows",
        "Secure document indexing & clinical Q&A",
      ],
    },
    {
      title: "Financial Services & Banking",
      icon: Landmark,
      summary: "Secure client portals, automated risk reporting, and intelligent document extraction for loan/investment pipelines.",
      useCases: [
        "Encrypted multi-tenant client portals",
        "Automated financial document parsing",
        "Real-time analytics & compliance dashboards",
      ],
    },
    {
      title: "Real Estate & Property Management",
      icon: Building2,
      summary: "Smart property search by natural language, automated tenant inquiry triage, and lease contract summarization.",
      useCases: [
        "Semantic listing search (neighborhood, amenities, budget)",
        "24/7 automated lead qualification",
        "Contract parsing & tenant onboarding",
      ],
    },
    {
      title: "Professional Services & Legal",
      icon: Briefcase,
      summary: "Client intake automation, smart legal/case document search, and instant scope proposal generators.",
      useCases: [
        "Instant scoping & proposal calculators",
        "Case file vector search & semantic indexing",
        "Client portal milestone tracking",
      ],
    },
    {
      title: "Local Services & Home Contracting",
      icon: Home,
      summary: "Instant photo/scope quote generators, automated booking workflows, and sms/email notifications.",
      useCases: [
        "Instant job estimate calculators",
        "Automated booking & calendar sync",
        "Durable Firestore lead retention",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <Laptop className="h-3.5 w-3.5" />
          <span>Industry Solutions</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AI Web Solutions by Industry
        </h1>
        <p className="text-lg text-slate-300">
          Tailored AI-native web architectures engineered for your specific industry requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((ind, idx) => {
          const IconComp = ind.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <IconComp className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-2xl">{ind.title}</CardTitle>
                <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {ind.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Key Implementations:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {ind.useCases.map((uc, uIdx) => (
                      <li key={uIdx} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Request Industry Scope</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Core Services Integration Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Engineering Offerings</div>
            <h2 className="text-3xl font-extrabold text-white">Core Web & AI Services</h2>
            <p className="text-sm text-slate-300 mt-1">
              Every industry solution is delivered through our four specialized engineering service lines.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition shrink-0"
          >
            Explore All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-slate-300">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="font-bold text-white text-base">Website Engineering</div>
            <p className="text-xs text-slate-400">Fixed-scope $2k–$5k conversion-focused Next.js 16 websites for established local & commercial firms.</p>
            <Link href="/services/websites" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline">
              View Website Packages <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="font-bold text-white text-base">AI Web Applications</div>
            <p className="text-xs text-slate-400">Custom web applications with embedded AI assistants, intelligent automation, and custom workflows.</p>
            <Link href="/services" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline">
              Explore AI Web Apps <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="font-bold text-white text-base">Secure Client Portals</div>
            <p className="text-xs text-slate-400">Multi-tenant client dashboards, file sharing, intake workflows, and RBAC security.</p>
            <Link href="/services" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline">
              Explore Client Portals <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="font-bold text-white text-base">AI & API Integrations</div>
            <p className="text-xs text-slate-400">Connecting legacy tools, CRMs, database pipelines, and automated LLM endpoints.</p>
            <Link href="/services" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline">
              Explore Integrations <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
