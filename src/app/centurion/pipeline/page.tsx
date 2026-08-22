import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { opportunities, proposals, prospects } from '@/db/schema';
import { requireCenturionPageAction } from '@/lib/auth/centurion';
import PipelineActions from './_components/PipelineActions';

export const revalidate = 0;

export default async function PipelinePage() {
  await requireCenturionPageAction('read');
  const [rows, proposalRows] = await Promise.all([
    db.select({ opportunity: opportunities, prospectName: prospects.name }).from(opportunities).innerJoin(prospects, eq(opportunities.prospectId, prospects.id)).orderBy(desc(opportunities.updatedAt)),
    db.select().from(proposals).orderBy(desc(proposals.createdAt)),
  ]);
  const weighted = rows.reduce((sum, row) => sum + Math.round((row.opportunity.estimatedValue ?? 0) * row.opportunity.probabilityPercent / 100), 0);
  return <div className="space-y-5"><header className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between"><div><h1 className="text-xl font-bold text-white">Opportunity Pipeline</h1><p className="text-sm text-slate-400 mt-1">Discovery, audit, proposal, win, and handoff records tied to real values.</p></div><strong className="text-2xl text-emerald-400">${weighted.toLocaleString()} weighted</strong></header>
    <div className="space-y-3">{rows.length === 0 ? <p className="p-10 text-center bg-slate-900 rounded-xl text-slate-500">Create an opportunity from an engaged prospect.</p> : rows.map(({ opportunity, prospectName }) => {
      const related = proposalRows.filter((proposal) => proposal.opportunityId === opportunity.id);
      return <article key={opportunity.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5"><div className="flex justify-between"><div><Link href={`/centurion/prospects/${opportunity.prospectId}`} className="font-bold text-white hover:text-emerald-400">{prospectName}</Link><p className="text-xs text-slate-400">{opportunity.packageName || 'Package not set'} · {opportunity.nextAction || 'No next action'}</p></div><div className="text-right"><p className="text-emerald-400 font-bold">${(opportunity.estimatedValue ?? 0).toLocaleString()}</p><p className="text-xs text-slate-400">{opportunity.stage} · {opportunity.probabilityPercent}%</p></div></div><p className="text-xs text-slate-500 mt-3">Proposals: {related.map((proposal) => `${proposal.status} $${proposal.amount.toLocaleString()}`).join(' · ') || 'none'}</p><PipelineActions opportunityId={opportunity.id} canHandoff={opportunity.stage === 'closed_won'} /></article>;
    })}</div>
  </div>;
}
