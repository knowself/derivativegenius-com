import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { renderMarkdownToHtml, estimateReadingTime } from "@/lib/markdown";
import { PodcastPlayer } from "@/components/content/PodcastPlayer";
import { Newsletter } from "@/components/Newsletter";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR 60s

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    if (!db) return { title: "Blog Post | Derivative Genius" };

    const [post] = await db
      .select()
      .from(schema.contentPosts)
      .where(eq(schema.contentPosts.slug, slug))
      .limit(1);

    if (!post) {
      return { title: "Post Not Found | Derivative Genius" };
    }

    return {
      title: `${post.seoTitle || post.title} | Derivative Genius`,
      description: post.seoDescription || post.excerpt || "Derivative Genius Insights",
      openGraph: {
        title: post.title,
        description: post.excerpt || undefined,
        images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        authors: [post.authorName || "Joe Terry"],
      },
    };
  } catch {
    return { title: "Blog Post | Derivative Genius" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  if (!db) {
    notFound();
  }

  const [post] = await db
    .select()
    .from(schema.contentPosts)
    .where(eq(schema.contentPosts.slug, slug))
    .limit(1);

  if (!post || (!post.isPublished && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const htmlContent = await renderMarkdownToHtml(post.contentMarkdown || "");
  const readingTime = estimateReadingTime(post.contentMarkdown || "");
  const tags = post.tags ? JSON.parse(post.tags) : [];
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  // Google Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Joe Terry",
      url: "https://derivativegenius.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Derivative Genius",
      logo: {
        "@type": "ImageObject",
        url: "https://derivativegenius.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://derivativegenius.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back Link */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all posts & podcasts</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6 text-center sm:text-left">
        {post.postType && (
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
            {post.postType === "podcast" ? "Podcast Briefing" : "Playbook"}
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.15]">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-xl text-slate-300 font-medium leading-relaxed">
            {post.subtitle}
          </p>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 border-y border-slate-800 py-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <User className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">{post.authorName || "Joe Terry"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-4 w-4" />
            <span>{publishedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Podcast Audio Player (if audio exists) */}
      {post.audioUrl && (
        <section className="pt-2">
          <PodcastPlayer
            src={post.audioUrl}
            title={post.title}
            episodeNumber={post.episodeNumber}
            durationSeconds={post.audioDurationSeconds}
          />
        </section>
      )}

      {/* Main Body */}
      <div
        className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-headings:text-white prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-xl prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-emerald-500 prose-blockquote:text-slate-200 prose-blockquote:bg-slate-900/60 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:text-emerald-300 prose-code:bg-slate-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-6">
          <span className="text-xs font-semibold text-slate-400">Tagged:</span>
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Article Footer CTA: Newsletter Subscription */}
      <section className="pt-8">
        <Newsletter />
      </section>
    </div>
  );
}
