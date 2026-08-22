import { NextResponse } from 'next/server';
import { db } from '@/db';
import { activities, audits, opportunities, proposals, prospects, tasks, workSessions } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

export async function GET() {
  try {
    await requireCenturionAction('read');
    const [prospectRows, activityRows, auditRows, opportunityRows, proposalRows, taskRows, sessionRows] = await Promise.all([
      db.select().from(prospects), db.select().from(activities), db.select().from(audits),
      db.select().from(opportunities), db.select().from(proposals), db.select().from(tasks), db.select().from(workSessions),
    ]);
    const countBy = (values: string[]) => values.reduce<Record<string, number>>((result, value) => ({ ...result, [value]: (result[value] ?? 0) + 1 }), {});
    const workedMinutes = sessionRows.reduce((sum, session) => sum + session.durationMinutes, 0);
    const wonValue = opportunityRows.filter((row) => row.stage === 'closed_won').reduce((sum, row) => sum + (row.estimatedValue ?? 0), 0);
    const weightedPipeline = opportunityRows.reduce((sum, row) => sum + Math.round((row.estimatedValue ?? 0) * row.probabilityPercent / 100), 0);
    return NextResponse.json({ success: true, report: {
      prospects: prospectRows.length, qualification: countBy(prospectRows.map((row) => row.qualificationStatus)),
      calls: activityRows.filter((row) => row.type === 'call').length, outcomes: countBy(activityRows.map((row) => row.outcome ?? 'none')),
      audits: countBy(auditRows.map((row) => row.status)), pipeline: countBy(opportunityRows.map((row) => row.stage)),
      proposals: countBy(proposalRows.map((row) => row.status)), openTasks: taskRows.filter((row) => row.status === 'open').length,
      workedMinutes, wonValue, weightedPipeline,
    }});
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to load report' }, { status: 500 });
  }
}
