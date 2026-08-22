import type { ScoringInput } from './scoring';

export const callOutcomes = [
  'no_answer',
  'voicemail',
  'gatekeeper',
  'wrong_number',
  'decision_maker_reached',
  'audit_requested',
  'meeting_booked',
  'follow_up_requested',
  'not_interested',
  'do_not_contact',
  'disqualified',
] as const;

export type CallOutcome = (typeof callOutcomes)[number];

export interface ConfirmedScoringFields {
  hasHighCustomerValue?: boolean;
  hasWeakOrOutdatedWebsite?: boolean;
  reviewCount?: number;
  hasDecisionMakerRoute?: boolean;
  hasMultipleEmployeesOrLocations?: boolean;
  hasActiveAdsOrSocial?: boolean;
  hasWeakBookingWorkflow?: boolean;
  hasRecentGrowthTrigger?: boolean;
  isPermanentlyClosed?: boolean;
  hasInactiveLicense?: boolean;
  isDoNotContact?: boolean;
  hasClientConflict?: boolean;
  disqualificationNote?: string;
}

export function buildConfirmedScoringInput(
  fields: ConfirmedScoringFields,
): ScoringInput {
  return {
    hasHighCustomerValue: fields.hasHighCustomerValue ?? false,
    hasWeakOrOutdatedWebsite: fields.hasWeakOrOutdatedWebsite ?? false,
    googleReviewCount: fields.reviewCount ?? 0,
    hasDecisionMakerRoute: fields.hasDecisionMakerRoute ?? false,
    hasMultipleEmployeesOrLocations: fields.hasMultipleEmployeesOrLocations ?? false,
    hasActiveAdsOrSocial: fields.hasActiveAdsOrSocial ?? false,
    hasWeakBookingWorkflow: fields.hasWeakBookingWorkflow ?? false,
    hasRecentGrowthTrigger: fields.hasRecentGrowthTrigger ?? false,
    isPermanentlyClosed: fields.isPermanentlyClosed ?? false,
    hasInactiveLicense: fields.hasInactiveLicense ?? false,
    isDoNotContact: fields.isDoNotContact ?? false,
    hasClientConflict: fields.hasClientConflict ?? false,
    disqualificationNote: fields.disqualificationNote,
  };
}

export interface QueueItem {
  id: string;
  score: number | null;
  status: string;
  nextActionAt: Date | null;
}

function queueBucket(item: QueueItem, now: Date): number {
  if (item.nextActionAt && item.nextActionAt <= now) return 0;
  if (['engaged', 'audit_accepted', 'discovery_scheduled'].includes(item.status)) return 1;
  if (!item.nextActionAt) return 2;
  return 3;
}

export function sortQueueItems<T extends QueueItem>(
  items: readonly T[],
  now = new Date(),
): T[] {
  return [...items].sort((left, right) => {
    const bucketDifference = queueBucket(left, now) - queueBucket(right, now);
    if (bucketDifference !== 0) return bucketDifference;

    if (left.nextActionAt && right.nextActionAt) {
      const dueDifference = left.nextActionAt.getTime() - right.nextActionAt.getTime();
      if (dueDifference !== 0) return dueDifference;
    }

    return (right.score ?? 0) - (left.score ?? 0);
  });
}

export interface OutcomeTransition {
  prospectStatus: string;
  qualificationStatus: string;
  createsTask: boolean;
  createsSuppression: boolean;
}

export function getOutcomeTransition(
  outcome: CallOutcome,
  nextActionAt?: Date,
): OutcomeTransition {
  if (outcome === 'follow_up_requested' && !nextActionAt) {
    throw new Error('A due date is required for a requested follow-up.');
  }

  if (outcome === 'do_not_contact') {
    return {
      prospectStatus: 'disqualified',
      qualificationStatus: 'excluded',
      createsTask: false,
      createsSuppression: true,
    };
  }

  if (outcome === 'disqualified' || outcome === 'wrong_number') {
    return {
      prospectStatus: 'disqualified',
      qualificationStatus: 'excluded',
      createsTask: false,
      createsSuppression: false,
    };
  }

  if (outcome === 'not_interested') {
    return {
      prospectStatus: 'closed_lost',
      qualificationStatus: 'qualified',
      createsTask: false,
      createsSuppression: false,
    };
  }

  if (outcome === 'audit_requested') {
    return { prospectStatus: 'audit_accepted', qualificationStatus: 'qualified', createsTask: Boolean(nextActionAt), createsSuppression: false };
  }

  if (outcome === 'meeting_booked') {
    return { prospectStatus: 'discovery_scheduled', qualificationStatus: 'qualified', createsTask: Boolean(nextActionAt), createsSuppression: false };
  }

  const engagedOutcomes: CallOutcome[] = [
    'decision_maker_reached',
    'follow_up_requested',
  ];

  return {
    prospectStatus: engagedOutcomes.includes(outcome) ? 'engaged' : 'contacting',
    qualificationStatus: 'qualified',
    createsTask: Boolean(nextActionAt),
    createsSuppression: false,
  };
}
