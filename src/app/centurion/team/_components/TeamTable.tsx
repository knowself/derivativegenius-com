'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { TeamUser } from '../page';

const ROLES = [
  { value: 'viewer', label: 'Viewer (no dashboard)' },
  { value: 'prospector', label: 'Prospector (research + calls + closing)' },
  { value: 'customer', label: 'Customer (portal)' },
  { value: 'centurion_admin', label: 'Centurion admin (root)' },
];

export default function TeamTable({ initialUsers }: { initialUsers: TeamUser[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const save = async (user: TeamUser) => {
    const role = drafts[user.id] ?? user.role;
    if (role === user.role) {
      toast.info('Role unchanged');
      return;
    }
    setSavingId(user.id);
    try {
      const response = await fetch('/api/centurion/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to set role');
      toast.success(`Role set to ${role}. They must sign out and back in.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to set role');
    } finally {
      setSavingId(null);
    }
  };

  if (initialUsers.length === 0) {
    return <p className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-sm text-slate-500">No users have signed up yet.</p>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
          <tr>
            <th className="p-3.5">User</th>
            <th className="p-3.5">Email</th>
            <th className="p-3.5">Current role</th>
            <th className="p-3.5">Set role</th>
            <th className="p-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {initialUsers.map((user) => (
            <tr key={user.id} className="border-b border-slate-800/60 last:border-0">
              <td className="p-3.5">
                <span className="font-mono text-slate-200">{user.username ?? '(no username)'}</span>
                {user.isSelf && <span className="ml-2 text-[10px] font-semibold text-emerald-400 uppercase">you</span>}
              </td>
              <td className="p-3.5 text-slate-400">{user.email ?? '—'}</td>
              <td className="p-3.5 capitalize">{user.role.replace('_', ' ')}</td>
              <td className="p-3.5">
                <select
                  value={drafts[user.id] ?? user.role}
                  onChange={(event) => setDrafts((current) => ({ ...current, [user.id]: event.target.value }))}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </td>
              <td className="p-3.5 text-right">
                <button
                  disabled={savingId === user.id}
                  onClick={() => void save(user)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
