'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PipelineActions({ opportunityId, canHandoff }: { opportunityId: string; canHandoff: boolean }) {
  const router = useRouter(); const [amount, setAmount] = useState('3500'); const [scope, setScope] = useState('Conversion-focused website sprint'); const [saving, setSaving] = useState(false);
  const submit = async (kind: 'proposal' | 'handoff') => {
    setSaving(true);
    try {
      const response = await fetch('/api/centurion/pipeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(kind === 'proposal' ? { kind, opportunityId, scopeSummary: scope, amount: Number(amount), status: 'draft' } : { kind, opportunityId, scopeSummary: scope }) });
      const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || `Unable to create ${kind}`);
      toast.success(`${kind} created`); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : `Unable to create ${kind}`); }
    finally { setSaving(false); }
  };
  return <div className="grid sm:grid-cols-[1fr_8rem_auto_auto] gap-2 mt-3"><input value={scope} onChange={(event) => setScope(event.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs" /><input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs" /><button disabled={saving} onClick={() => void submit('proposal')} className="bg-emerald-700 rounded px-3 py-1 text-xs">Draft proposal</button>{canHandoff && <button disabled={saving} onClick={() => void submit('handoff')} className="bg-blue-700 rounded px-3 py-1 text-xs">Create handoff</button>}</div>;
}
