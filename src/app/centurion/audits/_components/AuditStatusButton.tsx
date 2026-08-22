'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AuditStatusButton({ id, status }: { id: string; status: 'internal_review' | 'approved' | 'sent' }) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  return <button disabled={saving} onClick={async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/centurion/audits', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.error || 'Unable to update audit');
      toast.success(`Audit marked ${status.replace('_', ' ')}`); router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update audit'); }
    finally { setSaving(false); }
  }} className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs disabled:opacity-50">{status.replace('_', ' ')}</button>;
}
