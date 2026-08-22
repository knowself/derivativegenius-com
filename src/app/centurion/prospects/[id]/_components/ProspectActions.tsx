'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProspectEvidence {
  id: string; industry: string | null; websiteUrl: string | null; phone: string | null; address: string | null;
  city: string | null; state: string | null; zip: string | null; googleRating: string | null; reviewCount: number | null;
  hasHighCustomerValue: boolean; hasWeakOrOutdatedWebsite: boolean; hasDecisionMakerRoute: boolean;
  hasMultipleEmployeesOrLocations: boolean; hasActiveAdsOrSocial: boolean; hasWeakBookingWorkflow: boolean;
  hasRecentGrowthTrigger: boolean; websiteObservation: string | null; commercialConsequence: string | null;
  sourceUrl: string | null; notes: string | null;
}

const flags = [
  ['hasHighCustomerValue', 'Customer value above $1,000'], ['hasWeakOrOutdatedWebsite', 'Specific website weakness observed'],
  ['hasDecisionMakerRoute', 'Decision-maker route confirmed'], ['hasMultipleEmployeesOrLocations', 'Multiple employees or locations'],
  ['hasActiveAdsOrSocial', 'Active ads or social'], ['hasWeakBookingWorkflow', 'Weak quote / booking workflow'],
  ['hasRecentGrowthTrigger', 'Recent growth trigger'],
] as const;

