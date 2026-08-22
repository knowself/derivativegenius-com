import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prospects, auditLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

export async function GET(req: NextRequest) {
  try {
    const actor = await requireCenturionAction('export');
    // Audit log entry for root export action
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    await db.insert(auditLogs).values({
      action: 'export_csv',
      performedBy: actor.userId,
      detailsJson: JSON.stringify({ timestamp: new Date().toISOString() }),
      ipAddress: clientIp,
    });

    const records = await db
      .select()
      .from(prospects)
      .orderBy(desc(prospects.score));

    // Convert records to CSV format
    const headers = ['ID', 'Name', 'Industry', 'Status', 'Qualification', 'Score', 'Website', 'Phone', 'City', 'State', 'Zip'];
    const rows = records.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.industry || '').replace(/"/g, '""')}"`,
      p.status,
      p.qualificationStatus,
      p.score,
      p.websiteUrl || '',
      p.phone || '',
      p.city || '',
      p.state || '',
      p.zip || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="centurion_prospects_${Date.now()}.csv"`,
      },
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    return NextResponse.json({ success: false, error: 'Unable to export prospects' }, { status: 500 });
  }
}
