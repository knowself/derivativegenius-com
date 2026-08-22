'use client';

import React, { useState, useEffect } from 'react';
import { Target, Plus, Building2, MapPin, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  industry: string;
  targetState?: string;
  targetCities?: string;
  minimumReviewCount: number;
  minimumRating: string;
  status: string;
  offerSummary?: string;
  projectPriceMin?: number;
  projectPriceMax?: number;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('HVAC');
  const [targetState, setTargetState] = useState('TX');
  const [targetCities, setTargetCities] = useState('Austin, Round Rock, Cedar Park');
  const [minimumReviewCount, setMinimumReviewCount] = useState(15);
  const [offerSummary, setOfferSummary] = useState('Conversion-focused website sprint for established local service businesses');
  const [projectPriceMin, setProjectPriceMin] = useState(2000);
  const [projectPriceMax, setProjectPriceMax] = useState(5000);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/centurion/campaigns');
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch {
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/centurion/campaigns').then((response) => response.json()).then((data) => {
      if (!cancelled && data.success) setCampaigns(data.campaigns);
    }).catch(() => { if (!cancelled) toast.error('Failed to fetch campaigns'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    setCreating(true);

    const citiesList = targetCities.split(',').map(c => c.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/centurion/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          industry,
          targetState,
          targetCities: citiesList,
          minimumReviewCount,
          offerSummary,
          projectPriceMin,
          projectPriceMax,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Campaign created successfully');
        setShowModal(false);
        setName('');
        fetchCampaigns();
      } else {
        toast.error(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      toast.error('Network error creating campaign');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Target Market Campaigns
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize target verticals and geographic boundaries across approved research cities.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No Campaigns Defined Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Create your first market campaign to target a vertical across five focused cities.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition"
          >
            Create Initial Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(camp => {
            const cities = camp.targetCities ? JSON.parse(camp.targetCities) : [];
            return (
              <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{camp.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {camp.industry}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                    {camp.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>State: {camp.targetState || 'All'}</span>
                  </div>
                  <p className="pt-1 text-slate-300">{camp.offerSummary || 'Offer not recorded'}</p>
                  <p className="text-emerald-400">${(camp.projectPriceMin ?? 2000).toLocaleString()}–${(camp.projectPriceMax ?? 5000).toLocaleString()}</p>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Target Cities: {cities.length > 0 ? cities.join(', ') : 'None specified'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Min Google Reviews: {camp.minimumReviewCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Create Target Campaign</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Austin HVAC Q3 Pilot"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Industry Vertical</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="HVAC">HVAC</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical Contracting</option>
                  <option value="Dental">Dental Practices</option>
                  <option value="Law Firm">Law Firms</option>
                  <option value="Commercial Cleaning">Commercial Cleaning</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target State</label>
                <input
                  type="text"
                  value={targetState}
                  onChange={e => setTargetState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Cities (Comma separated)</label>
                <input
                  type="text"
                  value={targetCities}
                  onChange={e => setTargetCities(e.target.value)}
                  placeholder="Austin, Round Rock, Cedar Park"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Minimum Google Reviews</label>
                <input
                  type="number"
                  value={minimumReviewCount}
                  onChange={e => setMinimumReviewCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pilot Offer</label>
                <textarea value={offerSummary} onChange={e => setOfferSummary(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-medium text-slate-300 mb-1">Minimum Price</label><input type="number" value={projectPriceMin} onChange={e => setProjectPriceMin(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" /></div>
                <div><label className="block text-xs font-medium text-slate-300 mb-1">Maximum Price</label><input type="number" value={projectPriceMax} onChange={e => setProjectPriceMax(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white" /></div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
