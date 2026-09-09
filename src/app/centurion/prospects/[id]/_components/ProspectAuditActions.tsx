'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE, buildAuditNarrative, type SavedAuditLike, type ViewerIdentity } from './auditNarrative';

interface SaveResult {
  audit?: SavedAuditLike;
  source?: 'live-agent' | 'static-checks' | null;
  savedBy?: string | null;
}

export default function ProspectAuditActions({ prospectId, prospectName, prospectWebsite = null, initialAudit = null, initialSource = null, initialSavedBy = null, viewer = null }: {
  prospectId: string;
  prospectName: string;
  prospectWebsite?: string | null;
  initialAudit?: SavedAuditLike | null;
  initialSource?: 'live-agent' | 'static-checks' | null;
  initialSavedBy?: string | null;
  viewer?: ViewerIdentity | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState('');
  const [audit, setAudit] = useState({ targetOutcome: 'Increase qualified quote requests', findings: '', scoreSummary: '', proposalRange: '$2,000–$5,000' });
  const [lastSaved, setLastSaved] = useState<SaveResult | null>(
    initialAudit ? { audit: initialAudit, source: initialSource, savedBy: initialSavedBy } : null,
  );

  const send = async (key: string, url: string, body: object, method = 'POST'): Promise<SaveResult | false> => {
    setSaving(key);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const detail = Array.isArray(data.errors) && data.errors.length > 0
          ? `: ${data.errors.map((e: { path?: Array<string | number>; message?: string }) => `${(e.path ?? []).join('.') || 'input'} ${e.message ?? 'invalid'}`).join('; ')}`
          : '';
        throw new Error(`${data.error || `Unable to save ${key}`}${detail}`);
      }
      toast.success(`${key} saved`); router.refresh();
      const result: SaveResult = {
        audit: data.audit ?? undefined,
        source: data.source ?? null,
        savedBy: typeof data.savedBy === 'string' ? data.savedBy : null,
      };
      if (result.audit) setLastSaved(result);
      return result;
    } catch (error) { toast.error(error instanceof Error ? error.message : `Unable to save ${key}`); return false; }
    finally { setSaving(''); }
  };

  const copyNarrative = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Narrative copied — ready to paste to the client');
    } catch {
      toast.error('Copy failed — select the text manually');
    }
  };

  return <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
    <div><h2 className="font-semibold text-white">Website audit</h2><p className="text-xs text-slate-400">Runs the audit and saves a reviewable draft. Nothing is ever sent from here.</p></div>
    <button disabled={saving === 'agent audit'} onClick={() => void send('agent audit', `/api/centurion/prospects/${prospectId}/agent-audit`, {})} className="primary w-full">{saving === 'agent audit' ? 'Running audit… (~20s, do not close)' : 'Run audit'}</button>
    <input data-lpignore="true" value={audit.targetOutcome} onChange={(event) => setAudit({ ...audit, targetOutcome: event.target.value })} className="field w-full" />
    <textarea data-lpignore="true" value={audit.findings} onChange={(event) => setAudit({ ...audit, findings: event.target.value })} placeholder="One finding per line (leave empty to auto-run machine checks)" className="field w-full" />
    <div className="grid sm:grid-cols-2 gap-2"><input data-lpignore="true" value={audit.scoreSummary} onChange={(event) => setAudit({ ...audit, scoreSummary: event.target.value })} placeholder="Audit summary" className="field" /><input data-lpignore="true" value={audit.proposalRange} onChange={(event) => setAudit({ ...audit, proposalRange: event.target.value })} className="field" /></div>
    <button disabled={saving === 'audit' || saving === 'agent audit'} onClick={() => {
      const typed = audit.findings.split('\n').map((line) => line.trim()).filter(Boolean);
      if (typed.length === 0) {
        // No hand-typed findings — run the deterministic machine checks instead,
        // which always produce at least one evidence-cited draft finding.
        return void send('agent audit', `/api/centurion/prospects/${prospectId}/agent-audit`, {});
      }
      return void send('audit', '/api/centurion/audits', { prospectId, ...audit, findings: typed });
    }} className="primary">{saving === 'agent audit' ? 'Running audit…' : saving === 'audit' ? 'Saving…' : 'Create audit draft'}</button>
    {lastSaved?.audit && (() => {
      const narrative = buildAuditNarrative(
        lastSaved.audit,
        { name: prospectName, websiteUrl: prospectWebsite },
        { savedBy: lastSaved.savedBy ?? null, source: lastSaved.source ?? null, viewer },
      );
      return <div className="rounded-lg border border-emerald-900 bg-slate-950/70 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white">Client-ready narrative <span className="ml-1 rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">draft — review before sending</span></h3>
          <button onClick={() => void copyNarrative(narrative.plainText)} className="shrink-0 rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700">Copy</button>
        </div>
        <p className="text-xs text-slate-300">Outcome we&apos;re aiming for: <strong className="text-white">{narrative.outcome}</strong></p>
        <ol className="space-y-2">{narrative.findings.map((finding, index) => <li key={index} className="text-xs text-slate-200 leading-relaxed"><span className="font-bold text-emerald-400">{index + 1}. </span>{finding}</li>)}</ol>
        <div className="rounded border border-emerald-900/60 bg-emerald-950/30 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">What we&apos;d do first</div>
          <p className="mt-1 text-xs text-slate-100 leading-relaxed">{narrative.firstStep}</p>
          {narrative.proposalRange && <p className="mt-1 text-xs text-slate-300">Typical engagement for this fix: <strong className="text-white">{narrative.proposalRange}</strong>.</p>}
        </div>
        <p className="text-[11px] text-slate-500">{narrative.sourceNote}</p>
        <div className="border-t border-slate-800 pt-2 text-[11px] leading-relaxed text-slate-400">
          <div className="font-bold text-slate-200">{COMPANY_NAME}</div>
          {narrative.savedBy && <div>Prepared by: {narrative.savedBy}</div>}
          <div>{COMPANY_EMAIL}</div>
          <div>{COMPANY_PHONE}</div>
        </div>
      </div>;
    })()}
    <style jsx>{`.field{background:#020617;border:1px solid #334155;border-radius:.5rem;padding:.6rem .75rem;color:#f8fafc;font-size:.8rem}.primary{background:#059669;border-radius:.5rem;padding:.65rem 1rem;color:white;font-size:.75rem;font-weight:700}.primary:disabled{opacity:.5}`}</style>
  </section>;
}
