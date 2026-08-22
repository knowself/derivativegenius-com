import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prospects, suppressions } from '@/db/schema';
import { calculateProspectScore } from '@/lib/prospecting/scoring';
import { findDuplicateProspect } from '@/lib/prospecting/dedup';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { createSuppressionHash } from '@/lib/prospecting/suppression';
import { buildConfirmedScoringInput } from '@/lib/prospecting/workflow';

const importBatchSchema = z.object({
  campaignId: z.string().optional(),
  records: z.array(z.object({
    name: z.string(),
    websiteUrl: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    industry: z.string().optional(),
    googleRating: z.string().optional(),
    reviewCount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseInt(v, 10) || 0 : v).optional(),
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
  })),
});

export async function POST(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('qualify');
    const suppressionSecret = process.env.CENTURION_SUPPRESSION_SECRET;
    if (!suppressionSecret) {
      return NextResponse.json({ success: false, error: 'Suppression hashing is not configured' }, { status: 503 });
    }
    const body = await req.json();
    const validated = importBatchSchema.parse(body);

    const existingProspects = await db.select({
      id: prospects.id,
      name: prospects.name,
      websiteUrl: prospects.websiteUrl,
      phone: prospects.phone,
      address: prospects.address,
      zip: prospects.zip,
      placeId: prospects.placeId,
    }).from(prospects);

    const existingSuppressions = await db.select({
      valueHash: suppressions.valueHash,
    }).from(suppressions);
    const suppressedHashes = new Set(existingSuppressions.map(s => s.valueHash));

    let importedCount = 0;
    let duplicateCount = 0;
    let suppressedCount = 0;
    const insertedRecords = [];

    for (const item of validated.records) {
      if (!item.name?.trim()) continue;

      // Suppression check by phone hash
      const phoneHash = item.phone
        ? createSuppressionHash(item.phone, suppressionSecret, 'phone')
        : null;
      const companyHash = createSuppressionHash(item.name, suppressionSecret, 'company');
      if ((phoneHash && suppressedHashes.has(phoneHash)) || suppressedHashes.has(companyHash)) {
        suppressedCount++;
        continue;
      }

      // Deduplication check
      const match = findDuplicateProspect(item, existingProspects);
      if (match.isMatch) {
        duplicateCount++;
        continue;
      }

      const scoreResult = calculateProspectScore(buildConfirmedScoringInput(item));

      const normalizedName = item.name.toLowerCase().trim();

      const [inserted] = await db
        .insert(prospects)
        .values({
          name: item.name,
          normalizedName,
          campaignId: validated.campaignId ?? null,
          industry: item.industry ?? null,
          websiteUrl: item.websiteUrl ?? null,
          phone: item.phone ?? null,
          address: item.address ?? null,
          city: item.city ?? null,
          state: item.state ?? null,
          zip: item.zip ?? null,
          googleRating: item.googleRating ? String(item.googleRating) : null,
          reviewCount: item.reviewCount ?? 0,
          hasHighCustomerValue: item.hasHighCustomerValue ?? false,
          hasWeakOrOutdatedWebsite: item.hasWeakOrOutdatedWebsite ?? false,
          hasDecisionMakerRoute: item.hasDecisionMakerRoute ?? false,
          hasMultipleEmployeesOrLocations: item.hasMultipleEmployeesOrLocations ?? false,
          hasActiveAdsOrSocial: item.hasActiveAdsOrSocial ?? false,
          hasWeakBookingWorkflow: item.hasWeakBookingWorkflow ?? false,
          hasRecentGrowthTrigger: item.hasRecentGrowthTrigger ?? false,
          websiteObservation: item.websiteObservation ?? null,
          commercialConsequence: item.commercialConsequence ?? null,
          sourceUrl: item.sourceUrl ?? null,
          sourceCapturedAt: item.sourceUrl ? new Date() : null,
          scoreConfirmedAt: new Date(),
          scoreConfirmedBy: actor.userId,
          score: scoreResult.score,
          qualificationStatus: scoreResult.disposition,
          status: scoreResult.disposition === 'exclude' ? 'disqualified' : 'raw',
          sourceId: 'csv_import',
        })
        .returning();

      existingProspects.push({
        id: inserted.id,
        name: inserted.name,
        websiteUrl: inserted.websiteUrl,
        phone: inserted.phone,
        address: inserted.address,
        zip: inserted.zip,
        placeId: inserted.placeId,
      });

      insertedRecords.push(inserted);
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: validated.records.length,
        imported: importedCount,
        duplicates: duplicateCount,
        suppressed: suppressedCount,
      },
      records: insertedRecords,
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to import prospects' }, { status: 500 });
  }
}
