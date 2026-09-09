import Link from 'next/link';
import { notFound } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ArrowLeft, Check, ExternalLink, Phone, X } from 'lucide-react';
import { db } from '@/db';
import { activities, audits, contacts, opportunities, prospects, tasks } from '@/db/schema';
import { requireCenturionPageAction } from '@/lib/auth/centurion';
import { calculateProspectScore } from '@/lib/prospecting/scoring';
import { buildConfirmedScoringInput } from '@/lib/prospecting/workflow';
import ProspectActions from './_components/ProspectActions';
import ProspectAuditActions from './_components/ProspectAuditActions';
import { extractSavedBy } from './_components/auditNarrative';

export const revalidate = 0;

export default async function ProspectDetailPage({ params, base = '/centurion' }: { params: Promise<{ id: string }>; base?: string }) {
  await requireCenturionPageAction('read');
  const { id } = await params;
  const [prospect] = await db.select().from(prospects).where(eq(prospects.id, id));
  if (!prospect) notFound();
  const [contactRows, auditRows, activityRows, taskRows, opportunityRows] = await Promise.all([
    db.select().from(contacts).where(eq(contacts.prospectId, id)),
    db.select().from(audits).where(eq(audits.prospectId, id)).orderBy(desc(audits.createdAt)),
    db.select().from(activities).where(eq(activities.prospectId, id)).orderBy(desc(activities.createdAt)),
    db.select().from(tasks).where(eq(tasks.prospectId, id)).orderBy(desc(tasks.dueAt)),
    db.select().from(opportunities).where(eq(opportunities.prospectId, id)),
  ]);
  const scoring = calculateProspectScore(buildConfirmedScoringInput({
    ...prospect,
    reviewCount: prospect.reviewCount ?? 0,
  }));
  const latestAudit = auditRows[0] ?? null;
  const initialAudit = latestAudit
    ? {
        targetOutcome: latestAudit.targetOutcome,
        findingsJson: latestAudit.findingsJson,
        scoreSummary: latestAudit.scoreSummary,
        proposalRange: latestAudit.proposalRange,
        status: latestAudit.status,
      }
    : null;
  const latestSummary = String(latestAudit?.scoreSummary ?? '');
  const initialSource = !latestAudit
    ? null
    : latestSummary.startsWith('Live eve audit-agent')
      ? ('live-agent' as const)
      : latestSummary.startsWith('Agent-performed deterministic')
        ? ('static-checks' as const)
        : null;
  const { userId: viewerId } = await auth();
  const viewerUser = await currentUser();
  const viewer = viewerId
    ? {
        id: viewerId,
        name: viewerUser?.username ?? viewerUser?.primaryEmailAddress?.emailAddress ?? null,
      }
    : null;

  return <div className="space-y-6">
    <Link href={`${base}/prospects`} className="inline-flex items-center gap-1 text-xs text-slate-400"><ArrowLeft className="w-4 h-4" /> Prospects</Link>
    <header className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4">
      <div><div className="flex gap-3 items-center"><h1 className="text-2xl font-bold text-white">{prospect.name}</h1><span className="text-emerald-400 font-bold">{prospect.score} pts</span></div><p className="text-xs text-slate-400 mt-2">{prospect.industry || 'Unclassified'} · {prospect.city || 'Unknown'}, {prospect.state || '—'} · {prospect.qualificationStatus}</p></div>
      <div className="flex gap-2">{prospect.phone && <a href={`tel:${prospect.phone}`} className="primary-link"><Phone className="w-4 h-4" /> {prospect.phone}</a>}{prospect.websiteUrl && <a href={prospect.websiteUrl.startsWith('http') ? prospect.websiteUrl : `https://${prospect.websiteUrl}`} target="_blank" rel="noreferrer" className="secondary-link">Website <ExternalLink className="w-4 h-4" /></a>}</div>
    </header>
    <ProspectAuditActions prospectId={prospect.id} prospectName={prospect.name} prospectWebsite={prospect.websiteUrl} initialAudit={initialAudit} initialSource={initialSource} initialSavedBy={extractSavedBy(latestAudit?.scoreSummary)} viewer={viewer} />
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5"><h2 className="font-semibold text-white mb-3">Transparent scoring evidence</h2><div className="grid md:grid-cols-2 gap-2">{scoring.breakdown.map((rule) => <div key={rule.ruleId} className={`p-2 rounded flex justify-between text-xs ${rule.matched ? 'bg-emerald-950/40 text-emerald-300' : 'bg-slate-950 text-slate-500'}`}><span className="flex gap-2">{rule.matched ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{rule.name}</span><strong>{rule.matched ? `+${rule.points}` : '0'}</strong></div>)}</div></section>
    <ProspectActions prospect={prospect} opportunityId={opportunityRows[0]?.id} />
    <div className="grid lg:grid-cols-2 gap-5">
      <RecordList title="Contacts" rows={contactRows.map((row) => `${row.fullName} · ${row.roleTitle || 'Role unknown'} · ${row.phone || row.email || 'No channel'}`)} />
      <RecordList title="Audit drafts" rows={auditRows.map((row) => `${row.status} · ${row.targetOutcome || 'No outcome'} · ${row.proposalRange || 'No range'}`)} />
      <RecordList title="Outreach history" rows={activityRows.map((row) => `${new Date(row.createdAt).toLocaleString()} · ${row.outcome || row.type} · ${row.notes || 'No notes'}`)} />
      <RecordList title="Follow-up tasks" rows={taskRows.map((row) => `${row.status} · ${new Date(row.dueAt).toLocaleString()} · ${row.title}`)} />
    </div>
    <style>{`.primary-link,.secondary-link{display:inline-flex;gap:.5rem;align-items:center;border-radius:.5rem;padding:.6rem .8rem;font-size:.75rem}.primary-link{background:#059669}.secondary-link{background:#1e293b}`}</style>
  </div>;
}

function RecordList({ title, rows }: { title: string; rows: string[] }) {
  return <section className="bg-slate-900 border border-slate-800 rounded-xl p-5"><h2 className="font-semibold text-white mb-3">{title}</h2>{rows.length ? <ul className="space-y-2">{rows.map((row, index) => <li key={`${row}-${index}`} className="text-xs text-slate-300 bg-slate-950 rounded p-2">{row}</li>)}</ul> : <p className="text-xs text-slate-500">Nothing recorded yet.</p>}</section>;
}
