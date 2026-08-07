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
    </div>
  );
}
