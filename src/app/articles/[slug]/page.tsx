import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import Image from "next/image";
import LazyYouTube from "@/components/LazyYouTube";

const articleDataRaw: Record<string, any> = {
  "ai-avatars-and-email": {
    title: "AI Avatars and Email, the Killer App of the AI Age is Here",
    author: "Joe Terry, Head DG",
    date: "2024-12-09",
    category: "AI Avatars & Email Integration",
    image: "/images/articles/ai-avatars-hero.png",
    videos: [
      {
        url: "https://youtu.be/Ye3akkvgHew?si=ypocgW9RvHjxG31T",
        title: "Why AI Avatars in Email is important. You and Your Clients want to Know.",
        caption: "Derivative Genius — demo and explanation",
      },
      {
        url: "https://youtu.be/22QN9W36pJg?si=VIfhFjSgjRlFaQgF",
        title: "Why AI Avatars in Email is important. You and Your Clients want to Know.",
        caption: "Derivative Genius — part 2",
      },
    ],
    content: [
      "We are all standing on the shoulders of giants. Living in a time when we, each of us, can utilize all the intellectual tools ever conceived by humankind. All of us are revolutionizing our businesses and industries with cutting-edge AI tools and techniques, and Derivative Genius is here to help.",
      "AI Avatars and Email represent the killer app of the AI Age. But what can they really do for your business?",
      "Imagine an interactive avatar trained on your specific business knowledge base, product offerings, and customer service protocols. When a customer reaches out via your website or email, the AI avatar delivers personalized, human-like engagement instantly—qualifying leads, answering technical questions, and scheduling follow-ups.",
      "At Derivative Genius, we integrate these AI Avatar and Email automation workflows directly into your web applications, ensuring high conversion, sub-second response times, and 24/7 client availability.",
    ],
  },
  "ai-powered-workflow": {
    title: "Building an AI-Powered Development Workflow",
    author: "Derivative Genius Engineering Team",
    date: "2023-12-12",
    category: "AI Web Development",
    content: [
      "In today's rapidly evolving tech landscape, artificial intelligence has become an indispensable tool for enhancing developer productivity and code quality. This article explores how to create an effective AI-powered development workflow that can transform your software engineering process.",
      "Key components of an AI development workflow include code generation, automated testing, server-side Zod validation, and AI agentic assistance.",
      "By utilizing specialized agentic workflows, software engineering teams can compress delivery timelines while maintaining 100% test coverage and strict type safety.",
    ],
  },
};

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const articleData = getArticleData();
  const article = articleData[slug];
  if (!article) return {};

  return {
    title: article.title,
    description: article.content && article.content.length ? article.content[0].slice(0, 160) : undefined,
    openGraph: {
      title: article.title,
      description: article.content && article.content.length ? article.content[0].slice(0, 160) : undefined,
      images: article.image ? [article.image] : undefined,
      videos: article.videos && article.videos.length ? article.videos.map((v: any) => ({ url: v.url || v })) : undefined,
    },
  };
}

function getArticleData(): Record<string, any> {
  return articleDataRaw as Record<string, any>;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const articleData: Record<
    string,
    {
      title: string;
      author: string;
      date: string;
      category: string;
      image?: string;
      videos?: any[];
      content: string[];
    }
  > = articleDataRaw;
  

  const article = articleData[slug];
  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {article.image && (
        <div className="mx-auto w-full">
          <Image
            src={article.image}
            alt={article.title}
            width={1600}
            height={600}
            className="w-full rounded-2xl border border-slate-800 object-cover"
          />
        </div>
      )}
      <Link
        href="/articles"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Articles</span>
      </Link>

      <div className="space-y-4">
        <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center space-x-6 text-sm text-slate-400 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-slate-200">{article.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-base">
        {article.content.map((p, idx) => (
          <p key={idx} className="bg-slate-900/60 p-6 rounded-xl border border-slate-800/80">
            {p}
          </p>
        ))}
      </div>

      <div className="pt-8">
        <div className="space-y-6">
          {article.videos && article.videos.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {article.videos.map((v, i) => (
                <LazyYouTube key={i} url={v.url || v} title={v.title} caption={v.caption} />
              ))}
            </div>
          )}

          <Newsletter />
        </div>
      </div>
    </div>
  );
}
