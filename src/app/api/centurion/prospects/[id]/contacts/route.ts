import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { contacts } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const schema = z.object({
  fullName: z.string().min(2), roleTitle: z.string().optional(), email: z.union([z.string().email(), z.literal('')]).optional(),
  phone: z.string().optional(), phoneType: z.enum(['public_business_line', 'business_direct_line', 'mobile', 'unknown']).default('public_business_line'),
  isVerified: z.boolean().default(false), enrichmentSource: z.enum(['manual', 'website', 'apollo']).default('manual'),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireCenturionAction('read');
    const { id } = await context.params;
    return NextResponse.json({ success: true, contacts: await db.select().from(contacts).where(eq(contacts.prospectId, id)) });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireCenturionAction('qualify');
    const { id } = await context.params;
    const input = schema.parse(await request.json());
    const [contact] = await db.insert(contacts).values({ prospectId: id, ...input }).returning();
    return NextResponse.json({ success: true, contact });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error);
    if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to save contact' }, { status: 500 });
  }
}
