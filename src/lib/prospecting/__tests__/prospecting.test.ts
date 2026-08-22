import { calculateProspectScore } from '../scoring';
import { findDuplicateProspect, normalizeDomain, normalizePhone } from '../dedup';
import { resolveUserRole, hasRequiredRole } from '../../auth/roles';

describe('Transparent Lead Scoring Engine (v1.0)', () => {
  it('calculates priority disposition for high-scoring prospect', () => {
    const result = calculateProspectScore({
      hasHighCustomerValue: true,      // 20
      hasWeakOrOutdatedWebsite: true,  // 20
      googleReviewCount: 45,           // 15
      hasDecisionMakerRoute: true,     // 10
      hasActiveAdsOrSocial: true,      // 10
    });

    expect(result.score).toBe(75);
    expect(result.disposition).toBe('priority');
    expect(result.isDisqualified).toBe(false);
  });

  it('immediately excludes prospect on hard disqualifier', () => {
    const result = calculateProspectScore({
      hasHighCustomerValue: true,
      googleReviewCount: 100,
      isDoNotContact: true, // Disqualifier
    });

    expect(result.score).toBe(0);
    expect(result.disposition).toBe('exclude');
    expect(result.isDisqualified).toBe(true);
    expect(result.disqualificationReason).toContain('Do-Not-Contact');
  });
});

describe('Deduplication & Identity Engine', () => {
  it('normalizes domain names correctly', () => {
    expect(normalizeDomain('https://www.example.com/about?ref=1')).toBe('example.com');
    expect(normalizeDomain('http://sub.domain.co.uk/')).toBe('sub.domain.co.uk');
  });

  it('normalizes phone numbers to digits only', () => {
    expect(normalizePhone('(512) 555-0199')).toBe('5125550199');
  });

  it('detects duplicate via exact domain match', () => {
    const candidate = { name: 'Acme HVAC', websiteUrl: 'https://acmehvac.com/contact' };
    const existing = [
      { id: 'p-1', name: 'Acme Plumbing', websiteUrl: 'acmehvac.com' }
    ];

    const match = findDuplicateProspect(candidate, existing);
    expect(match.isMatch).toBe(true);
    expect(match.matchType).toBe('exact_domain');
    expect(match.existingProspectId).toBe('p-1');
  });
});

describe('Centurion Role Hierarchy', () => {
  it('requires explicit role assignment and otherwise fails closed', () => {
    expect(resolveUserRole('centurion_admin')).toBe('centurion_admin');
    expect(resolveUserRole(undefined)).toBe('viewer');
    expect(resolveUserRole('unexpected')).toBe('viewer');
  });

  it('grants centurion_admin full privileges', () => {
    expect(hasRequiredRole('centurion_admin', 'prospector')).toBe(true);
    expect(hasRequiredRole('centurion_admin', 'sales_operator')).toBe(true);
    expect(hasRequiredRole('prospector', 'centurion_admin')).toBe(false);
  });
});
