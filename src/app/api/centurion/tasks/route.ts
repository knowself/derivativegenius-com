import { NextRequest, NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const updateSchema = z.object({ id: z.string().uuid(), status: z.enum(['open', 'completed', 'cancelled']) });

export async function GET() {
  try {
    await requireCenturionAction('read');
    return NextResponse.json({ success: true, tasks: await db.select().from(tasks).orderBy(asc(tasks.dueAt)) });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load tasks' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireCenturionAction('log_outreach');
    const input = updateSchema.parse(await request.json());
    const [task] = await db.update(tasks).set({ status: input.status, completedAt: input.status === 'completed' ? new Date() : null, updatedAt: new Date() }).where(eq(tasks.id, input.id)).returning();
    return NextResponse.json({ success: true, task });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error); if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to update task' }, { status: 500 });
  }
}
