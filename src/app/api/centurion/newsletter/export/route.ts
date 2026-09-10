import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscribers, auditLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

export async function GET(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('export');
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (db) {
      try {
        await db.insert(auditLogs).values({
          action: 'export_newsletter_subscribers',
          performedBy: actor.userId,
          detailsJson: JSON.stringify({ timestamp: new Date().toISOString() }),
          ipAddress: clientIp,
        });
      } catch (auditErr) {
        console.warn('[Newsletter Export Audit Warning]', auditErr);
      }
    }

    const records = db
      ? await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt))
      : [];

    // Build CSV
    const headers = ['ID', 'Email', 'Source', 'Status', 'Created At'];
    const rows = records.map((s) => [
      s.id,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.source || '').replace(/"/g, '""')}"`,
      s.status,
      s.createdAt ? new Date(s.createdAt).toISOString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="centurion_newsletter_subscribers_${Date.now()}.csv"`,
      },
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    console.error('[Newsletter Export Error]', error);
    return NextResponse.json(
      { success: false, error: 'Unable to export newsletter subscribers' },
      { status: 500 },
    );
  }
}
