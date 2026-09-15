import {
  campaignStatusTransitionSchema,
  getCampaignStatusTransitionError,
  isQueueEligibleCampaignStatus,
} from '@/lib/prospecting/campaigns';

describe('Campaign lifecycle', () => {
  it('accepts the four lifecycle statuses and rejects anything else', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    for (const status of ['active', 'paused', 'completed', 'retired'] as const) {
      expect(campaignStatusTransitionSchema.parse({ id, status })).toEqual({ id, status });
    }
    expect(() => campaignStatusTransitionSchema.parse({ id, status: 'deleted' })).toThrow();
    expect(() => campaignStatusTransitionSchema.parse({ id, status: '' })).toThrow();
    expect(() => campaignStatusTransitionSchema.parse({ id: 'not-a-uuid', status: 'retired' })).toThrow();
    expect(() => campaignStatusTransitionSchema.parse({ status: 'retired' })).toThrow();
  });

  it('allows every transition except no-ops and unknown current statuses', () => {
    expect(getCampaignStatusTransitionError('active', 'retired')).toBeNull();
    expect(getCampaignStatusTransitionError('active', 'paused')).toBeNull();
    expect(getCampaignStatusTransitionError('active', 'completed')).toBeNull();
    expect(getCampaignStatusTransitionError('paused', 'active')).toBeNull();
    expect(getCampaignStatusTransitionError('retired', 'active')).toBeNull();
    expect(getCampaignStatusTransitionError('retired', 'retired')).toMatch(/already retired/);
    expect(getCampaignStatusTransitionError('active', 'active')).toMatch(/already active/);
    expect(getCampaignStatusTransitionError('archived', 'active')).toMatch(/Unknown current/);
  });

  it('keeps only active campaigns eligible for the daily queue', () => {
    expect(isQueueEligibleCampaignStatus('active')).toBe(true);
    expect(isQueueEligibleCampaignStatus('paused')).toBe(false);
    expect(isQueueEligibleCampaignStatus('completed')).toBe(false);
    expect(isQueueEligibleCampaignStatus('retired')).toBe(false);
    expect(isQueueEligibleCampaignStatus(null)).toBe(false);
    expect(isQueueEligibleCampaignStatus(undefined)).toBe(false);
  });
});
