import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db, schema } from "@/db";

const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  subtitle: z.string().nullable().optional(),
  postType: z.enum(["article", "podcast", "newsletter", "hybrid"]).optional(),
  contentMarkdown: z.string().optional(),
  excerpt: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  audioDurationSeconds: z.number().int().nullable().optional(),
  audioSizeBytes: z.number().int().nullable().optional(),
  episodeNumber: z.number().int().nullable().optional(),
  seasonNumber: z.number().int().nullable().optional(),
  authorName: z.string().optional(),
  tags: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
});

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!db) return NextResponse.json({ error: "DB not available" }, { status: 500 });

    const [post] = await db
      .select()
      .from(schema.contentPosts)
      .where(eq(schema.contentPosts.id, id))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {}

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdatePostSchema.parse(body);

    if (!db) return NextResponse.json({ error: "DB not available" }, { status: 500 });

    // Fetch existing post to check publishing transitions
    const [existing] = await db
      .select()
      .from(schema.contentPosts)
      .where(eq(schema.contentPosts.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updates: any = {
      ...parsed,
      updatedAt: new Date(),
    };

    // If publishing for the first time
    if (parsed.isPublished && !existing.isPublished && !existing.publishedAt) {
      updates.publishedAt = new Date();
    }

    const [updatedPost] = await db
      .update(schema.contentPosts)
      .set(updates)
      .where(eq(schema.contentPosts.id, id))
      .returning();

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  try {
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {}

    const { id } = await params;
    if (!db) return NextResponse.json({ error: "DB not available" }, { status: 500 });

    await db.delete(schema.contentPosts).where(eq(schema.contentPosts.id, id));

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
