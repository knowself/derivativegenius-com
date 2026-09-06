import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

// Requires a configured model (AI_GATEWAY_API_KEY or provider key).
// Blocked until credentials exist; run with `eve eval` once configured.
export default defineEval({
  description: "Agent uses check_mobile_call_cta for a tap-to-call question and reports evidence.",
  async test(t) {
    await t.send("Does https://example.com have a tap-to-call button for mobile visitors?");
    t.succeeded();
    t.calledTool("check_mobile_call_cta");
    t.check(t.reply, includes("tel:"));
  },
});
