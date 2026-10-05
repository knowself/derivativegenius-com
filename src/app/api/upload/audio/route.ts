import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

// Browser-direct upload to Vercel Blob. The file goes straight from the
// browser to Blob storage, so large episode MP3s never pass through the
// serverless function body limit.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized: Operator login required" }, { status: 401 });
      }
    } catch {
      // local dev without Clerk keys — allow
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-m4a", "audio/mp4"],
        addRandomSuffix: true,
        maximumSizeInBytes: 300 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("[Upload Audio Error]", error);
    return NextResponse.json({ error: error.message || "Audio upload failed" }, { status: 400 });
  }
}
