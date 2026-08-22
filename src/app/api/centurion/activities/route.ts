import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { activities, prospects, suppressions, tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { createSuppressionHash } from '@/lib/prospecting/suppression';
import { callOutcomes, getOutcomeTransition } from '@/lib/prospecting/workflow';

const activitySchema = z.object({
  prospectId: z.string().uuid(),
  contactId: z.string().uuid().optional(),
  type: z.enum(['call', 'email', 'meeting', 'audit_sent', 'stage_change']),
  outcome: z.enum(callOutcomes),
  notes: z.string().optional(),
  nextAction: z.string().optional(),
  nextActionAt: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('log_outreach');
    const body = await req.json();
    const validated = activitySchema.parse(body);
    const transition = getOutcomeTransition(validated.outcome, validated.nextActionAt);
    const [targetProspect] = await db.select().from(prospects).where(eq(prospects.id, validated.prospectId));
    if (!targetProspect) {
      return NextResponse.json({ success: false, error: 'Prospect not found' }, { status: 404 });
    }

    const activityInsert = db.insert(activities).values({
      prospectId: validated.prospectId,
      contactId: validated.contactId ?? null,
      type: validated.type,
      outcome: validated.outcome,
      notes: validated.notes ?? null,
      performedBy: actor.userId,
      durationMinutes: validated.durationMinutes ?? null,
    }).returning();

    const prospectUpdate = db.update(prospects).set({
      status: transition.prospectStatus,
      qualificationStatus: transition.qualificationStatus,
      lastContactedAt: new Date(),
      nextAction: validated.nextAction ?? null,
      nextActionAt: validated.nextActionAt ?? null,
      disqualificationReason: transition.qualificationStatus === 'excluded'
        ? `Call outcome: ${validated.outcome}`
        : null,
      updatedAt: new Date(),
    }).where(eq(prospects.id, validated.prospectId));

    let activity;
    if (transition.createsSuppression) {
      const suppressionSecret = process.env.CENTURION_SUPPRESSION_SECRET;
      if (!suppressionSecret) {
        return NextResponse.json({ success: false, error: 'DNC suppression hashing is not configured' }, { status: 503 });
      }
      const scope = targetProspect.phone ? 'phone' : 'company';
      const valueHash = createSuppressionHash(targetProspect.phone || targetProspect.name, suppressionSecret, scope);
      const suppressionInsert = db.insert(suppressions).values({
        scope, valueHash, reason: 'do_not_contact',
        prospectId: targetProspect.id, createdBy: actor.userId,
      }).onConflictDoNothing();
      const [activityRows] = await db.batch([activityInsert, prospectUpdate, suppressionInsert]);
      activity = activityRows[0];
    } else {
      const [activityRows] = await db.batch([activityInsert, prospectUpdate]);
      activity = activityRows[0];
    }

    if (transition.createsTask && validated.nextActionAt) {
      await db.insert(tasks).values({
        prospectId: validated.prospectId,
        activityId: activity.id,
        assignedUserId: actor.userId,
        actionType: 'follow_up',
        title: validated.nextAction || `Follow up after ${validated.outcome}`,
        dueAt: validated.nextActionAt,
      });
    }

    return NextResponse.json({ success: true, activity });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unable to log outreach' }, { status: 500 });
  }
}
