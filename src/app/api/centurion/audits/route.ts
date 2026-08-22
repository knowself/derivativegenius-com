import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { audits } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const createSchema = z.object({ prospectId: z.string().uuid(), targetOutcome: z.string().min(2), findings: z.array(z.string().min(2)).min(1), scoreSummary: z.string().optional(), proposalRange: z.string().optional() });
const updateSchema = z.object({ id: z.string().uuid(), status: z.enum(['draft', 'internal_review', 'approved', 'sent', 'viewed']), targetOutcome: z.string().optional(), findings: z.array(z.string()).optional(), scoreSummary: z.string().optional(), proposalRange: z.string().optional() });

export async function GET() {
  try {
    await requireCenturionAction('read');
    return NextResponse.json({ success: true, audits: await db.select().from(audits).orderBy(desc(audits.createdAt)) });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load audits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireCenturionAction('manage_audits');
    const input = createSchema.parse(await request.json());
    const [audit] = await db.insert(audits).values({
      prospectId: input.prospectId,
      targetOutcome: input.targetOutcome,
      findingsJson: JSON.stringify(input.findings),
      scoreSummary: input.scoreSummary ?? null,
      proposalRange: input.proposalRange ?? null,
    }).returning();
    return NextResponse.json({ success: true, audit });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error); if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to create audit' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await requireCenturionAction('manage_audits');
    const input = updateSchema.parse(await request.json());
    const [audit] = await db.update(audits).set({
      status: input.status, targetOutcome: input.targetOutcome, findingsJson: input.findings ? JSON.stringify(input.findings) : undefined,
      scoreSummary: input.scoreSummary, proposalRange: input.proposalRange,
      approvedAt: input.status === 'approved' ? new Date() : undefined, approvedBy: input.status === 'approved' ? actor.userId : undefined,
      sentAt: input.status === 'sent' ? new Date() : undefined, updatedAt: new Date(),
    }).where(eq(audits.id, input.id)).returning();
    return NextResponse.json({ success: true, audit });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error); if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to update audit' }, { status: 500 });
  }
}
