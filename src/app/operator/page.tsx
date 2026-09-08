import Link from 'next/link';
import { PhoneCall, ClipboardCheck, Users, ArrowRight } from 'lucide-react';
import { db } from '@/db';
import { prospects, tasks } from '@/db/schema';
import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';

export const revalidate = 0;

export default async function OperatorHome() {
  const actor = await requireDashboardRole(OPERATOR_ROLES);
  const now = new Date();
  const [taskRows, prospectRows] = await Promise.all([
    db.select().from(tasks),
    db.select({ id: prospects.id, name: prospects.name }).from(prospects),
  ]);
  const nameById = new Map(prospectRows.map((p) => [p.id, p.name]));
  const mine = taskRows.filter(
    (t) => t.status === 'open' && (actor.role === 'centurion_admin' || t.assignedUserId === actor.userId),
  );
  const overdue = mine.filter((t) => t.dueAt && new Date(t.dueAt) < now).length;
  const due = mine
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">My work</p>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          {mine.length === 0 ? 'Caught up — run the queue' : `${mine.length} open task${mine.length === 1 ? '' : 's'}${overdue > 0 ? `, ${overdue} overdue` : ''}`}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Due-first. Log every outcome — the Centurion reads this record.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/operator/queue" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition">
            <PhoneCall className="w-4 h-4" /> Work Queue
          </Link>
          <Link href="/operator/prospects" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-sm transition">
            <Users className="w-4 h-4 text-emerald-400" /> Prospects
          </Link>
          <Link href="/operator/audits" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-sm transition">
            <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Audits
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Due tasks</h2>
        {due.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            Nothing assigned. <Link href="/operator/queue" className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-1">Open the queue <ArrowRight className="w-3 h-3" /></Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {due.map((t) => {
              const isOverdue = t.dueAt && new Date(t.dueAt) < now;
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 text-sm bg-slate-800/50 rounded-lg p-3">
                  <div className="min-w-0">
                    <p className="text-slate-200 font-medium truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {t.prospectId && nameById.get(t.prospectId) ? `${nameById.get(t.prospectId)} · ` : ''}
                      {t.dueAt ? new Date(t.dueAt).toLocaleString() : 'No due date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {isOverdue && <span className="text-xs font-semibold text-rose-400">OVERDUE</span>}
                    {t.prospectId && (
                      <Link href={`/operator/prospects/${t.prospectId}`} className="text-xs text-emerald-400 hover:underline font-medium">
                        Open
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
