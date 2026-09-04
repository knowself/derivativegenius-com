'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Circle, 
  Phone, 
  ExternalLink, 
  Plus, 
  RefreshCw, 
  Calendar, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  actionType: string;
  status: string;
  dueAt: string;
  completedAt?: string | null;
  notes?: string | null;
  prospectId?: string | null;
  prospectName?: string | null;
  prospectPhone?: string | null;
  prospectWebsiteUrl?: string | null;
  prospectCity?: string | null;
  prospectState?: string | null;
  prospectObservation?: string | null;
  prospectCommercialConsequence?: string | null;
}

interface ProspectOption {
  id: string;
  name: string;
  city?: string;
}

export default function CenturionTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prospects, setProspects] = useState<ProspectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'completed'>('open');
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formActionType, setFormActionType] = useState('call');
  const [formProspectId, setFormProspectId] = useState('');
  const [formDueDate, setFormDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/centurion/tasks');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load tasks');
      setTasks(data.tasks);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error loading tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProspects = useCallback(async () => {
    try {
      const res = await fetch('/api/centurion/prospects');
      const data = await res.json();
      if (res.ok && data.success) {
        setProspects(data.prospects.map((p: any) => ({ id: p.id, name: p.name, city: p.city })));
      }
    } catch {
      // Non-critical
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch('/api/centurion/tasks')
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load tasks');
          if (!cancelled) setTasks(data.tasks);
        }),
      fetch('/api/centurion/prospects')
        .then(async (res) => {
          const data = await res.json();
          if (res.ok && data.success && !cancelled) {
            setProspects(data.prospects.map((p: any) => ({ id: p.id, name: p.name, city: p.city })));
          }
        })
        .catch(() => {}),
    ])
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : 'Error loading tasks');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === 'open' ? 'completed' : 'open';
    try {
      const res = await fetch('/api/centurion/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update task');
      toast.success(nextStatus === 'completed' ? 'Task completed! 🎯' : 'Task reopened');
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus, completedAt: nextStatus === 'completed' ? new Date().toISOString() : null } : t));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating task');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/centurion/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          actionType: formActionType,
          prospectId: formProspectId || null,
          dueAt: new Date(formDueDate).toISOString(),
          notes: formNotes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create task');
      toast.success('New action item added to Centurion!');
      setFormTitle('');
      setFormNotes('');
      setShowAddForm(false);
      fetchTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error creating task');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'open') return t.status === 'open';
    if (filterStatus === 'completed') return t.status === 'completed';
    return true;
  });

  const getActionBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'audit': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'follow_up': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'research': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            Action Tracker & Tasks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track immediate outreach moves, rich audit data, and founder call scripts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add New Todo'}</span>
          </button>
          <button
            onClick={() => fetchTasks()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
            title="Refresh tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Task Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-6 space-y-4 backdrop-blur shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Add Immediate Action or Todo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Action Title / Next Move</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Call Right On Time Heating on Clearlake emergency AC page"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Action Type</label>
              <select
                value={formActionType}
                onChange={e => setFormActionType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="call">Call</option>
                <option value="audit">Website Audit</option>
                <option value="follow_up">Follow-up</option>
                <option value="research">Research / Intel</option>
                <option value="proposal">Proposal</option>
                <option value="general">General Todo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Link to Prospect (Optional)</label>
              <select
                value={formProspectId}
                onChange={e => setFormProspectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Unassigned / General --</option>
                {prospects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} {p.city ? `(${p.city})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Due Date</label>
              <input
                type="date"
                value={formDueDate}
                onChange={e => setFormDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Call Script / Opener / Research Notes</label>
            <textarea
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="Paste the 30-second call script, specific observed friction points, or notes..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {(['open', 'completed', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                filterStatus === tab
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'open' ? `Open (${tasks.filter(t => t.status === 'open').length})` : tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading action items...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <h3 className="text-base font-bold text-white">All caught up!</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {filterStatus === 'open'
              ? 'No pending action items. Add a new prospect task or load the next vertical batch.'
              : 'No completed tasks recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';
            const isExpanded = expandedTaskId === task.id;
            const hasDetails = task.notes || task.prospectObservation || task.prospectCommercialConsequence;

            return (
              <div
                key={task.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-lg ${
                  isCompleted 
                    ? 'border-slate-800/60 opacity-60 bg-slate-950/60' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/90'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
                    title={isCompleted ? 'Mark as Open' : 'Mark as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
                    )}
                  </button>

                  {/* Task Main Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${getActionBadgeColor(task.actionType)}`}>
                        {task.actionType}
                      </span>
                      {task.dueAt && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Due: {new Date(task.dueAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-bold text-white ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h3>

                    {/* Associated Prospect Cues */}
                    {task.prospectName && (
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <span className="font-semibold text-slate-200">
                          {task.prospectId ? (
                            <Link href={`/centurion/prospects/${task.prospectId}`} className="hover:text-emerald-400 hover:underline">
                              🏢 {task.prospectName}
                            </Link>
                          ) : (
                            `🏢 ${task.prospectName}`
                          )}
                        </span>

                        {task.prospectCity && (
                          <span className="text-slate-400">
                            📍 {task.prospectCity}, {task.prospectState || 'CA'}
                          </span>
                        )}

                        {task.prospectPhone && (
                          <a
                            href={`tel:${task.prospectPhone}`}
                            className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
                          >
                            <Phone className="w-3 h-3" /> {task.prospectPhone}
                          </a>
                        )}

                        {task.prospectWebsiteUrl && (
                          <a
                            href={task.prospectWebsiteUrl.startsWith('http') ? task.prospectWebsiteUrl : `https://${task.prospectWebsiteUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Website
                          </a>
                        )}
                      </div>
                    )}

                    {/* Rich Details Dropdown Toggle */}
                    {hasDetails && (
                      <div className="pt-2">
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide Rich Intel & Script' : 'View Audit Intel & Call Script'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                            {task.prospectObservation && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Observed Website Friction:</p>
                                <p className="text-sm text-slate-200 mt-0.5">{task.prospectObservation}</p>
                              </div>
                            )}

                            {task.prospectCommercialConsequence && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-400/90">Commercial Consequence:</p>
                                <p className="text-sm text-amber-200/90 mt-0.5">{task.prospectCommercialConsequence}</p>
                              </div>
                            )}

                            {task.notes && (
                              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" /> 30-Second Call Script / Action Notes:
                                </p>
                                <p className="text-sm text-emerald-200/90 mt-1 whitespace-pre-wrap leading-relaxed font-sans">
                                  {task.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
