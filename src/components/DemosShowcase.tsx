import React from "react";
import Link from "next/link";
import { Bot, Home, Mail, UserCheck, ExternalLink, Sparkles, Sprout, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function DemosShowcase() {
  const demos = [
    {
      title: "Urban Farming & Small Business Knowledge Bot",
      client: "MicrogreensLA.Live",
      category: "Small Business / E-Commerce",
      description:
        "Talk to an AI bot trained on an active urban farm. Test questions like 'What are your hours?' or 'Why eat Microgreens?' to see automated lead qualification in action.",
      icon: Sprout,
      link: "http://www.microgreensla.live/",
      linkLabel: "Test MicrogreensLA Bot",
    },
    {
      title: "Beach Cities Real Estate Assistants",
      client: "Hermosa, Redondo & Manhattan Beach Demos",
      category: "Real Estate Vertical",
      description:
        "Interactive property search chatbots for Hermosa Beach (90254), Redondo Beach (90277/90278), and Manhattan Beach (90266/90267). Helping home buyers explore listings naturally.",
      icon: Home,
      link: "/contact",
      linkLabel: "Explore Real Estate Bot Demo",
    },
    {
      title: "AI Avatars & Email Marketing Systems",
      client: "Featured Analysis by Joe Terry, Head DG",
      category: "Marketing & Outreach",
      description:
        "Explore how AI Avatars and automated email workflows transform customer engagement. 'The killer app of the AI age is here.'",
      icon: Mail,
      link: "/articles/ai-avatars-and-email",
      linkLabel: "Read AI Avatars Article",
    },
    {
      title: "Client Case Study: Insurance Agency Intake",
      client: "Latoya Jones-McDonald — Farmers® Agent",
      category: "Professional Services",
      description:
        "Personalized client intake and policy assistance helping customers identify auto, home, and business insurance coverage across Illinois and Indiana.",
      icon: UserCheck,
      link: "/contact",
      linkLabel: "View Case Study Scope",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Real-World Demos & Client Showcase</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Live AI Demos & Customer Examples
        </h2>
        <p className="text-slate-300">
          Explore actual AI web applications, chatbot integrations, and client showcases built by Derivative Genius.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {demos.map((d, idx) => {
          const IconComp = d.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-blue-400">
                    {d.category}
                  </span>
                </div>
                <CardTitle className="mt-4 text-xl text-white">{d.title}</CardTitle>
                <div className="text-xs font-semibold text-slate-400 mt-1">
                  {d.client}
                </div>
                <CardDescription className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {d.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <a
                  href={d.link}
                  target={d.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>{d.linkLabel}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
