import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getVercelOidcToken } from '@vercel/oidc';
import { Client } from 'eve/client';
import { db } from '@/db';
import { audits, prospects } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction, resolveActorName } from '@/lib/auth/centurion';
import { checkHeroWaste, checkMobileCallCta, checkOwnedContent } from '@/lib/audit-tools/checks';
import { buildAgentAuditDraft } from '@/lib/audit-tools/agentAudit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Optional: base URL of a running Eve audit-agent — local `eve dev`
 * (e.g. http://127.0.0.1:PORT) or an `eve deploy`ed URL. Server-only.
 * Unset → deterministic static checks only ($0, no keys, no model).
 */
const AUDIT_AGENT_URL = process.env.AUDIT_AGENT_URL?.trim() || null;
const AUDIT_AGENT_TIMEOUT_MS = Number(process.env.AUDIT_AGENT_TIMEOUT_MS ?? 45_000);

const auditOutputSchema = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
    scoreSummary: { type: 'string' },
  },
  required: ['findings'],
} as const;

interface LiveDraft {
  findings: string[];
  scoreSummary: string;
}

/**
 * Mint the deployment's Vercel OIDC token for server-to-server calls to the
 * deployed Eve agent (its channel trusts the dg-web production subject).
 * Returns undefined off Vercel (local dev calls localhost, which is open) —
 * without a token the deployed agent answers 401 and we fall back to static.
 */
async function resolveAgentAuth(): Promise<{ bearer: () => Promise<string> } | undefined> {
  if (process.env.VERCEL !== '1') return undefined;
  try {
    const token = await getVercelOidcToken();
    return { bearer: async () => token };
  } catch (error: unknown) {
    console.warn(
      '[agent-audit] no Vercel OIDC token available:',
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}

/**
 * Ask the live Eve audit-agent for a structured audit. Returns null when the
 * agent is unconfigured, unreachable, unauthorized, times out, or returns no
 * usable findings — the caller then falls back to the static checks below.
 * Only public business info crosses the wire (free tiers may train on it).
 */
async function runLiveAuditAgent(
  websiteUrl: string,
  prospectContext: string,
  signal: AbortSignal,
): Promise<LiveDraft | null> {
  if (!AUDIT_AGENT_URL) return null;
  try {
    const auth = await resolveAgentAuth();
    const client = new Client({ host: AUDIT_AGENT_URL, ...(auth ? { auth } : {}) });
    const { response } = await client.sessions.create({
      message:
        `Run your read-only 5-minute website audit on ${websiteUrl}. ` +
        `Prospect context (public business info only): ${prospectContext}. ` +
        `Report at most three findings ordered by commercial leverage.`,
      outputSchema: auditOutputSchema,
      signal,
    });
    const result = await response.result();
    if (result.status === 'failed') {
      console.warn('[agent-audit] live agent turn failed, falling back to static checks');
      return null;
    }
    const data = result.data as { findings?: unknown; scoreSummary?: unknown } | undefined;
    const findings = (Array.isArray(data?.findings) ? data.findings : [])
      .map((finding) => String(finding).trim())
      .filter(Boolean)
      .slice(0, 3);
    if (findings.length === 0) {
      console.warn('[agent-audit] live agent returned no usable findings, falling back to static checks');
      return null;
    }
    const scoreSummary =
      typeof data?.scoreSummary === 'string' && data.scoreSummary.trim()
        ? data.scoreSummary.trim()
        : 'Live eve audit-agent run (structured summary not provided).';
    return { findings, scoreSummary };
  } catch (error: unknown) {
    console.warn(
      '[agent-audit] live Eve agent unavailable, falling back to static checks:',
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * POST /api/centurion/prospects/:id/agent-audit
 *
 * Tries the live Eve audit-agent first (when AUDIT_AGENT_URL is set),
 * otherwise — or when the live call fails — runs the deterministic static
 * checks (tap-to-call, hero waste, owned-content — the same vectors as the
 * Eve audit-agent doctrine) and saves the result as a human-reviewable
 * audit DRAFT. Nothing is sent. Investigator: machine. Verdict: human, on
 * viewport confirmation.
 */
export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireCenturionAction('manage_audits');
    const savedByPromise = resolveActorName().catch(() => actor.userId);
    const { id } = await context.params;
    const [prospect] = await db.select().from(prospects).where(eq(prospects.id, id));
    if (!prospect) {
      return NextResponse.json({ success: false, error: 'Prospect not found' }, { status: 404 });
    }
    if (!prospect.websiteUrl) {
      return NextResponse.json({ success: false, error: 'Add a website URL to the prospect first' }, { status: 400 });
    }

    const url = prospect.websiteUrl.startsWith('http') ? prospect.websiteUrl : `https://${prospect.websiteUrl}`;
    const prospectContext = [prospect.name, [prospect.city, prospect.state].filter(Boolean).join(', '), prospect.industry]
      .filter(Boolean)
      .join(' · ');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUDIT_AGENT_TIMEOUT_MS);
    let live: LiveDraft | null = null;
    try {
      live = await runLiveAuditAgent(url, prospectContext, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (live) {
      const [audit] = await db
        .insert(audits)
        .values({
          prospectId: id,
          status: 'draft',
          targetOutcome: 'Increase qualified quote requests',
          findingsJson: JSON.stringify(live.findings),
          scoreSummary: `Live eve audit-agent (${AUDIT_AGENT_URL}): ${live.scoreSummary} Saved by ${actor.userId}.`,
          proposalRange: null,
        })
        .returning();
      return NextResponse.json({ success: true, audit, source: 'live-agent', savedBy: await savedByPromise });
    }

    const [callCta, hero, owned] = await Promise.all([
      checkMobileCallCta(url, 390),
      checkHeroWaste(url),
      checkOwnedContent(url),
    ]);

    const draft = buildAgentAuditDraft(callCta, hero, owned);
    const liveNote = AUDIT_AGENT_URL ? ' Live agent unreachable — static fallback.' : '';
    const [audit] = await db
      .insert(audits)
      .values({
        prospectId: id,
        status: 'draft',
        targetOutcome: 'Increase qualified quote requests',
        findingsJson: JSON.stringify(draft.findings),
        scoreSummary: `${draft.scoreSummary} Run by ${actor.userId}.${liveNote}`,
        proposalRange: null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      audit,
      source: 'static-checks',
      savedBy: await savedByPromise,
      checks: { callCta: callCta.verdict, hero: hero.verdict, owned: owned.verdict },
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Agent audit failed' },
      { status: 500 },
    );
  }
}
