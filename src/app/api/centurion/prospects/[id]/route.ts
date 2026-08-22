import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { activities, audits, contacts, opportunities, proposals, prospects, tasks } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { calculateProspectScore } from '@/lib/prospecting/scoring';
import { buildConfirmedScoringInput } from '@/lib/prospecting/workflow';

const optionalText = z.string().nullish();
const optionalUrl = z.union([z.string().url(), z.literal('')]).nullish();
const evidenceSchema = z.object({
  industry: optionalText, websiteUrl: optionalText, phone: optionalText,
  address: optionalText, city: optionalText, state: optionalText, zip: optionalText,
  googleRating: optionalText, reviewCount: z.number().int().min(0).nullish().transform((value) => value ?? 0),
  hasHighCustomerValue: z.boolean().default(false), hasWeakOrOutdatedWebsite: z.boolean().default(false),
  hasDecisionMakerRoute: z.boolean().default(false), hasMultipleEmployeesOrLocations: z.boolean().default(false),
  hasActiveAdsOrSocial: z.boolean().default(false), hasWeakBookingWorkflow: z.boolean().default(false),
  hasRecentGrowthTrigger: z.boolean().default(false), websiteObservation: optionalText,
  commercialConsequence: optionalText, sourceUrl: optionalUrl, notes: optionalText,
  disqualificationReason: optionalText, isPermanentlyClosed: z.boolean().optional(),
  hasInactiveLicense: z.boolean().optional(), hasClientConflict: z.boolean().optional(),
});

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireCenturionAction('read');
    const { id } = await context.params;
    const [prospect] = await db.select().from(prospects).where(eq(prospects.id, id));
    if (!prospect) return NextResponse.json({ success: false, error: 'Prospect not found' }, { status: 404 });

    const [contactRows, auditRows, activityRows, taskRows, opportunityRows] = await Promise.all([
      db.select().from(contacts).where(eq(contacts.prospectId, id)).orderBy(desc(contacts.createdAt)),
      db.select().from(audits).where(eq(audits.prospectId, id)).orderBy(desc(audits.createdAt)),
      db.select().from(activities).where(eq(activities.prospectId, id)).orderBy(desc(activities.createdAt)),
      db.select().from(tasks).where(eq(tasks.prospectId, id)).orderBy(desc(tasks.dueAt)),
      db.select().from(opportunities).where(eq(opportunities.prospectId, id)),
    ]);
    const proposalRows = opportunityRows[0]
      ? await db.select().from(proposals).where(eq(proposals.opportunityId, opportunityRows[0].id)).orderBy(desc(proposals.createdAt))
      : [];
    return NextResponse.json({ success: true, prospect, contacts: contactRows, audits: auditRows, activities: activityRows, tasks: taskRows, opportunity: opportunityRows[0] ?? null, proposals: proposalRows });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error);
    if (response) return response;
    return NextResponse.json({ success: false, error: 'Unable to load prospect workspace' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireCenturionAction('qualify');
    const { id } = await context.params;
    const input = evidenceSchema.parse(await request.json());
    const scoring = calculateProspectScore(buildConfirmedScoringInput({
      ...input,
      disqualificationNote: input.disqualificationReason ?? undefined,
    }));
    const { isPermanentlyClosed: _closed, hasInactiveLicense: _inactive, hasClientConflict: _conflict, ...storedInput } = input;
    const [prospect] = await db.update(prospects).set({
      ...storedInput,
      industry: input.industry ?? null, websiteUrl: input.websiteUrl ?? null, phone: input.phone ?? null,
      address: input.address ?? null, city: input.city ?? null, state: input.state ?? null, zip: input.zip ?? null,
      googleRating: input.googleRating ?? null, websiteObservation: input.websiteObservation ?? null,
      commercialConsequence: input.commercialConsequence ?? null, sourceUrl: input.sourceUrl || null,
      sourceCapturedAt: input.sourceUrl ? new Date() : null, notes: input.notes ?? null,
      score: scoring.score, scoreVersion: scoring.scoreVersion,
      qualificationStatus: scoring.disposition === 'exclude' ? 'excluded' : scoring.disposition,
      status: scoring.isDisqualified ? 'disqualified' : scoring.disposition === 'priority' ? 'qualified' : 'raw',
      disqualificationReason: scoring.disqualificationReason ?? null,
      scoreConfirmedAt: new Date(), scoreConfirmedBy: actor.userId, updatedAt: new Date(),
    }).where(eq(prospects.id, id)).returning();
    if (!prospect) return NextResponse.json({ success: false, error: 'Prospect not found' }, { status: 404 });
    return NextResponse.json({ success: true, prospect, scoring });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error);
    if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to qualify prospect' }, { status: 500 });
  }
}
