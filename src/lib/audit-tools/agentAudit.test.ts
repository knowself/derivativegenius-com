import { buildAgentAuditDraft } from '@/lib/audit-tools/agentAudit';
import type { CallCtaResult, HeroResult, OwnedContentResult } from '@/lib/audit-tools/checks';

const callFail: CallCtaResult = {
  url: 'https://example.com', finalUrl: 'https://example.com/', reachable: true,
  hasTel: false, telCount: 0, stickyMarkerFound: false, verdict: 'fail',
  evidence: ['no tel: link found in HTML'],
  note: 'Static-HTML heuristic.',
};

const heroFail: HeroResult = {
  url: 'https://example.com', finalUrl: 'https://example.com/', reachable: true,
  sliderSignals: 2, carouselLibrary: 'swiper', heroVideoAutoplay: false,
  phoneInHero: false, proofInHero: false, vagueSloganHits: ['excellence in every'],
  verdict: 'fail', evidence: ['carousel library detected: swiper'],
  note: 'Static-HTML heuristic.',
};

const ownedFail: OwnedContentResult = {
  url: 'https://example.com', finalUrl: 'https://example.com/', reachable: true,
  hasSitemap: false, hasBlogOrArticles: false, hasRssOrPodcast: false,
  socialOnlySignals: 3, verdict: 'fail', evidence: ['social links found, no blog path'],
  note: 'Static-HTML heuristic.',
};

const pass = { verdict: 'pass' as const, reachable: true, evidence: [] as string[], note: '' };

describe('buildAgentAuditDraft', () => {
  it('caps findings at three, ordered by leverage, evidence-cited', () => {
    const draft = buildAgentAuditDraft(callFail, heroFail, ownedFail, new Date('2026-09-08T00:00:00Z'));
    expect(draft.findings).toHaveLength(3);
    expect(draft.findings[0]).toMatch(/Tap-to-call gap/);
    expect(draft.findings[0]).toMatch(/no tel: link found/);
    expect(draft.findings[1]).toMatch(/Hero waste/);
    expect(draft.findings[2]).toMatch(/Owned-content gap/);
    expect(draft.scoreSummary).toMatch(/call-cta=fail hero=fail owned=fail/);
  });

  it('flags unreachable checks as inconclusive, never as business failures', () => {
    const unreachable = { ...callFail, reachable: false, verdict: 'inconclusive' as const };
    const draft = buildAgentAuditDraft(unreachable, { ...heroFail, ...pass }, { ...ownedFail, ...pass });
    expect(draft.findings[0]).toMatch(/inconclusive/);
    expect(draft.findings[0]).toMatch(/Do not quote/);
  });

  it('records an auditable draft even when everything passes', () => {
    const draft = buildAgentAuditDraft(
      { ...callFail, ...pass },
      { ...heroFail, ...pass },
      { ...ownedFail, ...pass },
    );
    expect(draft.findings).toHaveLength(1);
    expect(draft.findings[0]).toMatch(/No machine-detectable blockers/);
    expect(draft.findings[0]).toMatch(/viewport review still required/);
  });
});
