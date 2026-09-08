'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProspectAuditActions({ prospectId }: { prospectId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState('');
  const [audit, setAudit] = useState({ targetOutcome: 'Increase qualified quote requests', findings: '', scoreSummary: '', proposalRange: '$2,000–$5,000' });

  const send = async (key: string, url: string, body: object, method = 'POST') => {
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
      toast.success(`${key} saved`); router.refresh(); return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : `Unable to save ${key}`); return false; }
    finally { setSaving(''); }
  };

  return <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
    <div><h2 className="font-semibold text-white">Website audit</h2><p className="text-xs text-slate-400">Machine-run checks save as a reviewable draft; hand-typed findings save the same way. Nothing is ever sent from here.</p></div>
    <button disabled={saving === 'agent audit'} onClick={() => void send('agent audit', `/api/centurion/prospects/${prospectId}/agent-audit`, {})} className="primary w-full">{saving === 'agent audit' ? 'Running audit… (~20s, do not close)' : 'Run audit (live Eve agent when configured, else static checks)'}</button>
    <input value={audit.targetOutcome} onChange={(event) => setAudit({ ...audit, targetOutcome: event.target.value })} className="field w-full" />
    <textarea value={audit.findings} onChange={(event) => setAudit({ ...audit, findings: event.target.value })} placeholder="One finding per line (leave empty to auto-run machine checks)" className="field w-full" />
    <div className="grid sm:grid-cols-2 gap-2"><input value={audit.scoreSummary} onChange={(event) => setAudit({ ...audit, scoreSummary: event.target.value })} placeholder="Audit summary" className="field" /><input value={audit.proposalRange} onChange={(event) => setAudit({ ...audit, proposalRange: event.target.value })} className="field" /></div>
    <button disabled={saving === 'audit' || saving === 'agent audit'} onClick={() => {
      const typed = audit.findings.split('\n').map((line) => line.trim()).filter(Boolean);
      if (typed.length === 0) {
        // No hand-typed findings — run the deterministic machine checks instead,
        // which always produce at least one evidence-cited draft finding.
        return void send('agent audit', `/api/centurion/prospects/${prospectId}/agent-audit`, {});
      }
      return void send('audit', '/api/centurion/audits', { prospectId, ...audit, findings: typed });
    }} className="primary">{saving === 'agent audit' ? 'Running machine audit…' : saving === 'audit' ? 'Saving…' : 'Create audit draft'}</button>
    <style jsx>{`.field{background:#020617;border:1px solid #334155;border-radius:.5rem;padding:.6rem .75rem;color:#f8fafc;font-size:.8rem}.primary{background:#059669;border-radius:.5rem;padding:.65rem 1rem;color:white;font-size:.75rem;font-weight:700}.primary:disabled{opacity:.5}`}</style>
  </section>;
}
