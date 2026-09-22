import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // In production or when Clerk is configured, check auth
    try {
      const { userId } = await auth();
      if (!userId && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized: Operator login required' }, { status: 401 });
      }
    } catch {
      // If auth check fails in local development without Clerk keys, proceed with warning
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `episode-${Date.now()}.mp3`;

    if (!request.body) {
      return NextResponse.json({ error: 'No file stream provided' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: 'BLOB_READ_WRITE_TOKEN is not configured. Connect Vercel Blob in your project dashboard or add the token to .env.local.',
        },
        { status: 503 }
      );
    }

    const contentType = request.headers.get('content-type') || 'audio/mpeg';

    const blob = await put(`podcasts/${Date.now()}-${filename}`, request.body, {
      access: 'public',
      contentType,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error: any) {
    console.error('[Upload Audio Error]', error);
    return NextResponse.json({ error: error.message || 'Audio upload failed' }, { status: 500 });
  }
}
