import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { prospects, campaigns, suppressions, activities, opportunities } from '@/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import { Users, ShieldAlert, PhoneCall, CheckCircle2, TrendingUp, ArrowRight, FileText, UploadCloud } from 'lucide-react';
import { requireCenturionPageAction } from '@/lib/auth/centurion';

export const revalidate = 0; // Dynamic server rendering

export default async function CenturionDashboard() {
  await requireCenturionPageAction('read');
  // Query summary statistics
  const [prospectsCount] = await db.select({ value: count() }).from(prospects);
  const [priorityCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.qualificationStatus, 'priority'));
  const [qualifiedCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.qualificationStatus, 'qualified'));
  const [disqualifiedCount] = await db.select({ value: count() }).from(prospects).where(eq(prospects.status, 'disqualified'));
  const [campaignsCount] = await db.select({ value: count() }).from(campaigns);
  const [suppressionsCount] = await db.select({ value: count() }).from(suppressions);
  const opportunityRows = await db.select().from(opportunities);

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
    .orderBy(desc(activities.createdAt))
    .limit(5);

  const pipelineValue = opportunityRows.reduce(
    (sum, opportunity) => sum + Math.round((opportunity.estimatedValue ?? 0) * opportunity.probabilityPercent / 100),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Centurion Executive Control</h1>
          <p className="text-sm text-slate-400 mt-1">
            Private business discovery, lead scoring, and manual outreach pipeline ($2k-$5k projects).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/centurion/import"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-emerald-950"
          >
            <UploadCloud className="w-4 h-4" /> Import CSV
          </Link>
          <Link
            href="/centurion/queue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-medium text-sm transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" /> Start Daily Queue
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Prospects</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{prospectsCount.value}</div>
          <div className="text-xs text-slate-500 mt-1">{campaignsCount.value} active campaign(s)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Priority Leads (75+)</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{priorityCount.value}</div>
          <div className="text-xs text-emerald-500/80 mt-1">{qualifiedCount.value} qualified nurture leads</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Weighted Pipeline</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">${pipelineValue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">From recorded opportunity values and probabilities</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Suppressed / DNC</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 mt-2">{suppressionsCount.value}</div>
          <div className="text-xs text-slate-500 mt-1">{disqualifiedCount.value} disqualified prospect(s)</div>
        </div>
      </div>

      {/* Dashboard Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & Workflow */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Centurion Operating Workflow</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/centurion/campaigns" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">1. Define Campaign</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Set vertical, geography, minimum reviews, and target score parameters.</p>
              </Link>

              <Link href="/centurion/import" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">2. Import & Deduplicate</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Upload CSV or manual records. Auto-deduplicate by Place ID, domain, and phone.</p>
              </Link>

              <Link href="/centurion/prospects" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">3. Inspect & Score</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Review transparent v1.0 score rules and confirm decision-maker contact details.</p>
              </Link>

              <Link href="/centurion/queue" className="p-4 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition group">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white group-hover:text-emerald-400">4. Execute Outreach Queue</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Call manually, log outcomes, and trigger immediate DNC suppression on opt-out.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Recent Activity Log</h2>
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
                      <span className="text-slate-500">{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            Centurion Root Policy: High-scoring prospects (≥ 75) receive priority queue ordering.
          </div>
        </div>
      </div>
    </div>
  );
}
