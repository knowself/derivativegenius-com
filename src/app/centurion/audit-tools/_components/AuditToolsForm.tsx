'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { CallCtaResult, HeroResult, OwnedContentResult } from '@/lib/audit-tools/checks';
import { buildConfirmedScoringInput } from '@/lib/prospecting/workflow';
import { calculateProspectScore } from '@/lib/prospecting/scoring';

interface AuditResponse {
  success: boolean;
  error?: string;
  url?: string;
  callCta?: CallCtaResult;
  hero?: HeroResult;
  owned?: OwnedContentResult;
}

const PRESETS = [
  'https://www.rightontimehvac.com/',
  'https://reliance-enterprises.com/lake-county-hvac-services/',
];

export default function AuditToolsForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [criteria, setCriteria] = useState({
    hasHighCustomerValue: false,
    hasWeakOrOutdatedWebsite: false,
    hasDecisionMakerRoute: false,
    hasMultipleEmployeesOrLocations: false,
    hasActiveAdsOrSocial: false,
    hasWeakBookingWorkflow: false,
    hasRecentGrowthTrigger: false,
  });
  const [reviewCount, setReviewCount] = useState(0);

  const scoring = useMemo(
    () => calculateProspectScore(buildConfirmedScoringInput({ ...criteria, reviewCount })),
    [criteria, reviewCount],
  );

  const findings = useMemo(() => buildFindings(result), [result]);

  function applyEvidenceHints(data: AuditResponse) {
    setCriteria((prev) => ({
      ...prev,
      hasWeakOrOutdatedWebsite:
        prev.hasWeakOrOutdatedWebsite || data.hero?.verdict === 'fail' || data.owned?.verdict === 'fail',
      hasDecisionMakerRoute: prev.hasDecisionMakerRoute || (data.callCta?.telCount ?? 0) > 0,
      hasActiveAdsOrSocial: prev.hasActiveAdsOrSocial || (data.owned?.socialOnlySignals ?? 0) > 0,
    }));
  }

  async function run(target?: string) {
    const value = (target ?? url).trim();
    if (!value) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/centurion/audit-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      });
      const data = (await response.json()) as AuditResponse;
      setResult(data);
      setCopied(false);
      if (data.success) applyEvidenceHints(data);
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Request failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form
        className="flex flex-col sm:flex-row gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/service-page"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Run audit'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 text-xs">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={loading}
            onClick={() => {
              setUrl(preset);
              void run(preset);
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50"
          >
            {preset}
          </button>
        ))}
      </div>

      {result && !result.success && (
        <p className="text-sm text-rose-400 bg-rose-950/30 border border-rose-900 rounded-lg p-3">{result.error}</p>
      )}

      {result?.success && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <ResultCard title="Tap-to-call" verdict={result.callCta?.verdict} evidence={result.callCta?.evidence} note={result.callCta?.note} />
            <ResultCard title="Hero waste" verdict={result.hero?.verdict} evidence={result.hero?.evidence} note={result.hero?.note} />
            <ResultCard title="Owned content" verdict={result.owned?.verdict} evidence={result.owned?.evidence} note={result.owned?.note} />
          </div>

          <section className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold text-white text-sm">
                Score preview — {scoring.score} pts · {scoring.disposition}
              </h2>
              <span className="text-[11px] text-slate-500">v1.0 rules · confirm only facts Joe verified before saving</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {CRITERIA_LABELS.map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 rounded p-2">
                  <input
                    type="checkbox"
                    checked={criteria[key]}
                    onChange={(event) => setCriteria({ ...criteria, [key]: event.target.checked })}
                  />
                  {label}
                </label>
              ))}
              <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 rounded p-2">
                Google reviews
                <input
                  type="number"
                  min={0}
                  value={reviewCount}
                  onChange={(event) => setReviewCount(Number(event.target.value))}
                  className="w-20 rounded bg-slate-950 border border-slate-700 px-2 py-1 text-white"
                />
                <span className="text-slate-500">+15 at 30+</span>
              </label>
            </div>
            <div className="grid gap-2">
              {scoring.breakdown.map((rule) => (
                <div key={rule.ruleId} className="flex justify-between text-xs text-slate-400">
                  <span>{rule.name}</span>
                  <strong className={rule.matched ? 'text-emerald-400' : ''}>{rule.matched ? `+${rule.points}` : '0'}</strong>
                </div>
              ))}
            </div>
          </section>

          {findings.length > 0 && (
            <section className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-white text-sm">Suggested findings (max 3, evidence-cited)</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard.writeText(findings.join('\n')).then(() => setCopied(true));
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    {copied ? 'Copied' : 'Copy findings'}
                  </button>
                  <ProspectLink url={result.url} />
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal pl-5">
                {findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ol>
              <p className="text-[11px] text-slate-500">
                Paste into the prospect workspace audit draft — saving, suppression re-check, and sending stay in that flow.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

const CRITERIA_LABELS = [
  ['hasHighCustomerValue', 'Customer value above $1,000 (+20)'],
  ['hasWeakOrOutdatedWebsite', 'Specific website weakness observed (+20)'],
  ['hasDecisionMakerRoute', 'Decision-maker route confirmed (+10)'],
  ['hasMultipleEmployeesOrLocations', 'Multiple employees or locations (+10)'],
  ['hasActiveAdsOrSocial', 'Active ads or social (+10)'],
  ['hasWeakBookingWorkflow', 'Weak quote / booking workflow (+10)'],
  ['hasRecentGrowthTrigger', 'Recent growth trigger (+5)'],
] as const;

function buildFindings(result: AuditResponse | null): string[] {
  if (!result?.success) return [];
  const out: string[] = [];
  if (result.hero?.verdict === 'fail') {
    out.push(
      `Hero hides phone or proof above the fold [${result.hero.evidence.join('; ')}]. Confirm on a rendered 390px viewport before quoting.`,
    );
  }
  if (result.owned?.verdict === 'fail') {
    out.push(`Thin owned content [${result.owned.evidence.join('; ')}]. Publish 2 job Q&A pages linked from the homepage.`);
  }
  if (result.callCta?.verdict === 'fail') {
    out.push(
      `Tap-to-call gap [${result.callCta.evidence.join('; ')}]. Pin one sticky tel: button in the mobile thumb zone.`,
    );
  } else if (result.callCta?.verdict === 'pass') {
    out.push(
      `Tap-to-call present [${result.callCta.evidence.join('; ')}]. Verify it stays in thumb reach while scrolling.`,
    );
  }
  return out.slice(0, 3);
}

function ProspectLink({ url }: { url?: string }) {
  if (!url) return null;
  let host = '';
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
  return (
    <Link
      href="/centurion/prospects"
      title={`Check for an existing prospect matching ${host} before creating`}
      className="px-2 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-xs text-emerald-200"
    >
      Open prospects (check {host})
    </Link>
  );
}

function ResultCard({ title, verdict, evidence, note }: { title: string; verdict?: string; evidence?: string[]; note?: string }) {  const color = verdict === 'pass' ? 'text-emerald-400' : verdict === 'fail' ? 'text-amber-400' : 'text-slate-400';
  return (
    <section className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white text-sm">{title}</h2>
        <span className={`text-xs font-bold uppercase ${color}`}>{verdict ?? '—'}</span>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs text-slate-300 list-disc pl-4">
        {(evidence ?? []).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {note && <p className="mt-3 text-[11px] text-slate-500">{note}</p>}
    </section>
  );
}
