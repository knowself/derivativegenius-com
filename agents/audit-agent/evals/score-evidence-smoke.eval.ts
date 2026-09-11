import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

// Requires a configured model (AI_GATEWAY_API_KEY or provider key).
export default defineEval({
  description: "Agent uses score_audit_evidence for a transparent scoring request.",
  async test(t) {
    await t.send(
      "Score this prospect: active business, clear decision-maker route, weak booking flow, no disqualifiers.",
    );
    t.succeeded();
    t.calledTool("score_audit_evidence");
    t.check(t.reply, includes(/100|total|disposition|rule/i));
  },
});
