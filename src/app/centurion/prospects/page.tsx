'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Phone, ExternalLink, Star, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface Prospect {
  id: string;
  name: string;
  industry?: string;
  status: string;
  qualificationStatus: string;
  score: number;
  websiteUrl?: string;
  phone?: string;
  city?: string;
  state?: string;
  googleRating?: string;
  reviewCount?: number;
  createdAt: string;
}

export default function ProspectsPage({ base = '/centurion', showImportCta = true }: { base?: string; showImportCta?: boolean }) {
  const router = useRouter();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    websiteUrl: '',
    campaignId: '',
    industry: '',
    city: '',
    state: '',
    phone: '',
  });

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (qualificationFilter) params.set('qualification', qualificationFilter);

      const res = await fetch(`/api/centurion/prospects?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProspects(data.prospects);
      }
    } catch (err) {
      toast.error('Failed to load prospects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (qualificationFilter) params.set('qualification', qualificationFilter);
    fetch(`/api/centurion/prospects?${params.toString()}`).then((response) => response.json()).then((data) => {
      if (!cancelled && data.success) setProspects(data.prospects);
    }).catch(() => { if (!cancelled) toast.error('Failed to load prospects'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    fetch('/api/centurion/campaigns').then((response) => response.json()).then((data) => {
      if (!cancelled && data.success) {
        setCampaigns(data.campaigns);
        setForm((f) => ({
          ...f,
          campaignId: f.campaignId || data.campaigns.find((c: Campaign) => c.status === 'active')?.id || '',
        }));
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [qualificationFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProspects();
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.websiteUrl.trim()) {
      toast.error('Name and website are required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/centurion/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          websiteUrl: form.websiteUrl.trim(),
          campaignId: form.campaignId || undefined,
          industry: form.industry || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.existingProspectId) {
        toast.error('Prospect already exists — opening it');
        router.push(`${base}/prospects/${data.existingProspectId}`);
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.error || 'Unable to create prospect');
      toast.success('Prospect created');
      setShowCreate(false);
      setForm({ name: '', websiteUrl: '', campaignId: form.campaignId, industry: '', city: '', state: '', phone: '' });
      fetchProspects();
      router.push(`${base}/prospects/${data.prospect.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to create prospect');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Prospect Database
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search and inspect discovered businesses, transparent v1.0 lead scores, and call availability.
          </p>
        </div>
        {showImportCta && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> New Prospect
          </button>
          <Link
            href="/centurion/import"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
          >
            + Import New Prospects
          </Link>
        </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search business name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={qualificationFilter}
            onChange={e => setQualificationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
          >
            <option value="">All Qualification Statuses</option>
            <option value="priority">Priority (75+)</option>
            <option value="qualified">Qualified (60-74)</option>
            <option value="research">Research (40-59)</option>
            <option value="excluded">Excluded / Disqualified</option>
          </select>
        </div>
      </div>

      {/* Prospect Datagrid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading prospect records...
        </div>
      ) : prospects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Prospects Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Try adjusting your search query or qualification filter{showImportCta ? ', or import new prospects via CSV.' : '.'}
          </p>
          {showImportCta && (
          <Link
            href="/centurion/import"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition"
          >
            Import CSV File
          </Link>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Score</th>
                <th className="p-3.5">Business Name</th>
                <th className="p-3.5">Industry / City</th>
                <th className="p-3.5">Google Reviews</th>
                <th className="p-3.5">Contact Line</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {prospects.map(p => {
                let badgeStyle = 'bg-slate-800 text-slate-300';
                if (p.qualificationStatus === 'priority') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                else if (p.qualificationStatus === 'qualified') badgeStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                else if (p.qualificationStatus === 'excluded' || p.status === 'disqualified') badgeStyle = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded font-bold text-xs ${badgeStyle}`}>
                        {p.score} pts
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-white text-sm">{p.name}</div>
                      {p.websiteUrl && (
                        <a
                          href={p.websiteUrl.startsWith('http') ? p.websiteUrl : `https://${p.websiteUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 mt-0.5 truncate max-w-[200px]"
                        >
                          {p.websiteUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div>{p.industry || 'Service'}</div>
                      <div className="text-slate-500">{p.city ? `${p.city}, ${p.state || ''}` : 'Location n/a'}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.googleRating || 'N/A'}</span>
                        <span className="text-slate-500">({p.reviewCount || 0})</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {p.phone ? (
                        <a
                          href={`tel:${p.phone}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium transition"
                        >
                          <Phone className="w-3 h-3" /> {p.phone}
                        </a>
                      ) : (
                        <span className="text-slate-500">No phone</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <Link
                        href={`${base}/prospects/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium text-xs transition"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">New Prospect</h2>
            <p className="text-xs text-slate-400">Just name + website — enough to run an audit.</p>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Business name *</label>
                <input value={form.name} onChange={set('name')} placeholder="Derivative Genius" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Website URL *</label>
                <input value={form.websiteUrl} onChange={set('websiteUrl')} placeholder="https://derivativegenius.com" required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campaign</label>
                <select value={form.campaignId} onChange={set('campaignId')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
                  <option value="">No campaign</option>
                  {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                  <input value={form.industry} onChange={set('industry')} placeholder="Web Development"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <input value={form.phone} onChange={set('phone')} placeholder="(512) 555-0100"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input value={form.city} onChange={set('city')} placeholder="Austin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input value={form.state} onChange={set('state')} placeholder="TX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium disabled:opacity-50">
                  {creating ? 'Creating…' : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
