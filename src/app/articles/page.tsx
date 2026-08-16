import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowRight, Sparkles, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Newsletter } from "@/components/Newsletter";

export default function ArticlesPage() {
  const articles = [
    {
      slug: "ai-avatars-and-email",
      title: "AI Avatars and Email, the Killer App of the AI Age is Here",
      author: "Joe Terry, Head DG",
      date: "2024-12-09",
      category: "AI Engineering & Email Avatars",
      description:
        "AI Avatars paired with automated email workflows transform client engagement and follow-up. But what can they really do for your business?",
    },
    {
      slug: "ai-powered-workflow",
      title: "Building an AI-Powered Development Workflow",
      author: "Derivative Genius Engineering Team",
      date: "2023-12-12",
      category: "AI Web Development",
      description:
        "Learn how to integrate modern AI tools, agentic workflows, and Next.js 16 into your development pipeline for enhanced productivity and code quality.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Derivative Insights & Articles</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Articles & AI Engineering Insights
        </h1>
        <p className="text-lg text-slate-300">
          Perspectives on AI web development, automation strategy, customer experience, and the practical systems that help businesses move faster.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {articles.map((art, idx) => (
          <Card key={idx} className="flex flex-col justify-between border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-blue-400">
                  {art.category}
                </span>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{art.date}</span>
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl text-white hover:text-blue-400 transition-colors">
                <Link href={`/articles/${art.slug}`}>{art.title}</Link>
              </CardTitle>
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mt-2">
                <User className="h-3.5 w-3.5 text-blue-400" />
                <span>{art.author}</span>
              </div>
              <CardDescription className="mt-3 text-sm text-slate-300 leading-relaxed">
                {art.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link
                href={`/articles/${art.slug}`}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Newsletter />
    </div>
  );
}
