import { defineTool } from "eve/tools";
import { z } from "zod";

const permissionBasisSchema = z.enum([
  "requested_info",
  "granted_permission",
  "established_conversation",
]);

const channelSchema = z.enum(["call", "email", "text", "in_person", "note"]);

const outputSchema = z.object({
  draftSubject: z.string().nullable(),
  draftBody: z.string(),
  channel: channelSchema,
  permissionBasis: permissionBasisSchema,
  requiresApproval: z.literal(true),
  warnings: z.array(z.string()),
});

type Output = z.infer<typeof outputSchema>;

const MAX_BODY_CHARS = 900;

function truncate(text: string, max: number): string {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export default defineTool({
  description:
    "Compose one read-only follow-up draft (teaser, call opener, or requested follow-up) from call notes and audit findings, stamped with its permission basis. Pure computation — never sends, schedules, or publishes. Every output requires human approval.",
  inputSchema: z.object({
    prospectName: z.string().min(1).default("there").describe("Prospect first name, or business name when unknown."),
    channel: channelSchema.describe("Intended channel for the draft (draft only — delivery happens in /centurion)."),
    permissionBasis: permissionBasisSchema.describe(
      "Why this touch is allowed: requested_info, granted_permission, or established_conversation.",
    ),
    callNotes: z.string().min(1).describe("Facts from the last interaction: what was said, agreed, or observed."),
    findings: z
      .array(z.string())
      .max(3)
      .default([])
      .describe("At most three tool-cited audit findings to reference; empty means teaser-only."),
    nextAction: z.string().min(1).describe("The single next step the draft proposes (e.g. a 20-min walkthrough Tue or Thu)."),
  }),
  outputSchema,
  async execute({ prospectName, channel, permissionBasis, callNotes, findings, nextAction }): Promise<Output> {
    const warnings: string[] = [];
    const notes = truncate(callNotes, 300);
    const action = truncate(nextAction, 200);
    const cited = findings.slice(0, 3).map((f) => truncate(f, 220));

    if (cited.length === 0) {
      warnings.push("No audit evidence attached — keep this a teaser (one observation + book link), not a full audit.");
    }
    if (channel === "email" || channel === "text") {
      warnings.push(
        `External ${channel} send needs Joe's approval plus a send-time suppression re-check in /centurion before delivery.`,
      );
    }

    const lines = [
      `Hi ${prospectName} — following up on: ${notes}`,
      ...cited.map((f, i) => `${i + 1}. ${f}`),
      `Suggested next step: ${action}`,
      `Basis: ${permissionBasis}. Draft only — not sent.`,
    ];
    const draftBody = truncate(lines.join("\n"), MAX_BODY_CHARS);

    const draftSubject =
      channel === "email" ? `The website item we discussed` : null;

    return {
      draftSubject,
      draftBody,
      channel,
      permissionBasis,
      requiresApproval: true as const,
      warnings,
    };
  },
  toModelOutput(output) {
    const cited = output.warnings.length > 0 ? ` Warnings: ${output.warnings.join(" ")}` : "";
    return {
      type: "text",
      value: `Follow-up draft (${output.channel}, basis ${output.permissionBasis}, approval required).${cited}\n${output.draftBody}`,
    };
  },
});
