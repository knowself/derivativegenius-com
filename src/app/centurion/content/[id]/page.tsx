import React from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ContentEditor } from "../editor/ContentEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditContentPage({ params }: Props) {
  const { id } = await params;
  if (!db) notFound();

  const [post] = await db
    .select()
    .from(schema.contentPosts)
    .where(eq(schema.contentPosts.id, id))
    .limit(1);

  if (!post) notFound();

  return <ContentEditor initialPost={post as any} isNew={false} />;
}