export default function ProspectActions({ prospect, opportunityId }: { prospect: ProspectEvidence; opportunityId?: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState('');
  const [evidence, setEvidence] = useState(prospect);
  const [contact, setContact] = useState({ fullName: '', roleTitle: '', email: '', phone: '', isVerified: true });
  const [audit, setAudit] = useState({ targetOutcome: 'Increase qualified quote requests', findings: '', scoreSummary: '', proposalRange: '$2,000–$5,000' });
  const [deal, setDeal] = useState({ stage: 'qualified', estimatedValue: '3500', probabilityPercent: '20', packageName: 'Conversion website sprint', nextAction: 'Schedule discovery', nextActionAt: '' });

  const send = async (key: string, url: string, body: object, method = 'POST') => {
    setSaving(key);
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || `Unable to save ${key}`);
      toast.success(`${key} saved`); router.refresh(); return true;
    } catch (error) { toast.error(error instanceof Error ? error.message : `Unable to save ${key}`); return false; }
    finally { setSaving(''); }
  };

  return <div className="grid lg:grid-cols-2 gap-5">
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div><h2 className="font-semibold text-white">Human-confirmed qualification</h2><p className="text-xs text-slate-400">Save only facts Joe has personally verified. This recalculates the score.</p></div>
      <div className="grid sm:grid-cols-2 gap-2">{flags.map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 rounded p-2"><input type="checkbox" checked={evidence[key]} onChange={(event) => setEvidence({ ...evidence, [key]: event.target.checked })} /> {label}</label>)}</div>
      <div className="grid sm:grid-cols-2 gap-2"><input type="number" value={evidence.reviewCount ?? 0} onChange={(event) => setEvidence({ ...evidence, reviewCount: Number(event.target.value) })} placeholder="Google reviews" className="field" /><input value={evidence.sourceUrl ?? ''} onChange={(event) => setEvidence({ ...evidence, sourceUrl: event.target.value })} placeholder="Evidence source URL" className="field" /></div>
      <textarea value={evidence.websiteObservation ?? ''} onChange={(event) => setEvidence({ ...evidence, websiteObservation: event.target.value })} placeholder="Specific website observation" className="field w-full" />
      <textarea value={evidence.commercialConsequence ?? ''} onChange={(event) => setEvidence({ ...evidence, commercialConsequence: event.target.value })} placeholder="Likely commercial consequence" className="field w-full" />
      <textarea value={evidence.notes ?? ''} onChange={(event) => setEvidence({ ...evidence, notes: event.target.value })} placeholder="Research notes" className="field w-full" />
      <button disabled={saving === 'qualification'} onClick={() => void send('qualification', `/api/centurion/prospects/${prospect.id}`, evidence, 'PATCH')} className="primary">Confirm evidence and rescore</button>
    </section>

    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <div><h2 className="font-semibold text-white">Decision-maker contact</h2><p className="text-xs text-slate-400">Record provenance and verification; never guess a private number.</p></div>
      <div className="grid sm:grid-cols-2 gap-2"><input value={contact.fullName} onChange={(event) => setContact({ ...contact, fullName: event.target.value })} placeholder="Full name" className="field" /><input value={contact.roleTitle} onChange={(event) => setContact({ ...contact, roleTitle: event.target.value })} placeholder="Role / title" className="field" /><input value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="Business email" className="field" /><input value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} placeholder="Business phone" className="field" /></div>
      <label className="flex gap-2 text-xs text-slate-300"><input type="checkbox" checked={contact.isVerified} onChange={(event) => setContact({ ...contact, isVerified: event.target.checked })} /> Verified from a public business source</label>
      <button disabled={saving === 'contact'} onClick={async () => { if (await send('contact', `/api/centurion/prospects/${prospect.id}/contacts`, contact)) setContact({ fullName: '', roleTitle: '', email: '', phone: '', isVerified: true }); }} className="primary">Add contact</button>
    </section>

    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <div><h2 className="font-semibold text-white">Website audit</h2><p className="text-xs text-slate-400">Findings are stored as a reviewable draft before anything is sent.</p></div>
      <input value={audit.targetOutcome} onChange={(event) => setAudit({ ...audit, targetOutcome: event.target.value })} className="field w-full" />
      <textarea value={audit.findings} onChange={(event) => setAudit({ ...audit, findings: event.target.value })} placeholder="One finding per line" className="field w-full" />
      <div className="grid sm:grid-cols-2 gap-2"><input value={audit.scoreSummary} onChange={(event) => setAudit({ ...audit, scoreSummary: event.target.value })} placeholder="Audit summary" className="field" /><input value={audit.proposalRange} onChange={(event) => setAudit({ ...audit, proposalRange: event.target.value })} className="field" /></div>
      <button disabled={saving === 'audit'} onClick={() => void send('audit', '/api/centurion/audits', { prospectId: prospect.id, ...audit, findings: audit.findings.split('\n').filter(Boolean) })} className="primary">Create audit draft</button>
    </section>

    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <div><h2 className="font-semibold text-white">Opportunity</h2><p className="text-xs text-slate-400">Pipeline value comes from this record—not a lead-count estimate.</p></div>
      <div className="grid sm:grid-cols-2 gap-2"><select value={deal.stage} onChange={(event) => setDeal({ ...deal, stage: event.target.value })} className="field"><option>qualified</option><option>discovery_scheduled</option><option>audit_accepted</option><option>proposal_sent</option><option>closed_won</option><option>closed_lost</option></select><input type="number" value={deal.estimatedValue} onChange={(event) => setDeal({ ...deal, estimatedValue: event.target.value })} className="field" /><input type="number" value={deal.probabilityPercent} onChange={(event) => setDeal({ ...deal, probabilityPercent: event.target.value })} className="field" /><input value={deal.packageName} onChange={(event) => setDeal({ ...deal, packageName: event.target.value })} className="field" /></div>
      <input value={deal.nextAction} onChange={(event) => setDeal({ ...deal, nextAction: event.target.value })} placeholder="Next action" className="field w-full" /><input type="datetime-local" value={deal.nextActionAt} onChange={(event) => setDeal({ ...deal, nextActionAt: event.target.value })} className="field w-full" />
      <button disabled={saving === 'opportunity'} onClick={() => void send('opportunity', '/api/centurion/pipeline', { id: opportunityId, prospectId: prospect.id, ...deal, estimatedValue: Number(deal.estimatedValue), probabilityPercent: Number(deal.probabilityPercent), nextActionAt: deal.nextActionAt ? new Date(deal.nextActionAt).toISOString() : undefined })} className="primary">Save opportunity</button>
    </section>
    <style jsx>{`.field{background:#020617;border:1px solid #334155;border-radius:.5rem;padding:.6rem .75rem;color:#f8fafc;font-size:.8rem}.primary{background:#059669;border-radius:.5rem;padding:.65rem 1rem;color:white;font-size:.75rem;font-weight:700}.primary:disabled{opacity:.5}`}</style>
  </div>;
}
