import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prospects } from '@/db/schema';
import { calculateProspectScore } from '@/lib/prospecting/scoring';
import { findDuplicateProspect } from '@/lib/prospecting/dedup';
import { desc, eq, and, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { buildConfirmedScoringInput, sortQueueItems } from '@/lib/prospecting/workflow';

const prospectCreateSchema = z.object({
  name: z.string().min(2, 'Business name required'),
  campaignId: z.string().optional(),
  industry: z.string().optional(),
  websiteUrl: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  googleRating: z.string().optional(),
  reviewCount: z.number().optional().default(0),
  hasHighCustomerValue: z.boolean().optional(),
  hasWeakOrOutdatedWebsite: z.boolean().optional(),
  hasDecisionMakerRoute: z.boolean().optional(),
  hasMultipleEmployeesOrLocations: z.boolean().optional(),
  hasActiveAdsOrSocial: z.boolean().optional(),
  hasWeakBookingWorkflow: z.boolean().optional(),
  hasRecentGrowthTrigger: z.boolean().optional(),
  websiteObservation: z.string().optional(),
  commercialConsequence: z.string().optional(),
  sourceUrl: z.union([z.string().url(), z.literal('')]).optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireCenturionAction('read');
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const status = searchParams.get('status');
    const qualification = searchParams.get('qualification');
    const search = searchParams.get('search');
    const isQueue = searchParams.get('queue') === 'true';

    const conditions = [];
    if (campaignId) conditions.push(eq(prospects.campaignId, campaignId));
    if (status) conditions.push(eq(prospects.status, status));
    if (qualification) conditions.push(eq(prospects.qualificationStatus, qualification));
    if (isQueue) conditions.push(ne(prospects.qualificationStatus, 'excluded'));
    if (search) {
      conditions.push(sql`LOWER(${prospects.name}) LIKE ${'%' + search.toLowerCase() + '%'}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const result = await db
      .select()
      .from(prospects)
      .where(whereClause)
      .orderBy(desc(prospects.score), desc(prospects.createdAt))
      .limit(100);

    const ordered = isQueue ? sortQueueItems(result) : result;
    return NextResponse.json({ success: true, prospects: ordered, count: ordered.length });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    return NextResponse.json({ success: false, error: 'Unable to load prospects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('qualify');
    const body = await req.json();
    const validated = prospectCreateSchema.parse(body);

    // Fetch existing prospects for deduplication check
    const existingList = await db.select({
      id: prospects.id,
      name: prospects.name,
      websiteUrl: prospects.websiteUrl,
      phone: prospects.phone,
      address: prospects.address,
      zip: prospects.zip,
      placeId: prospects.placeId,
    }).from(prospects);

    const match = findDuplicateProspect(validated, existingList);
    if (match.isMatch) {
      return NextResponse.json({
        success: false,
        error: `Duplicate prospect detected (${match.matchType})`,
        existingProspectId: match.existingProspectId,
        matchType: match.matchType,
      }, { status: 409 });
    }

    // Calculate score
    const scoreResult = calculateProspectScore(buildConfirmedScoringInput(validated));

    const normalizedName = validated.name.toLowerCase().trim();

    const [newProspect] = await db
      .insert(prospects)
      .values({
        name: validated.name,
        normalizedName,
        campaignId: validated.campaignId ?? null,
        industry: validated.industry ?? null,
        websiteUrl: validated.websiteUrl ?? null,
        phone: validated.phone ?? null,
        address: validated.address ?? null,
        city: validated.city ?? null,
        state: validated.state ?? null,
        zip: validated.zip ?? null,
        googleRating: validated.googleRating ?? null,
        reviewCount: validated.reviewCount,
        hasHighCustomerValue: validated.hasHighCustomerValue ?? false,
        hasWeakOrOutdatedWebsite: validated.hasWeakOrOutdatedWebsite ?? false,
        hasDecisionMakerRoute: validated.hasDecisionMakerRoute ?? false,
        hasMultipleEmployeesOrLocations: validated.hasMultipleEmployeesOrLocations ?? false,
        hasActiveAdsOrSocial: validated.hasActiveAdsOrSocial ?? false,
        hasWeakBookingWorkflow: validated.hasWeakBookingWorkflow ?? false,
        hasRecentGrowthTrigger: validated.hasRecentGrowthTrigger ?? false,
        websiteObservation: validated.websiteObservation ?? null,
        commercialConsequence: validated.commercialConsequence ?? null,
        sourceUrl: validated.sourceUrl ?? null,
        sourceCapturedAt: validated.sourceUrl ? new Date() : null,
        scoreConfirmedAt: new Date(),
        scoreConfirmedBy: actor.userId,
        score: scoreResult.score,
        qualificationStatus: scoreResult.disposition,
        status: scoreResult.disposition === 'exclude' ? 'disqualified' : 'raw',
        notes: validated.notes ?? null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      prospect: newProspect,
      scoring: scoreResult,
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to create prospect' }, { status: 500 });
  }
}
