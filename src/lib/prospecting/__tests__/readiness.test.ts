import { canPerformCenturionAction } from '@/lib/auth/roles';
import { createSuppressionHash } from '@/lib/prospecting/suppression';
import {
  buildConfirmedScoringInput,
  getOutcomeTransition,
  sortQueueItems,
} from '@/lib/prospecting/workflow';

describe('Centurion authorization policy', () => {
  it('allows only administrators to export prospect data', () => {
    expect(canPerformCenturionAction('centurion_admin', 'export')).toBe(true);
    expect(canPerformCenturionAction('prospector', 'export')).toBe(false);
    expect(canPerformCenturionAction('sales_operator', 'export')).toBe(false);
    expect(canPerformCenturionAction('viewer', 'export')).toBe(false);
  });

  it('keeps viewers read-only', () => {
    expect(canPerformCenturionAction('viewer', 'read')).toBe(true);
    expect(canPerformCenturionAction('viewer', 'log_outreach')).toBe(false);
    expect(canPerformCenturionAction('viewer', 'qualify')).toBe(false);
  });
});

describe('Suppression identifiers', () => {
  it('creates deterministic keyed hashes without storing normalized phone digits', () => {
    const first = createSuppressionHash('(512) 555-0199', 'test-secret');
    const second = createSuppressionHash('5125550199', 'test-secret');

    expect(first).toBe(second);
    expect(first).not.toContain('5125550199');
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it('changes when the application secret changes', () => {
    expect(createSuppressionHash('5125550199', 'secret-a')).not.toBe(
      createSuppressionHash('5125550199', 'secret-b'),
    );
  });
});

describe('Human-confirmed qualification', () => {
  it('can promote a fully evidenced imported prospect into the priority queue', () => {
    const input = buildConfirmedScoringInput({
      hasHighCustomerValue: true,
      hasWeakOrOutdatedWebsite: true,
      reviewCount: 42,
      hasDecisionMakerRoute: true,
      hasActiveAdsOrSocial: true,
    });

    expect(input).toEqual({
      hasHighCustomerValue: true,
      hasWeakOrOutdatedWebsite: true,
      googleReviewCount: 42,
      hasDecisionMakerRoute: true,
      hasMultipleEmployeesOrLocations: false,
      hasActiveAdsOrSocial: true,
      hasWeakBookingWorkflow: false,
      hasRecentGrowthTrigger: false,
      isPermanentlyClosed: false,
      hasInactiveLicense: false,
      isDoNotContact: false,
      hasClientConflict: false,
      disqualificationNote: undefined,
    });
  });
});

describe('Daily action ordering', () => {
  it('orders overdue follow-ups before engaged and untouched priority prospects', () => {
    const now = new Date('2026-08-19T16:00:00.000Z');
    const ordered = sortQueueItems([
      { id: 'priority', score: 90, status: 'qualified', nextActionAt: null },
      { id: 'engaged', score: 70, status: 'engaged', nextActionAt: null },
      { id: 'overdue', score: 60, status: 'contacting', nextActionAt: new Date('2026-08-18T16:00:00.000Z') },
      { id: 'future', score: 95, status: 'contacting', nextActionAt: new Date('2026-08-20T16:00:00.000Z') },
    ], now);

    expect(ordered.map((item) => item.id)).toEqual(['overdue', 'engaged', 'priority', 'future']);
  });
});

describe('Call outcome transitions', () => {
  it('requires a due date for requested follow-up', () => {
    expect(() => getOutcomeTransition('follow_up_requested')).toThrow('due date');
  });

  it('closes outreach immediately for do-not-contact', () => {
    expect(getOutcomeTransition('do_not_contact')).toEqual({
      prospectStatus: 'disqualified',
      qualificationStatus: 'excluded',
      createsTask: false,
      createsSuppression: true,
    });
  });

  it('moves audit requests and meetings into their real workflow stages', () => {
    expect(getOutcomeTransition('audit_requested').prospectStatus).toBe('audit_accepted');
    expect(getOutcomeTransition('meeting_booked').prospectStatus).toBe('discovery_scheduled');
  });
});
