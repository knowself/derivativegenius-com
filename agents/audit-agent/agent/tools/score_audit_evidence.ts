import { defineTool } from "eve/tools";
import { z } from "zod";

const RULE_VERSION = "v1.0";

const criteriaSchema = z.object({
  highCustomerValue: z.boolean().describe("Customer value plausibly exceeds $1,000 (20 pts)."),
  websiteWeaknessObserved: z.boolean().describe("Weak or outdated website with a specific observed issue (20 pts)."),
  thirtyPlusReviews: z.boolean().describe("At least 30 Google reviews (15 pts)."),
  decisionMakerRoute: z.boolean().describe("Clear decision-maker route (10 pts)."),
  multiEmployeeOrLocation: z.boolean().describe("Multiple employees or locations (10 pts)."),
  activeAdsOrSocial: z.boolean().describe("Active advertising or social presence (10 pts)."),
  weakBookingFlow: z.boolean().describe("Missing or weak quote/booking workflow (10 pts)."),
  growthTrigger: z.boolean().describe("Recent growth trigger (5 pts)."),
});

const DISQUALIFIERS = [
  "permanently_closed",
  "inactive_license",
  "poor_reputation",
  "no_evidence_of_operations",
  "do_not_contact",
  "client_conflict",
  "vendor_or_legal_restriction",
  "outside_offer",
] as const;

const outputSchema = z.object({
  ruleVersion: z.string(),
  total: z.number(),
  max: z.number(),
  breakdown: z.array(z.object({ criterion: z.string(), points: z.number(), awarded: z.boolean() })),
  disqualified: z.boolean(),
  disqualifierReasons: z.array(z.string()),
  disposition: z.enum(["priority", "qualified_nurture", "research_only", "exclude"]),
  evidence: z.array(z.string()),
});

type Output = z.infer<typeof outputSchema>;

const CRITERIA: { key: keyof z.infer<typeof criteriaSchema>; label: string; points: number }[] = [
  { key: "highCustomerValue", label: "customer value plausibly exceeds $1,000", points: 20 },
  { key: "websiteWeaknessObserved", label: "weak/outdated website with specific observed issue", points: 20 },
  { key: "thirtyPlusReviews", label: "at least 30 Google reviews", points: 15 },
  { key: "decisionMakerRoute", label: "clear decision-maker route", points: 10 },
  { key: "multiEmployeeOrLocation", label: "multiple employees or locations", points: 10 },
  { key: "activeAdsOrSocial", label: "active advertising or social presence", points: 10 },
  { key: "weakBookingFlow", label: "missing or weak quote/booking workflow", points: 10 },
  { key: "growthTrigger", label: "recent growth trigger", points: 5 },
];

export default defineTool({
  description:
    "Score a prospect transparently against scoring rule v1.0 (max 100). Takes observed criteria and hard disqualifiers, returns points breakdown, disposition band, and rule version. Pure computation — no fetching, no side effects. A disqualifier always forces exclude.",
  inputSchema: z.object({
    criteria: criteriaSchema,
    disqualifiers: z.array(z.enum(DISQUALIFIERS)).default([]).describe("Hard disqualifiers; any entry forces exclude."),
    evidenceNotes: z.array(z.string()).default([]).describe("Short citations backing each awarded criterion (tool output refs)."),
  }),
  outputSchema,
  async execute({ criteria, disqualifiers, evidenceNotes }): Promise<Output> {
    const breakdown = CRITERIA.map((c) => ({ criterion: c.label, points: c.points, awarded: criteria[c.key] }));
    const total = breakdown.reduce((sum, b) => sum + (b.awarded ? b.points : 0), 0);
    const disqualified = disqualifiers.length > 0;
    const disposition: Output["disposition"] = disqualified
      ? "exclude"
      : total >= 75
        ? "priority"
        : total >= 60
          ? "qualified_nurture"
          : total >= 40
            ? "research_only"
            : "exclude";
    const evidence = [
      ...breakdown.filter((b) => b.awarded).map((b) => `+${b.points} ${b.criterion}`),
      ...evidenceNotes,
      ...(disqualified ? disqualifiers.map((d) => `DISQUALIFIER: ${d}`) : []),
      `rule ${RULE_VERSION}: total ${total}/100 → ${disposition}`,
    ];
    return {
      ruleVersion: RULE_VERSION,
      total,
      max: 100,
      breakdown,
      disqualified,
      disqualifierReasons: [...disqualifiers],
      disposition,
      evidence,
    };
  },
  toModelOutput(output) {
    return {
      type: "text",
      value: `Score ${output.total}/${output.max} (rule ${output.ruleVersion}) → ${output.disposition}${output.disqualified ? ` — disqualified: ${output.disqualifierReasons.join(", ")}` : ""}.`,
    };
  },
});
