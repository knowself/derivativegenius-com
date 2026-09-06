import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { checkHeroWaste, checkMobileCallCta, checkOwnedContent } from '@/lib/audit-tools/checks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  url: z.string().url('Enter a public http(s) URL').max(2048),
});

export async function POST(req: NextRequest) {
  try {
    // Reads run freely for authenticated operators; no DB writes here.
    await requireCenturionAction('read');
    const input = bodySchema.parse(await req.json());
    const url = input.url.trim();

    const [callCta, hero, owned] = await Promise.all([
      checkMobileCallCta(url, 390),
      checkHeroWaste(url),
      checkOwnedContent(url),
    ]);

    return NextResponse.json({ success: true, url, callCta, hero, owned });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? 'Invalid URL' }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Audit check failed' },
      { status: 500 },
    );
  }
}
