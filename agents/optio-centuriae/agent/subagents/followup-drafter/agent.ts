import { defineAgent } from "eve";
import { primaryModel } from "../../lib/model.js";

// Followup-drafter: read-only next-touch drafter under the Optio. It composes
// one permission-carrying draft per task via the draft_followup tool and never
// sends, schedules, or publishes anything. External delivery stays behind the
// DT-20 permission + suppression + human-approval gates in /centurion.
export default defineAgent({
  description:
    "Read-only follow-up drafter. Composes one next-touch draft (teaser, call opener, or requested follow-up) from call notes and audit findings, stamped with its permission basis and a requires-approval flag. Never sends, schedules, or publishes.",
  model: primaryModel,
  // Same unlisted-model explicit window as the root (see agent/agent.ts).
  modelContextWindowTokens: 128_000,
});
