import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { workSessions } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const schema = z.object({ campaignId: z.string().uuid(), workType: z.enum(['research', 'outreach', 'follow_up', 'audit', 'proposal']), durationMinutes: z.number().int().positive(), notes: z.string().optional(), workedAt: z.coerce.date().optional() });

export async function GET() {
  try {
    await requireCenturionAction('read');
    return NextResponse.json({ success: true, workSessions: await db.select().from(workSessions).orderBy(desc(workSessions.workedAt)).limit(100) });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load work sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requireCenturionAction('log_outreach');
    const input = schema.parse(await request.json());
    const [session] = await db.insert(workSessions).values({ ...input, operatorUserId: actor.userId, workedAt: input.workedAt ?? new Date() }).returning();
    return NextResponse.json({ success: true, workSession: session });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error); if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to record work session' }, { status: 500 });
  }
}
