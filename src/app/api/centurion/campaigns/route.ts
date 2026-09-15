import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, campaigns } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { campaignStatusTransitionSchema, getCampaignStatusTransitionError } from '@/lib/prospecting/campaigns';

const campaignSchema = z.object({
  name: z.string().min(2, 'Campaign name required'),
  industry: z.string().min(2, 'Industry required'),
  targetState: z.string().optional(),
  targetCities: z.array(z.string()).optional(),
  minimumReviewCount: z.number().optional().default(10),
  minimumRating: z.string().optional().default('4.0'),
  offerSummary: z.string().optional(),
  projectPriceMin: z.number().int().positive().optional().default(2000),
  projectPriceMax: z.number().int().positive().optional().default(5000),
});

export async function GET() {
  try {
    await requireCenturionAction('read');
    const list = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
    return NextResponse.json({ success: true, campaigns: list });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    return NextResponse.json({ success: false, error: 'Unable to load campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireCenturionAction('manage_campaigns');
    const body = await req.json();
    const validated = campaignSchema.parse(body);

    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        name: validated.name,
        industry: validated.industry,
        targetState: validated.targetState ?? null,
        targetCities: validated.targetCities ? JSON.stringify(validated.targetCities) : null,
        minimumReviewCount: validated.minimumReviewCount,
        minimumRating: validated.minimumRating,
        offerSummary: validated.offerSummary ?? null,
        projectPriceMin: validated.projectPriceMin,
        projectPriceMax: validated.projectPriceMax,
        status: 'active',
      })
      .returning();

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to create campaign' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('manage_campaigns');
    const body = await req.json();
    const validated = campaignStatusTransitionSchema.parse(body);

    const [existing] = await db.select().from(campaigns).where(eq(campaigns.id, validated.id));
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    const transitionError = getCampaignStatusTransitionError(existing.status, validated.status);
    if (transitionError) {
      return NextResponse.json({ success: false, error: transitionError }, { status: 400 });
    }

    const [updated] = await db
      .update(campaigns)
      .set({ status: validated.status, updatedAt: new Date() })
      .where(eq(campaigns.id, validated.id))
      .returning();

    await db.insert(auditLogs).values({
      action: 'campaign_status_change',
      performedBy: actor.userId,
      targetId: validated.id,
      detailsJson: JSON.stringify({ from: existing.status, to: validated.status }),
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to update campaign' }, { status: 500 });
  }
}
