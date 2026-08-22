import React from 'react';
import { db } from '@/db';
import { suppressions, auditLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Lock, ShieldAlert, FileText, Download } from 'lucide-react';
import { requireCenturionPageAction } from '@/lib/auth/centurion';

export const revalidate = 0;

export default async function CompliancePage() {
  await requireCenturionPageAction('manage_compliance');
  const suppressionList = await db.select().from(suppressions).orderBy(desc(suppressions.createdAt)).limit(50);
  const auditLogList = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Centurion Compliance & Suppression Center</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Centurion Root (`centurion_admin`) governance over phone/email opt-outs, audit trails, and data policy enforcement.
          </p>
        </div>
        <a
          href="/api/centurion/export"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold border border-slate-700 transition"
        >
          <Download className="w-4 h-4 text-emerald-400" /> Export Full Database CSV
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Suppressions List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Active Suppressions & DNC Hashes
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {suppressionList.length} Active
            </span>
          </div>

          {suppressionList.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No do-not-contact suppressions recorded yet.</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
              {suppressionList.map((sup) => (
                <div key={sup.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-400 uppercase">{sup.scope}: {sup.valueHash.slice(0, 12)}…</span>
                    <span className="text-slate-500">{new Date(sup.effectiveAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-slate-400">Reason: {sup.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Centurion System Audit Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> System Root Audit Trail
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {auditLogList.length} Events
            </span>
          </div>

          {auditLogList.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No root actions logged yet.</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
              {auditLogList.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 capitalize">{log.action}</span>
                    <span className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400">Operator: {log.performedBy} (IP: {log.ipAddress})</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
