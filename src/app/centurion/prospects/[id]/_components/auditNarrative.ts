export interface SavedAuditLike {
  targetOutcome?: string | null;
  findingsJson?: string | null;
  scoreSummary?: string | null;
  proposalRange?: string | null;
  status?: string | null;
}

export interface AuditNarrative {
  outcome: string;
  findings: string[];
  firstStep: string;
  proposalRange: string | null;
  savedBy: string | null;
  sourceNote: string;
  plainText: string;
}

export const COMPANY_NAME = 'Derivative Genius';
export const COMPANY_EMAIL = 'joe@derivativegenius.com';
export const COMPANY_PHONE = '(310) 379-9822';

function parseFindings(findingsJson: string | null | undefined): string[] {
  if (!findingsJson) return [];
  try {
    const parsed: unknown = JSON.parse(findingsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((finding) => String(finding).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Recover the saver name stamped into older score summaries
 * ("Saved by X." / "Run by X."). Newer saves carry it explicitly.
 */
export function extractSavedBy(scoreSummary: string | null | undefined): string | null {
  if (!scoreSummary) return null;
  const match = /(?:Saved|Run) by ([^.]+)\./.exec(scoreSummary);
  return match ? match[1].trim() : null;
}

export interface ViewerIdentity {
  id: string;
  name: string | null;
}

/**
 * Decide what "Prepared by" line to show. A stamp holding a raw Clerk user
 * id (`user_…`) is gibberish to a reader: when it matches the current viewer
 * we show their username instead, otherwise the line is omitted.
 */
export function resolveDisplayName(
  savedBy: string | null,
  viewer: ViewerIdentity | null,
): string | null {
  if (!savedBy) return null;
  if (viewer && viewer.name && savedBy === viewer.id) return viewer.name;
  if (/^user_[A-Za-z0-9]+$/.test(savedBy)) return null;
  return savedBy;
}

/**
 * Render a saved audit as a client-appropriate narrative. Findings are
 * stored ordered by commercial leverage (highest first), so the first
 * finding doubles as the recommended first engagement.
 */
export function buildAuditNarrative(
  audit: SavedAuditLike,
  prospect: { name: string; websiteUrl?: string | null },
  options: { savedBy?: string | null; source?: 'live-agent' | 'static-checks' | null; viewer?: ViewerIdentity | null } = {},
): AuditNarrative {
  const outcome = audit.targetOutcome?.trim() || 'Increase qualified quote requests';
  const findings = parseFindings(audit.findingsJson);
  const proposalRange = audit.proposalRange?.trim() || null;
  const rawSavedBy = options.savedBy?.trim() || extractSavedBy(audit.scoreSummary);
  const savedBy = resolveDisplayName(rawSavedBy, options.viewer ?? null);
  const website = prospect.websiteUrl?.trim() || null;
  const firstStep = findings.length > 0
    ? findings[0]
    : 'No findings recorded — run the audit again before drafting a proposal.';
  const sourceNote = options.source === 'live-agent'
    ? 'Prepared by the Eve audit agent from the live site; human-reviewed before sending.'
    : options.source === 'static-checks'
      ? 'Prepared by automated static checks; human viewport review required before quoting.'
      : 'Internal draft — human review required before sending.';

  const lines = [
    `${prospect.name} — Website Audit`,
  ];
  if (website) {
    lines.push(`Website: ${website}`);
  }
  lines.push(
    '',
    `Outcome we're aiming for: ${outcome}`,
    '',
    'What we found (ordered by impact):',
    ...findings.map((finding, index) => `${index + 1}. ${finding}`),
    '',
    "What we'd do first:",
    firstStep,
  );
  if (proposalRange) {
    lines.push('', `Typical engagement for this fix: ${proposalRange}.`);
  }
  lines.push(
    '',
    sourceNote,
    '',
    COMPANY_NAME,
    ...(savedBy ? [`Prepared by: ${savedBy}`] : []),
    COMPANY_EMAIL,
    COMPANY_PHONE,
  );

  return { outcome, findings, firstStep, proposalRange, savedBy, sourceNote, plainText: lines.join('\n') };
}
