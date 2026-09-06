import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import Image from "next/image";
import LazyYouTube from "@/components/LazyYouTube";

const articleDataRaw: Record<string, any> = {
  "ai-avatars-and-email": {
    title: "AI Avatars and Email Follow-Up: What Worked, What Didn't",
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
      "We are all standing on the shoulders of giants. This is a practical test: can an avatar trained on one business answer real customer questions well enough to earn a follow-up? Here is what we measured.",
      "Avatars plus email follow-up are useful when the avatar answers from the business's own documented knowledge — hours, prices, service area. They fail when asked anything outside that file. The fix is a short, owned Q&A page per question.",
      "Imagine an interactive avatar trained on your specific business knowledge base, product offerings, and customer service protocols. When a customer reaches out via your website or email, the avatar answers from that file instantly — qualifying leads, answering documented questions, and scheduling follow-ups for the rest.",
      "At Derivative Genius, we wire these avatar and email follow-up workflows into your site, then measure answered-vs-escalated inquiries weekly. No sub-second or uptime promises here — we report what the logs show.",
    ],
  },
  "ai-powered-workflow": {
    title: "Building an AI-Powered Development Workflow",
    author: "Derivative Genius Engineering Team",
    date: "2023-12-12",
    category: "AI Web Development",
    content: [
      "In today's tech landscape, AI tools are useful for specific development chores — drafting, summarizing, and first-pass tests. This article shows where they fit in our pipeline and where a human still reviews every line.",
      "Key components of our workflow include code generation for drafts, automated testing, server-side validation, and AI-assisted review. Nothing ships on AI output alone.",
      "Specialized workflows compress some delivery timelines. We report test coverage per project from the actual suite — never 100% unless the report says so — and keep strict type checks on.",
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
      {/* Hero image removed per request to eliminate large YouTube branding */}
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
