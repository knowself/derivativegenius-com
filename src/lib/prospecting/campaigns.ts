import { z } from 'zod';

/**
 * Campaign lifecycle for the /centurion operator console.
 *
 * - `active`: the working set. Only active campaigns feed the daily queue
 *   and appear as default targets for imports and new prospects.
 * - `paused`: temporarily shelved. Hidden from the queue, kept for resume.
 * - `completed`: finished pilot with a recorded continue/revise/stop decision.
 * - `retired`: uninteresting or unsuccessful. Hidden from the queue, but all
 *   prospects, activities, audits, and proposals stay in reports as evidence.
 *
 * Retirement is a status transition, never a delete: an unsuccessful campaign
 * is the evidence that justifies stopping it.
 */
export const CAMPAIGN_STATUSES = ['active', 'paused', 'completed', 'retired'] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const campaignStatusSchema = z.enum(CAMPAIGN_STATUSES);

export const campaignStatusTransitionSchema = z.object({
  id: z.string().uuid('Campaign id must be a UUID'),
  status: campaignStatusSchema,
});

export type CampaignStatusTransition = z.infer<typeof campaignStatusTransitionSchema>;

/** Only active campaigns feed the daily queue; the rest are evidence-only. */
export function isQueueEligibleCampaignStatus(status: string | null | undefined): boolean {
  return status === 'active';
}

/**
 * Guards status transitions. Every pair is allowed (including retired →
 * active reactivation) except a no-op and an unknown current status.
 * Returns an error message, or null when the transition is allowed.
 */
export function getCampaignStatusTransitionError(from: string, to: CampaignStatus): string | null {
  if (!(CAMPAIGN_STATUSES as readonly string[]).includes(from)) {
    return `Unknown current campaign status: ${from}.`;
  }
  if (from === to) {
    return `Campaign is already ${to}.`;
  }
  return null;
}
