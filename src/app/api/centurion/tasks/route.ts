import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks, prospects } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const taskCreateSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  actionType: z.string().default('call'),
  prospectId: z.string().uuid().optional().nullable(),
  dueAt: z.coerce.date().optional(),
  notes: z.string().optional().nullable(),
  assignedUserId: z.string().optional(),
});

const taskUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['open', 'completed']).optional(),
  title: z.string().min(2).optional(),
  notes: z.string().optional().nullable(),
  dueAt: z.coerce.date().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await requireCenturionAction('read');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const prospectId = searchParams.get('prospectId');

    const query = db
      .select({
        id: tasks.id,
        title: tasks.title,
        actionType: tasks.actionType,
        status: tasks.status,
        dueAt: tasks.dueAt,
        completedAt: tasks.completedAt,
        notes: tasks.notes,
        prospectId: tasks.prospectId,
        assignedUserId: tasks.assignedUserId,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        prospectName: prospects.name,
        prospectPhone: prospects.phone,
        prospectWebsiteUrl: prospects.websiteUrl,
        prospectCity: prospects.city,
        prospectState: prospects.state,
        prospectObservation: prospects.websiteObservation,
        prospectCommercialConsequence: prospects.commercialConsequence,
      })
      .from(tasks)
      .leftJoin(prospects, eq(tasks.prospectId, prospects.id));

    const allTasks = await query.orderBy(
      asc(tasks.status), // 'completed' vs 'open' ('completed' > 'open' alphabetically, but let's sort in JS or use sql)
      asc(tasks.dueAt)
    );

    // Filter if query params provided
    let filtered = allTasks;
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    if (prospectId) {
      filtered = filtered.filter(t => t.prospectId === prospectId);
    }

    // Sort: open tasks first (dueAt ascending), then completed tasks
    filtered.sort((a, b) => {
      if (a.status === 'open' && b.status !== 'open') return -1;
      if (a.status !== 'open' && b.status === 'open') return 1;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });

    return NextResponse.json({ success: true, tasks: filtered, count: filtered.length });
  } catch (error: unknown) {
    const authRes = centurionAuthorizationResponse(error);
    if (authRes) return authRes;
    return NextResponse.json({ success: false, error: 'Unable to load tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('qualify');
    const body = await req.json();
    const validated = taskCreateSchema.parse(body);

    const [created] = await db
      .insert(tasks)
      .values({
        title: validated.title,
        actionType: validated.actionType,
        prospectId: validated.prospectId ?? null,
        assignedUserId: validated.assignedUserId || actor.userId,
        dueAt: validated.dueAt ?? new Date(),
        notes: validated.notes ?? null,
        status: 'open',
      })
      .returning();

    return NextResponse.json({ success: true, task: created }, { status: 201 });
  } catch (error: unknown) {
    const authRes = centurionAuthorizationResponse(error);
    if (authRes) return authRes;
    const msg = error instanceof Error ? error.message : 'Unable to create task';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireCenturionAction('qualify');
    const body = await req.json();
    const validated = taskUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (validated.status) {
      updateData.status = validated.status;
      updateData.completedAt = validated.status === 'completed' ? new Date() : null;
    }
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.notes !== undefined) updateData.notes = validated.notes;
    if (validated.dueAt !== undefined) updateData.dueAt = validated.dueAt;

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, validated.id))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task: updated });
  } catch (error: unknown) {
    const authRes = centurionAuthorizationResponse(error);
    if (authRes) return authRes;
    const msg = error instanceof Error ? error.message : 'Unable to update task';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
