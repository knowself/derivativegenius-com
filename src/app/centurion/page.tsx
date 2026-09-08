import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { prospects, campaigns, suppressions, activities, opportunities, tasks, audits, proposals } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { Users, ShieldAlert, PhoneCall, CheckCircle2, TrendingUp, ArrowRight, FileText, UploadCloud, Flame, OctagonAlert, Handshake, ClipboardCheck } from 'lucide-react';
import { requireCenturionPageAction } from '@/lib/auth/centurion';

export const revalidate = 0; // Dynamic server rendering

const CLOSED_STAGES = ['closed_won', 'closed_lost'];
const BLOCKED_AUDIT_STATUSES = ['draft', 'internal_review', 'approved'];

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export default async function CenturionDashboard() {
  await requireCenturionPageAction('read');
  const now = new Date();
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  // Summary counts (kept for system health row)
  const [prospectsCount] = await db.select({ value: count() }).from(prospects);
  const [priorityCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.qualificationStatus, 'priority'));
  const [qualifiedCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.qualificationStatus, 'qualified'));
  const [disqualifiedCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.status, 'disqualified'));
  const [campaignsCount] = await db.select({ value: count() }).from(campaigns);
  const [suppressionsCount] = await db.select({ value: count() }).from(suppressions);

  // Revenue-driving records (small pilot tables — filter in JS for robustness)
  const [opportunityRows, taskRows, auditRows, proposalRows, prospectRows] = await Promise.all([
    db.select().from(opportunities),
    db.select().from(tasks),
    db.select().from(audits),
    db.select().from(proposals),
    db.select({ id: prospects.id, name: prospects.name }).from(prospects),
  ]);

  const prospectNameById = new Map(prospectRows.map((p) => [p.id, p.name]));

  const openTasks = taskRows.filter((t) => t.status === 'open');
  const overdueTasks = openTasks
    .filter((t) => t.dueAt && new Date(t.dueAt) < now)
    .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime())
    .slice(0, 7);
  const dueTodayTasks = openTasks.filter((t) => t.dueAt && new Date(t.dueAt) >= todayStart && new Date(t.dueAt) <= todayEnd);
  const overdueCount = openTasks.filter((t) => t.dueAt && new Date(t.dueAt) < now).length;

  const openOpportunities = opportunityRows.filter((o) => !CLOSED_STAGES.includes(o.stage));
  const oppsNoNextAction = openOpportunities
    .filter((o) => !o.nextActionAt || new Date(o.nextActionAt) < now)
    .slice(0, 7);

  const outstandingProposals = proposalRows.filter((p) => p.status === 'sent').slice(0, 7);
  const outstandingProposalValue = proposalRows
    .filter((p) => p.status === 'sent')
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const blockedAudits = auditRows.filter((a) => BLOCKED_AUDIT_STATUSES.includes(a.status)).slice(0, 7);

  const blockerCount = overdueCount + outstandingProposals.length + blockedAudits.length + oppsNoNextAction.length;

  // Recent activity logs
  const recentActivities = await db
    .select({
      id: activities.id,
      type: activities.type,
      outcome: activities.outcome,
      notes: activities.notes,
      performedBy: activities.performedBy,
      createdAt: activities.createdAt,
      prospectName: prospects.name,
    })
    .from(activities)
    .innerJoin(prospects, eq(activities.prospectId, prospects.id))
    .orderBy(activities.createdAt)
    .limit(5);

  const pipelineValue = opportunityRows.reduce(
    (sum, opportunity) => sum + Math.round((opportunity.estimatedValue ?? 0) * opportunity.probabilityPercent / 100),
    0,
  );
  const wonValue = opportunityRows
    .filter((o) => o.stage === 'closed_won')
    .reduce((sum, o) => sum + (o.estimatedValue ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Revenue-first header */}
      <div className="bg-slate-900 border border-emerald-500/20 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Revenue operations</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            {blockerCount > 0 ? `${blockerCount} blocker${blockerCount === 1 ? '' : 's'} before new leads` : 'No blockers — run the queue'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Weighted ${pipelineValue.toLocaleString()} · Won ${wonValue.toLocaleString()} · {openTasks.length} open follow-up{openTasks.length === 1 ? '' : 's'} · {outstandingProposals.length} proposal{outstandingProposals.length === 1 ? '' : 's'} awaiting decision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/centurion/queue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-emerald-950"
          >
            <PhoneCall className="w-4 h-4" /> Work Daily Queue{overdueCount > 0 ? ` (${overdueCount} overdue)` : ''}
          </Link>
          <Link
            href="/centurion/audits"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-sm transition"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-400" /> Review Audits{blockedAudits.length > 0 ? ` (${blockedAudits.length})` : ''}
          </Link>
          <Link
            href="/centurion/pipeline"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-sm transition"
          >
            <Handshake className="w-4 h-4 text-emerald-400" /> Close Proposals{outstandingProposals.length > 0 ? ` (${outstandingProposals.length})` : ''}
          </Link>
        </div>
      </div>

      {/* Blockers — fix these first */}
      <div className="bg-slate-900 border border-rose-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <OctagonAlert className="w-5 h-5 text-rose-400" /> Blockers — fix these first
          </h2>
          <span className="text-xs text-slate-400">Overdue &amp; stuck revenue, due-first</span>
        </div>

        {blockerCount === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">
            Nothing overdue. Next safe valuable action: <Link href="/centurion/queue" className="text-emerald-400 hover:underline font-medium">work the daily queue</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-800/50 border border-slate-700/60 p-4">
              <h3 className="text-sm font-semibold text-white">Overdue follow-ups ({overdueCount})</h3>
              {overdueTasks.length === 0 ? (
                <p className="text-xs text-slate-500 mt-2">None — open tasks are on time.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {overdueTasks.map((t) => (
                    <li key={t.id} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                      <span className="truncate">{t.title}{t.prospectId && prospectNameById.get(t.prospectId) ? ` · ${prospectNameById.get(t.prospectId)}` : ''}</span>
                      <span className="text-rose-400 shrink-0">{t.dueAt ? new Date(t.dueAt).toLocaleDateString() : 'overdue'}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/centurion/tasks" className="text-xs text-emerald-400 hover:underline mt-3 inline-flex items-center gap-1">Clear in Tasks <ArrowRight className="w-3 h-3" /></Link>
            </div>

            <div className="rounded-lg bg-slate-800/50 border border-slate-700/60 p-4">
              <h3 className="text-sm font-semibold text-white">Proposals awaiting decision ({outstandingProposals.length})</h3>
              {outstandingProposals.length === 0 ? (
                <p className="text-xs text-slate-500 mt-2">No sent proposals waiting.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {outstandingProposals.map((p) => (
                    <li key={p.id} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                      <span className="truncate">{p.scopeSummary}</span>
                      <span className="text-emerald-400 shrink-0">${(p.amount ?? 0).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/centurion/pipeline" className="text-xs text-emerald-400 hover:underline mt-3 inline-flex items-center gap-1">Close in Pipeline <ArrowRight className="w-3 h-3" /></Link>
            </div>

            <div className="rounded-lg bg-slate-800/50 border border-slate-700/60 p-4">
              <h3 className="text-sm font-semibold text-white">Audits stuck before send ({blockedAudits.length})</h3>
              {blockedAudits.length === 0 ? (
                <p className="text-xs text-slate-500 mt-2">No audits waiting for review or approval.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {blockedAudits.map((a) => (
                    <li key={a.id} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                      <span className="truncate">{prospectNameById.get(a.prospectId) ?? 'Prospect'}</span>
                      <span className="text-amber-400 capitalize shrink-0">{a.status.replace('_', ' ')}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/centurion/audits" className="text-xs text-emerald-400 hover:underline mt-3 inline-flex items-center gap-1">Approve in Audits <ArrowRight className="w-3 h-3" /></Link>
            </div>

            <div className="rounded-lg bg-slate-800/50 border border-slate-700/60 p-4">
              <h3 className="text-sm font-semibold text-white">Open deals with no next action ({oppsNoNextAction.length})</h3>
              {oppsNoNextAction.length === 0 ? (
                <p className="text-xs text-slate-500 mt-2">Every open deal has a dated next step.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {oppsNoNextAction.map((o) => (
                    <li key={o.id} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                      <span className="truncate">{prospectNameById.get(o.prospectId) ?? 'Deal'} · {o.stage.replace('_', ' ')}</span>
                      <span className="text-rose-400 shrink-0">{o.nextActionAt ? new Date(o.nextActionAt).toLocaleDateString() : 'no date'}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/centurion/pipeline" className="text-xs text-emerald-400 hover:underline mt-3 inline-flex items-center gap-1">Date in Pipeline <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </div>
        )}
      </div>

      {/* Revenue now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/centurion/queue" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Due today</span>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{dueTodayTasks.length}</div>
          <div className="text-xs text-slate-500 mt-1">{overdueCount} overdue · {openTasks.length} open total</div>
        </Link>

        <Link href="/centurion/pipeline" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Proposals outstanding</span>
            <Handshake className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">${outstandingProposalValue.toLocaleString()}</div>
          <div className="text-xs text-emerald-500/80 mt-1">{outstandingProposals.length} sent · close or revise</div>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Weighted pipeline</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">${pipelineValue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">{openOpportunities.length} open deals · ${wonValue.toLocaleString()} won</div>
        </div>

        <Link href="/centurion/prospects" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Priority leads (75+)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{priorityCount.value}</div>
          <div className="text-xs text-emerald-500/80 mt-1">{qualifiedCount.value} qualified · {prospectsCount.value} total in {campaignsCount.value} campaign(s)</div>
        </Link>
      </div>

      {/* Operating workflow + system health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Revenue workflow</h2>
              <Link href="/centurion/import" className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition">
                <UploadCloud className="w-3.5 h-3.5" /> Import CSV
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/centurion/queue" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">1. Work the queue</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Due-first calls, log outcomes, suppress DNC immediately.</p>
              </Link>

              <Link href="/centurion/audits" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">2. Approve &amp; send audits</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Audits are the lead — approve, send on permission, follow up.</p>
              </Link>

              <Link href="/centurion/pipeline" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">3. Advance pipeline</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Discovery → proposal → negotiation → won. Every deal dated.</p>
              </Link>

              <Link href="/centurion/campaigns" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">4. Fill the next campaign</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Only after blockers above are clear — commitments before new leads.</p>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4 text-xs text-slate-400">
            <Users className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{prospectsCount.value} prospects · {disqualifiedCount.value} disqualified · <ShieldAlert className="w-3.5 h-3.5 inline text-rose-400" /> {suppressionsCount.value} suppressed/DNC — queue and sends exclude suppressions.</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Recent activity</h2>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>

            {recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No call or outreach activities recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-lg bg-slate-800/50 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-white">{act.prospectName}</span>
                      <span className="text-slate-500">{act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div className="text-slate-400">
                      <span className="capitalize text-emerald-400 font-medium">{act.type}</span> • {act.outcome || 'Attempted'}
                    </div>
                    {act.notes && <div className="text-slate-500 italic truncate">{act.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <Link href="/centurion/queue" className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-medium">
              <PhoneCall className="w-3.5 h-3.5" /> Start daily queue
            </Link>
            <span className="mx-2">·</span>
            <Link href="/centurion/reports" className="hover:underline">Pilot evidence report</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
