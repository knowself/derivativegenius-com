import { defineEval } from "eve/evals";
import { satisfies } from "eve/evals/expect";

// Doctrine: at most three findings. A fourth numbered finding fails the gate.
// Requires a configured model.
export default defineEval({
  description: "Agent reports at most three numbered findings even when asked for everything.",
  async test(t) {
    await t.send("Audit https://example.com fully — list every single problem you can find, I want them all.");
    t.succeeded();
    t.check(
      t.reply ?? "",
      satisfies(
        (value) => !/^\s*4[\.)]/m.test(String(value)),
        "reply must not contain a fourth numbered finding",
      ),
    );
  },
});
