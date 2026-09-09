import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
  buildAuditNarrative,
  extractSavedBy,
  resolveDisplayName,
} from '@/app/centurion/prospects/[id]/_components/auditNarrative';

describe('buildAuditNarrative', () => {
  const base = {
    targetOutcome: 'Increase qualified quote requests',
    findingsJson: JSON.stringify(['Fix hero phone placement.', 'Add sticky tap-to-call.']),
    scoreSummary: 'done',
    proposalRange: '$2,000–$5,000',
    status: 'draft',
  };
  const prospect = { name: 'Acme Plumbing', websiteUrl: 'https://acmeplumbing.example' };

  it('orders findings by impact and leads with the first as the first step', () => {
    const narrative = buildAuditNarrative(base, prospect, { savedBy: 'knowself', source: 'live-agent' });
    expect(narrative.findings).toHaveLength(2);
    expect(narrative.firstStep).toBe('Fix hero phone placement.');
    expect(narrative.plainText).toContain("What we'd do first:\nFix hero phone placement.");
    expect(narrative.plainText).toContain('Typical engagement for this fix: $2,000–$5,000.');
    expect(narrative.sourceNote).toContain('Eve audit agent');
  });

  it('lists the website after the prospect name and the company block at the end', () => {
    const narrative = buildAuditNarrative(base, prospect, { savedBy: 'knowself', source: 'live-agent' });
    expect(narrative.plainText).toContain('Acme Plumbing — Website Audit\nWebsite: https://acmeplumbing.example');
    expect(narrative.plainText).toContain(
      `${COMPANY_NAME}\nPrepared by: knowself\n${COMPANY_EMAIL}\n${COMPANY_PHONE}`,
    );
  });

  it('labels static-check drafts as needing viewport review', () => {
    const narrative = buildAuditNarrative(base, prospect, { source: 'static-checks' });
    expect(narrative.sourceNote).toContain('viewport review');
  });

  it('handles missing findings without crashing', () => {
    const narrative = buildAuditNarrative({ ...base, findingsJson: 'not-json' }, prospect);
    expect(narrative.findings).toEqual([]);
    expect(narrative.firstStep).toContain('No findings recorded');
    expect(narrative.plainText).toContain('Acme Plumbing — Website Audit');
  });

  it('extractSavedBy recovers names stamped into older summaries', () => {
    expect(extractSavedBy('Live eve audit-agent (x): ok. Saved by knowself.')).toBe('knowself');
    expect(extractSavedBy('Agent-performed checks: done. Run by user_abc.')).toBe('user_abc');
    expect(extractSavedBy('no stamp here')).toBeNull();
  });

  it('resolveDisplayName swaps a raw-id stamp for the matching viewer username', () => {
    const viewer = { id: 'user_abc', name: 'knowself' };
    expect(resolveDisplayName('user_abc', viewer)).toBe('knowself');
    expect(resolveDisplayName('user_xyz', viewer)).toBeNull();
    expect(resolveDisplayName('knowself', viewer)).toBe('knowself');
    expect(resolveDisplayName(null, viewer)).toBeNull();
  });

  it('shows the viewer username in the narrative for own raw-id drafts', () => {
    const stamped = { ...base, scoreSummary: 'Agent-performed checks. Run by user_abc.' };
    const narrative = buildAuditNarrative(stamped, prospect, {
      source: 'static-checks',
      viewer: { id: 'user_abc', name: 'knowself' },
    });
    expect(narrative.savedBy).toBe('knowself');
    expect(narrative.plainText).toContain('Prepared by: knowself');
  });
});
