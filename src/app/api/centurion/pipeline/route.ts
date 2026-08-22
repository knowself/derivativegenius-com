import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { opportunities, projectHandoffs, proposals, prospects } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const stages = ['qualified', 'discovery_scheduled', 'audit_accepted', 'proposal_sent', 'closed_won', 'closed_lost'] as const;
const opportunitySchema = z.object({
  id: z.string().uuid().optional(), prospectId: z.string().uuid(), primaryContactId: z.string().uuid().optional(),
  stage: z.enum(stages).default('qualified'), estimatedValue: z.number().int().positive().optional(),
  probabilityPercent: z.number().int().min(0).max(100).default(10), packageName: z.string().optional(),
  discoveryAt: z.coerce.date().optional(), expectedCloseAt: z.coerce.date().optional(), lossReason: z.string().optional(),
  nextAction: z.string().optional(), nextActionAt: z.coerce.date().optional(),
});
const proposalSchema = z.object({ opportunityId: z.string().uuid(), scopeSummary: z.string().min(2), amount: z.number().int().positive(), status: z.enum(['draft', 'sent', 'accepted', 'declined']).default('draft') });
const handoffSchema = z.object({ opportunityId: z.string().uuid(), proposalId: z.string().uuid().optional(), scopeSummary: z.string().min(2), kickoffAt: z.coerce.date().optional() });

export async function GET() {
  try {
    await requireCenturionAction('read');
    const rows = await db.select({ opportunity: opportunities, prospectName: prospects.name })
      .from(opportunities).innerJoin(prospects, eq(opportunities.prospectId, prospects.id))
      .orderBy(desc(opportunities.updatedAt));
    const proposalRows = await db.select().from(proposals).orderBy(desc(proposals.createdAt));
    return NextResponse.json({ success: true, opportunities: rows, proposals: proposalRows });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load pipeline' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireCenturionAction('manage_pipeline');
    const body = await request.json();
    if (body.kind === 'proposal') {
      const input = proposalSchema.parse(body);
      const [proposal] = await db.insert(proposals).values({
        opportunityId: input.opportunityId, scopeSummary: input.scopeSummary, amount: input.amount,
        status: input.status, sentAt: input.status === 'sent' ? new Date() : null,
        acceptedAt: input.status === 'accepted' ? new Date() : null,
      }).returning();
      return NextResponse.json({ success: true, proposal });
    }
    if (body.kind === 'handoff') {
      const input = handoffSchema.parse(body);
      const [handoff] = await db.insert(projectHandoffs).values({ ...input, ownerUserId: actor.userId }).returning();
      return NextResponse.json({ success: true, handoff });
    }
    const input = opportunitySchema.parse(body);
    const values = { ...input, primaryContactId: input.primaryContactId ?? null, ownerUserId: actor.userId, updatedAt: new Date() };
    const [opportunity] = input.id
      ? await db.update(opportunities).set(values).where(eq(opportunities.id, input.id)).returning()
      : await db.insert(opportunities).values(values).onConflictDoUpdate({ target: opportunities.prospectId, set: values }).returning();
    return NextResponse.json({ success: true, opportunity });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error); if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to update pipeline' }, { status: 500 });
  }
}
