'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Phone, PhoneCall, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface Prospect {
  id: string; name: string; industry?: string; score: number; websiteUrl?: string; phone?: string;
  city?: string; state?: string; status: string; nextAction?: string; nextActionAt?: string;
  websiteObservation?: string; commercialConsequence?: string;
}

const outcomes = [
  ['no_answer', 'No answer'], ['voicemail', 'Voicemail'], ['gatekeeper', 'Gatekeeper'],
  ['wrong_number', 'Wrong number'], ['decision_maker_reached', 'Decision-maker reached'],
  ['audit_requested', 'Audit requested'], ['meeting_booked', 'Meeting booked'],
  ['follow_up_requested', 'Follow-up requested'], ['not_interested', 'Not interested'],
  ['do_not_contact', 'Do not contact'], ['disqualified', 'Disqualified'],
] as const;

export default function QueuePage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingId, setLoggingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { outcome: string; notes: string; nextActionAt: string }>>({});

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/centurion/prospects?queue=true');
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to load queue');
      setProspects(data.prospects);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load daily queue');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/centurion/prospects?queue=true')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Unable to load queue');
        if (!cancelled) setProspects(data.prospects);
      })
      .catch((error: unknown) => {
        if (!cancelled) toast.error(error instanceof Error ? error.message : 'Failed to load daily queue');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const updateDraft = (id: string, field: 'outcome' | 'notes' | 'nextActionAt', value: string) => {
    setDrafts((current) => ({ ...current, [id]: { outcome: current[id]?.outcome ?? 'no_answer', notes: current[id]?.notes ?? '', nextActionAt: current[id]?.nextActionAt ?? '', [field]: value } }));
  };

  const logOutcome = async (prospect: Prospect) => {
    const draft = drafts[prospect.id] ?? { outcome: 'no_answer', notes: '', nextActionAt: '' };
    if (draft.outcome === 'follow_up_requested' && !draft.nextActionAt) {
      toast.error('Choose a follow-up date and time.'); return;
    }
    setLoggingId(prospect.id);
    try {
      const response = await fetch('/api/centurion/activities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId: prospect.id, type: 'call', outcome: draft.outcome,
          notes: draft.notes, nextAction: draft.nextActionAt ? 'Founder follow-up' : undefined,
          nextActionAt: draft.nextActionAt ? new Date(draft.nextActionAt).toISOString() : undefined }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to log outcome');
      toast.success(draft.outcome === 'do_not_contact' ? 'DNC recorded and suppressed.' : 'Outcome and next action recorded.');
      await fetchQueue();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Network error logging activity');
    } finally { setLoggingId(null); }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between gap-4">
        <div><h1 className="text-xl font-bold text-white flex items-center gap-2"><PhoneCall className="w-5 h-5 text-emerald-400" /> Founder-Led Daily Queue</h1>
          <p className="text-sm text-slate-400 mt-1">Overdue follow-ups first, then engaged conversations, then highest-scoring untouched prospects.</p></div>
        <button onClick={() => void fetchQueue()} className="px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-200 flex gap-2"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      {loading ? <p className="text-slate-500 text-sm py-10 text-center">Loading action queue…</p> : prospects.length === 0 ?
        <p className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400">No actionable prospects. Qualify the next batch.</p> :
        prospects.map((prospect) => {
          const draft = drafts[prospect.id] ?? { outcome: 'no_answer', notes: '', nextActionAt: '' };
          return <article key={prospect.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div><div className="flex items-center gap-3"><Link href={`/centurion/prospects/${prospect.id}`} className="font-bold text-white hover:text-emerald-400">{prospect.name}</Link><span className="text-xs font-bold text-emerald-400">{prospect.score} pts</span></div>
                <p className="text-xs text-slate-400 mt-1">{prospect.industry || 'Service business'} · {prospect.city || 'Unknown city'}, {prospect.state || '—'} · {prospect.status}</p>
                {prospect.websiteObservation && <p className="text-sm text-slate-300 mt-2">Observed: {prospect.websiteObservation}</p>}
                {prospect.commercialConsequence && <p className="text-sm text-amber-300/80">Why it matters: {prospect.commercialConsequence}</p>}</div>
              <div className="flex gap-2">{prospect.phone && <a href={`tel:${prospect.phone}`} className="px-3 py-2 bg-emerald-600 rounded-lg text-xs font-bold flex gap-2"><Phone className="w-4 h-4" /> {prospect.phone}</a>}
                {prospect.websiteUrl && <a href={prospect.websiteUrl.startsWith('http') ? prospect.websiteUrl : `https://${prospect.websiteUrl}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-slate-800 rounded-lg text-xs flex gap-2">Site <ExternalLink className="w-4 h-4" /></a>}</div>
            </div>
            {prospect.nextActionAt && <div className="text-xs text-amber-300">Due: {new Date(prospect.nextActionAt).toLocaleString()} · {prospect.nextAction}</div>}
            <div className="grid md:grid-cols-[1fr_1.4fr_1fr_auto] gap-2 border-t border-slate-800 pt-4">
              <select value={draft.outcome} onChange={(event) => updateDraft(prospect.id, 'outcome', event.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                {outcomes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
              <input value={draft.notes} onChange={(event) => updateDraft(prospect.id, 'notes', event.target.value)} placeholder="Call notes / objection / exact language" className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
              <input type="datetime-local" value={draft.nextActionAt} onChange={(event) => updateDraft(prospect.id, 'nextActionAt', event.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
              <button disabled={loggingId === prospect.id} onClick={() => void logOutcome(prospect)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1">
                {draft.outcome === 'do_not_contact' && <ShieldAlert className="w-4 h-4" />} Record
              </button>
            </div>
          </article>;
        })}
    </div>
  );
}
