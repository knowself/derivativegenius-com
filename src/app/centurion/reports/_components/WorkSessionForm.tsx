'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function WorkSessionForm({ campaigns }: { campaigns: { id: string; name: string }[] }) {
  const router = useRouter(); const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? ''); const [workType, setWorkType] = useState('outreach'); const [durationMinutes, setDurationMinutes] = useState('60'); const [notes, setNotes] = useState(''); const [saving, setSaving] = useState(false);
  return <form onSubmit={async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const response = await fetch('/api/centurion/work-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId, workType, durationMinutes: Number(durationMinutes), notes }) });
      const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || 'Unable to record work session');
      toast.success('Founder work session recorded'); setNotes(''); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to record work session'); }
    finally { setSaving(false); }
  }} className="grid md:grid-cols-[1fr_10rem_7rem_1fr_auto] gap-2">
    <select value={campaignId} onChange={(event) => setCampaignId(event.target.value)} className="field"><option value="">Campaign</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select>
    <select value={workType} onChange={(event) => setWorkType(event.target.value)} className="field"><option>research</option><option>outreach</option><option>follow_up</option><option>audit</option><option>proposal</option></select>
    <input type="number" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} className="field" min="1" />
    <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What was completed?" className="field" />
    <button disabled={saving || !campaignId} className="bg-emerald-700 rounded px-4 py-2 text-xs font-bold disabled:opacity-50">Record</button>
    <style jsx>{`.field{background:#020617;border:1px solid #334155;border-radius:.5rem;padding:.55rem .7rem;color:#f8fafc;font-size:.75rem}`}</style>
  </form>;
}
