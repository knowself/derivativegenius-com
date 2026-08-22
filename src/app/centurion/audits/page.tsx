import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { audits, prospects } from '@/db/schema';
import { requireCenturionPageAction } from '@/lib/auth/centurion';
import AuditStatusButton from './_components/AuditStatusButton';

export const revalidate = 0;

export default async function AuditsPage() {
  await requireCenturionPageAction('read');
  const rows = await db.select({ audit: audits, prospectName: prospects.name }).from(audits).innerJoin(prospects, eq(audits.prospectId, prospects.id)).orderBy(desc(audits.createdAt));
  return <div className="space-y-5"><header className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h1 className="text-xl font-bold text-white">Website Audit Review</h1><p className="text-sm text-slate-400 mt-1">Draft, review, approve, and record delivery. External sending remains a deliberate founder action.</p></header>
    <div className="space-y-3">{rows.length === 0 ? <p className="p-10 text-center bg-slate-900 rounded-xl text-slate-500">Create the first audit from a prospect workspace.</p> : rows.map(({ audit, prospectName }) => {
      const findings = audit.findingsJson ? JSON.parse(audit.findingsJson) as string[] : [];
      return <article key={audit.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5"><div className="flex justify-between gap-4"><div><Link href={`/centurion/prospects/${audit.prospectId}`} className="font-bold text-white hover:text-emerald-400">{prospectName}</Link><p className="text-xs text-slate-400">{audit.targetOutcome}</p></div><span className="text-xs text-emerald-400">{audit.status}</span></div><ul className="mt-3 text-sm text-slate-300 list-disc pl-5">{findings.map((finding) => <li key={finding}>{finding}</li>)}</ul><div className="flex gap-2 mt-4"><AuditStatusButton id={audit.id} status="internal_review" /><AuditStatusButton id={audit.id} status="approved" />{audit.status === 'approved' && <AuditStatusButton id={audit.id} status="sent" />}</div></article>;
    })}</div>
  </div>;
}
