'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Plus,
  RefreshCw,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Calendar,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'subscribed' | 'unsubscribed';
  createdAt: string;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');

  // Modal & Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('centurion_manual');
  const [creating, setCreating] = useState(false);

  // Copy tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSubscribers = async (showToast = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/centurion/newsletter');
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
        if (showToast) toast.success('Subscribers refreshed');
      } else {
        toast.error(data.error || 'Failed to load subscribers');
      }
    } catch {
      toast.error('Network error fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/centurion/newsletter')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setSubscribers(data.subscribers || []);
          setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
        } else if (!cancelled && data.error) {
          toast.error(data.error);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Network error fetching subscribers');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const nextStatus = subscriber.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
    // Optimistic update
    setSubscribers((prev) =>
      prev.map((s) => (s.id === subscriber.id ? { ...s, status: nextStatus } : s)),
    );
    setStats((prev) => ({
      ...prev,
      active: nextStatus === 'subscribed' ? prev.active + 1 : prev.active - 1,
      unsubscribed: nextStatus === 'unsubscribed' ? prev.unsubscribed + 1 : prev.unsubscribed - 1,
    }));

    try {
      const res = await fetch('/api/centurion/newsletter', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subscriber.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Marked ${subscriber.email} as ${nextStatus === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}`,
        );
      } else {
        toast.error(data.error || 'Failed to update subscriber');
        fetchSubscribers(); // Revert
      }
    } catch {
      toast.error('Network error updating status');
      fetchSubscribers(); // Revert
    }
  };

  const handleDelete = async (subscriber: Subscriber) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${subscriber.email}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/centurion/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subscriber.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Removed ${subscriber.email}`);
        setSubscribers((prev) => prev.filter((s) => s.id !== subscriber.id));
        setStats((prev) => ({
          total: prev.total - 1,
          active: subscriber.status === 'subscribed' ? prev.active - 1 : prev.active,
          unsubscribed: subscriber.status === 'unsubscribed' ? prev.unsubscribed - 1 : prev.unsubscribed,
        }));
      } else {
        toast.error(data.error || 'Failed to delete subscriber');
      }
    } catch {
      toast.error('Network error deleting subscriber');
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/centurion/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          source: newSource.trim() || 'centurion_manual',
          status: 'subscribed',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Subscribed ${data.subscriber.email}`);
        setNewEmail('');
        setShowAddModal(false);
        fetchSubscribers();
      } else {
        toast.error(data.error || 'Failed to add subscriber');
      }
    } catch {
      toast.error('Network error adding subscriber');
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      const matchesSearch =
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Mail className="w-4 h-4" /> Audience & Lead Captures
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Subscriptions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audience records collected from the website newsletter form and outreach pipelines.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fetchSubscribers(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            title="Refresh subscriber list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/api/centurion/newsletter/export"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Subscribers</p>
            <p className="text-2xl font-bold text-white mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Subscribed</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">{stats.active}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unsubscribed</p>
            <p className="text-2xl font-bold text-slate-300 mt-0.5">{stats.unsubscribed}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by email or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({subscribers.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('subscribed')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              statusFilter === 'subscribed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscribed ({stats.active})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('unsubscribed')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              statusFilter === 'unsubscribed'
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unsubscribed ({stats.unsubscribed})
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Subscriber Email</th>
                <th className="px-6 py-3.5 font-semibold">Source</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold">Date Joined</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
                    Loading subscriber records...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="text-base font-semibold text-slate-300">No subscribers found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try clearing your search query or status filter.'
                        : 'New newsletter opt-ins will appear here automatically.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => {
                  const isSubscribed = subscriber.status === 'subscribed';
                  const formattedDate = subscriber.createdAt
                    ? new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Unknown';

                  return (
                    <tr key={subscriber.id} className="hover:bg-slate-800/40 transition">
                      {/* Email */}
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{subscriber.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(subscriber.email, subscriber.id)}
                            className="text-slate-500 hover:text-slate-300 transition"
                            title="Copy email"
                          >
                            {copiedId === subscriber.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={`mailto:${subscriber.email}`}
                            className="text-slate-500 hover:text-blue-400 transition"
                            title="Send email"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {subscriber.source || 'website'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {isSubscribed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Subscribed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            Unsubscribed
                          </span>
                        )}
                      </td>

                      {/* Date Joined */}
                      <td className="px-6 py-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(subscriber)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                              isSubscribed
                                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                            }`}
                            title={isSubscribed ? 'Mark as Unsubscribed' : 'Mark as Subscribed'}
                          >
                            {isSubscribed ? (
                              <>
                                <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Unsubscribe</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                                <span>Resubscribe</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(subscriber)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                            title="Delete subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Add Newsletter Subscriber</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subscriber Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@business.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Source / Origin Tag
                </label>
                <input
                  type="text"
                  placeholder="centurion_manual"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Examples: centurion_manual, direct_client, event_meetup
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newEmail.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Subscriber'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
