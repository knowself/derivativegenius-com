'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileUp, RefreshCw, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { csvBoolean, parseCsv } from '@/lib/prospecting/csv';

interface Campaign { id: string; name: string; status: string }
interface ImportSummary { total: number; imported: number; duplicates: number; suppressed: number }

const sample = `Name,Website,Phone,City,State,Zip,Industry,Reviews,HighValue,WeakWebsite,DecisionMakerRoute,MultipleLocations,ActiveMarketing,WeakBooking,GrowthTrigger,Observation,CommercialConsequence,SourceURL
Example HVAC,https://example.com,512-555-0100,Austin,TX,78701,HVAC,42,yes,yes,yes,no,yes,yes,no,"Quote form fails on mobile","Mobile visitors cannot request service",https://example.com/request-service`;

const fieldByHeader: Record<string, string> = {
  name: 'name', website: 'websiteUrl', websiteurl: 'websiteUrl', phone: 'phone', address: 'address',
  city: 'city', state: 'state', zip: 'zip', industry: 'industry', reviews: 'reviewCount', reviewcount: 'reviewCount',
  highvalue: 'hasHighCustomerValue', weakwebsite: 'hasWeakOrOutdatedWebsite', decisionmakerroute: 'hasDecisionMakerRoute',
  multiplelocations: 'hasMultipleEmployeesOrLocations', activemarketing: 'hasActiveAdsOrSocial', weakbooking: 'hasWeakBookingWorkflow',
  growthtrigger: 'hasRecentGrowthTrigger', observation: 'websiteObservation', commercialconsequence: 'commercialConsequence', sourceurl: 'sourceUrl',
};
const booleanFields = new Set(['hasHighCustomerValue', 'hasWeakOrOutdatedWebsite', 'hasDecisionMakerRoute', 'hasMultipleEmployeesOrLocations', 'hasActiveAdsOrSocial', 'hasWeakBookingWorkflow', 'hasRecentGrowthTrigger']);

function recordsFromCsv(text: string): Record<string, string | number | boolean>[] {
  const [headerRow, ...rows] = parseCsv(text);
  if (!headerRow) return [];
  const fields = headerRow.map((header) => fieldByHeader[header.toLowerCase().replace(/[\s_-]/g, '')]);
  return rows.map((row) => {
    const record: Record<string, string | number | boolean> = {};
    fields.forEach((field, index) => {
      if (!field) return;
      const value = row[index] ?? '';
      record[field] = field === 'reviewCount' ? Number.parseInt(value, 10) || 0 : booleanFields.has(field) ? csvBoolean(value) : value;
    });
    return record;
  }).filter((record) => typeof record.name === 'string' && record.name.trim().length > 0);
}

export default function ImportPage() {
  const [csvText, setCsvText] = useState(sample);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState('');
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/centurion/campaigns').then((response) => response.json()).then((data) => {
      if (!cancelled && data.success) {
        setCampaigns(data.campaigns);
        setCampaignId(data.campaigns.find((campaign: Campaign) => campaign.status === 'active')?.id ?? '');
      }
    }).catch(() => { if (!cancelled) toast.error('Unable to load campaigns'); });
    return () => { cancelled = true; };
  }, []);

  const handleImport = async (event: React.FormEvent) => {
    event.preventDefault();
    const records = recordsFromCsv(csvText);
    if (!campaignId) { toast.error('Choose or create the pilot campaign first.'); return; }
    if (records.length === 0) { toast.error('No valid company rows found.'); return; }
    setImporting(true); setSummary(null);
    try {
      const response = await fetch('/api/centurion/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignId, records }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Import failed');
      setSummary(data.summary); toast.success(`${data.summary.imported} prospects imported with confirmed evidence.`);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Import failed'); }
    finally { setImporting(false); }
  };

  return <div className="space-y-6 max-w-5xl mx-auto">
    <header className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h1 className="text-xl font-bold text-white flex items-center gap-2"><FileUp className="w-5 h-5 text-emerald-400" /> 25-Company Evidence Import</h1>
      <p className="text-sm text-slate-400 mt-1">Every scoring flag must be explicitly supported by founder research. Blank values score zero; nothing is inferred.</p>
    </header>
    <form onSubmit={handleImport} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div><label className="block text-xs font-semibold text-slate-300 mb-2">Pilot campaign</label>
        <select value={campaignId} onChange={(event) => setCampaignId(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Select a campaign</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
        </select>{campaigns.length === 0 && <p className="text-xs text-amber-300 mt-2">No campaigns yet. <Link href="/centurion/campaigns" className="underline">Create the 25-company pilot campaign.</Link></p>}
      </div>
      <div><label className="block text-xs font-semibold text-slate-300 mb-2">CSV with source evidence and commercial consequence</label>
        <textarea rows={12} value={csvText} onChange={(event) => setCsvText(event.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:border-emerald-500 outline-none" />
      </div>
      <div className="flex items-center justify-between gap-4"><p className="text-xs text-slate-500">Quote fields containing commas. Affirmative flags accept yes, true, y, or 1.</p>
        <button disabled={importing} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 rounded-lg text-sm font-medium disabled:opacity-50">{importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} Import researched batch</button></div>
    </form>
    {summary && <section className="grid grid-cols-4 gap-3">{Object.entries(summary).map(([label, value]) => <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg p-4"><p className="text-xs capitalize text-slate-400">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>)}</section>}
  </div>;
}
