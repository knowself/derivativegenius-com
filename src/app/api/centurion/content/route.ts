import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db, schema } from "@/db";

const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  subtitle: z.string().optional(),
  postType: z.enum(["article", "podcast", "newsletter", "hybrid"]).default("article"),
  contentMarkdown: z.string().default(""),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  audioDurationSeconds: z.number().int().optional(),
  audioSizeBytes: z.number().int().optional(),
  episodeNumber: z.number().int().optional(),
  seasonNumber: z.number().int().optional(),
  authorName: z.string().default("Joe Terry"),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ posts: [] });
    }

    const posts = await db
      .select()
      .from(schema.contentPosts)
      .orderBy(desc(schema.contentPosts.createdAt));

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error("[Centurion Content GET Error]", err);
    return NextResponse.json({ error: err.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Auth check
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      // Dev mode
    }

    const body = await req.json();
    const parsed = CreatePostSchema.parse(body);

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Check slug uniqueness
    const [existing] = await db
      .select({ id: schema.contentPosts.id })
      .from(schema.contentPosts)
      .where(eq(schema.contentPosts.slug, parsed.slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "A post with this slug already exists. Please choose a different slug." }, { status: 400 });
    }

    const [newPost] = await db
      .insert(schema.contentPosts)
      .values({
        ...parsed,
        publishedAt: parsed.isPublished ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err: any) {
    console.error("[Centurion Content POST Error]", err);
    return NextResponse.json({ error: err.message || "Failed to create post" }, { status: 400 });
  }
}
