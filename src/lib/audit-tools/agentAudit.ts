import 'server-only';

import type { CallCtaResult, HeroResult, OwnedContentResult } from './checks';

export interface AgentAuditDraft {
  /** At most three evidence-cited problem findings, ordered by leverage. */
  findings: string[];
  /** Machine-readable summary stamped on the draft for reviewers. */
  scoreSummary: string;
}

/**
 * Convert deterministic static-check outputs into an audit draft.
 * Mirrors the Eve audit-agent doctrine: at most three findings, every
 * finding cites tool evidence, inconclusive is flagged — never a verdict
 * on the business. A fully-passing run still records one draft finding so
 * the run is auditable; human viewport confirmation stays required.
 */
export function buildAgentAuditDraft(
  callCta: CallCtaResult,
  hero: HeroResult,
  owned: OwnedContentResult,
  ranAt: Date = new Date(),
): AgentAuditDraft {
  const stamp = ranAt.toISOString();
  const findings: string[] = [];

  if (callCta.verdict === 'fail') {
    findings.push(
      `Tap-to-call gap (${callCta.verdict}): ${callCta.evidence.join('; ')}. ${callCta.note}`,
    );
  } else if (!callCta.reachable) {
    findings.push(
      `Tap-to-call inconclusive: site could not be fetched safely (${callCta.evidence.join('; ')}). Do not quote — verify on a phone.`,
    );
  }

  if (hero.verdict === 'fail') {
    findings.push(`Hero waste (${hero.verdict}): ${hero.evidence.join('; ')}. ${hero.note}`);
  } else if (!hero.reachable) {
    findings.push(
      `Hero check inconclusive: site could not be fetched safely (${hero.evidence.join('; ')}). Do not quote — verify on a phone.`,
    );
  }

  if (owned.verdict === 'fail') {
    findings.push(`Owned-content gap (${owned.verdict}): ${owned.evidence.join('; ')}. ${owned.note}`);
  }

  if (findings.length === 0) {
    findings.push(
      `No machine-detectable blockers in the 3 static checks (${stamp}): tap-to-call, hero, and owned-content all passed heuristics. Human 390px viewport review still required before quoting.`,
    );
  }

  const scoreSummary =
    `Agent-performed deterministic checks ${stamp}: ` +
    `call-cta=${callCta.verdict} hero=${hero.verdict} owned=${owned.verdict}. ` +
    `Static-HTML heuristics — human viewport confirmation required before quoting.`;

  return { findings: findings.slice(0, 3), scoreSummary };
}
