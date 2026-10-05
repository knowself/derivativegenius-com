import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ArrowLeft } from "lucide-react";
import EditEpisodeForm from "./EditEpisodeForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEpisodePage({ params }: Props) {
  const { id } = await params;

  let post: any = null;
  try {
    if (db) {
      const [row] = await db
        .select()
        .from(schema.contentPosts)
        .where(eq(schema.contentPosts.id, id))
        .limit(1);
      post = row || null;
    }
  } catch (err) {
    console.warn("[Edit Episode] DB error:", err);
  }

  if (!post) notFound();

  // Serialize for the client component (dates -> ISO strings)
  const initial = {
    ...post,
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/operator/episodes"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to episodes
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-white">Edit episode</h1>
        <p className="text-sm text-slate-400 mt-1">
          Changes go live on /podcasts, the episode page, and the RSS feed as soon as you save.
        </p>
      </div>
      <EditEpisodeForm initial={initial} />
    </div>
  );
}
