/**
 * Transparent Lead Scoring Engine (v1.0)
 * 
 * Scores prospective businesses based on commercial potential, website quality,
 * review count, decision-maker reachability, and disqualifying rules.
 */

export interface ScoringInput {
  hasHighCustomerValue?: boolean;       // Customer value > $1,000 (20 pts)
  hasWeakOrOutdatedWebsite?: boolean;   // Specific conversion or design flaw observed (20 pts)
  googleReviewCount?: number;           // >= 30 Google reviews (15 pts)
  hasDecisionMakerRoute?: boolean;      // Direct owner/founder/decision-maker contact (10 pts)
  hasMultipleEmployeesOrLocations?: boolean; // Multiple staff or locations (10 pts)
  hasActiveAdsOrSocial?: boolean;       // Active marketing presence (10 pts)
  hasWeakBookingWorkflow?: boolean;     // Missing quote/booking form (10 pts)
  hasRecentGrowthTrigger?: boolean;     // Expanding team, new location (5 pts)

  // Hard Disqualifiers
  isPermanentlyClosed?: boolean;
  hasInactiveLicense?: boolean;
  isDoNotContact?: boolean;
  hasClientConflict?: boolean;
  disqualificationNote?: string;
}

export interface RuleResult {
  ruleId: string;
  name: string;
  points: number;
  matched: boolean;
}

export interface ScoringOutput {
  score: number; // 0 to 100
  disposition: 'priority' | 'qualified' | 'research' | 'exclude';
  isDisqualified: boolean;
  disqualificationReason?: string;
  scoreVersion: string;
  breakdown: RuleResult[];
}

export function calculateProspectScore(input: ScoringInput): ScoringOutput {
  const rules: RuleResult[] = [
    {
      ruleId: 'high_customer_value',
      name: 'Plausible Customer Value > $1,000',
      points: 20,
      matched: Boolean(input.hasHighCustomerValue),
    },
    {
      ruleId: 'weak_website',
      name: 'Weak or Outdated Website Observed',
      points: 20,
      matched: Boolean(input.hasWeakOrOutdatedWebsite),
    },
    {
      ruleId: 'google_reviews_30plus',
      name: 'At least 30 Google Reviews',
      points: 15,
      matched: (input.googleReviewCount ?? 0) >= 30,
    },
    {
      ruleId: 'decision_maker_route',
      name: 'Clear Decision-Maker Contact Route',
      points: 10,
      matched: Boolean(input.hasDecisionMakerRoute),
    },
    {
      ruleId: 'multi_location_staff',
      name: 'Multiple Employees or Locations',
      points: 10,
      matched: Boolean(input.hasMultipleEmployeesOrLocations),
    },
    {
      ruleId: 'active_marketing',
      name: 'Active Advertising or Social Media Presence',
      points: 10,
      matched: Boolean(input.hasActiveAdsOrSocial),
    },
    {
      ruleId: 'weak_booking_workflow',
      name: 'Missing or Weak Quote/Booking Friction',
      points: 10,
      matched: Boolean(input.hasWeakBookingWorkflow),
    },
    {
      ruleId: 'growth_trigger',
      name: 'Recent Expansion or Hiring Growth Trigger',
      points: 5,
      matched: Boolean(input.hasRecentGrowthTrigger),
    },
  ];

  // Hard Disqualifiers check
  if (input.isPermanentlyClosed) {
    return createDisqualifiedOutput('Business is permanently closed.', rules);
  }
  if (input.hasInactiveLicense) {
    return createDisqualifiedOutput('Required operational license is inactive.', rules);
  }
  if (input.isDoNotContact) {
    return createDisqualifiedOutput('Do-Not-Contact / Opt-Out instruction on file.', rules);
  }
  if (input.hasClientConflict) {
    return createDisqualifiedOutput('Current client or exclusive partner conflict.', rules);
  }
  if (input.disqualificationNote) {
    return createDisqualifiedOutput(input.disqualificationNote, rules);
  }

  const rawScore = rules.reduce((acc, rule) => acc + (rule.matched ? rule.points : 0), 0);
  const finalScore = Math.min(100, Math.max(0, rawScore));

  let disposition: 'priority' | 'qualified' | 'research' | 'exclude' = 'exclude';
  if (finalScore >= 75) {
    disposition = 'priority';
  } else if (finalScore >= 60) {
    disposition = 'qualified';
  } else if (finalScore >= 40) {
    disposition = 'research';
  }

  return {
    score: finalScore,
    disposition,
    isDisqualified: false,
    scoreVersion: 'v1.0',
    breakdown: rules,
  };
}

function createDisqualifiedOutput(reason: string, rules: RuleResult[]): ScoringOutput {
  return {
    score: 0,
    disposition: 'exclude',
    isDisqualified: true,
    disqualificationReason: reason,
    scoreVersion: 'v1.0',
    breakdown: rules,
  };
}
