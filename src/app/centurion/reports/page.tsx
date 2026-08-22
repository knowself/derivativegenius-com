import { db } from '@/db';
import { activities, audits, campaigns, opportunities, proposals, prospects, tasks, workSessions } from '@/db/schema';
import { requireCenturionPageAction } from '@/lib/auth/centurion';
import WorkSessionForm from './_components/WorkSessionForm';

export const revalidate = 0;

export default async function ReportsPage() {
  await requireCenturionPageAction('read');
  const [prospectRows, activityRows, auditRows, opportunityRows, proposalRows, taskRows, sessionRows, campaignRows] = await Promise.all([
    db.select().from(prospects), db.select().from(activities), db.select().from(audits), db.select().from(opportunities),
    db.select().from(proposals), db.select().from(tasks), db.select().from(workSessions), db.select().from(campaigns),
  ]);
  const calls = activityRows.filter((row) => row.type === 'call').length;
  const conversations = activityRows.filter((row) => ['decision_maker_reached', 'audit_requested', 'meeting_booked', 'follow_up_requested'].includes(row.outcome ?? '')).length;
  const wonValue = opportunityRows.filter((row) => row.stage === 'closed_won').reduce((sum, row) => sum + (row.estimatedValue ?? 0), 0);
  const weighted = opportunityRows.reduce((sum, row) => sum + Math.round((row.estimatedValue ?? 0) * row.probabilityPercent / 100), 0);
  const metrics = [
    ['Companies', prospectRows.length], ['Priority', prospectRows.filter((row) => row.qualificationStatus === 'priority').length],
    ['Calls', calls], ['Conversations', conversations], ['Audit requests', activityRows.filter((row) => row.outcome === 'audit_requested').length],
    ['Audits sent', auditRows.filter((row) => row.status === 'sent').length], ['Meetings', activityRows.filter((row) => row.outcome === 'meeting_booked').length],
    ['Proposals', proposalRows.length], ['Open follow-ups', taskRows.filter((row) => row.status === 'open').length],
    ['Founder hours', (sessionRows.reduce((sum, row) => sum + row.durationMinutes, 0) / 60).toFixed(1)],
    ['Weighted pipeline', `$${weighted.toLocaleString()}`], ['Won value', `$${wonValue.toLocaleString()}`],
  ];
  return <div className="space-y-5"><header className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h1 className="text-xl font-bold text-white">Pilot Evidence Report</h1><p className="text-sm text-slate-400 mt-1">Real recorded activity, conversion milestones, pipeline value, and founder time.</p></header>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">{metrics.map(([label, value]) => <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-xs text-slate-400">{label}</p><p className="text-2xl font-bold text-white mt-1">{value}</p></div>)}</section>
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"><div><h2 className="font-semibold text-white">Record founder work</h2><p className="text-xs text-slate-400">Track the manual effort required so the pilot can judge economics honestly.</p></div><WorkSessionForm campaigns={campaignRows.map(({ id, name }) => ({ id, name }))} /></section>
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5"><h2 className="font-semibold text-white mb-2">Decision signal</h2><p className="text-sm text-slate-300">Conversation rate: {calls ? `${Math.round(conversations / calls * 100)}%` : 'not enough data'} · Proposal rate: {conversations ? `${Math.round(proposalRows.length / conversations * 100)}%` : 'not enough data'} · Revenue per founder hour: {sessionRows.length ? `$${Math.round(wonValue / Math.max(1, sessionRows.reduce((sum, row) => sum + row.durationMinutes, 0) / 60)).toLocaleString()}` : 'not enough data'}.</p></section>
  </div>;
}
