import { defineAgent } from "eve";
import { primaryModel } from "../../lib/model.js";

// Local mount of the standalone audit-agent project: tools are re-export
// stubs into agents/audit-agent/agent/tools/*. This file exists because a
// declared subagent requires its own description. Model is shared with the
// Optio via its lib — one routing decision for the whole command.
// Long term, this mount becomes a remote agent (defineRemoteAgent) once
// audit-agent is deployed; until then the Optio commands it locally.
export default defineAgent({
  description:
    "Read-only website auditor. Answers what the next safe, valuable fix is with at most three tool-cited findings (tap-to-call, hero waste, transparent v1.0 score). Never edits, sends, or publishes.",
  model: primaryModel,
  // Same unlisted-model explicit window as the root (see agent/agent.ts).
  modelContextWindowTokens: 128_000,
});
