import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

// Requires a configured model (AI_GATEWAY_API_KEY or provider key).
export default defineEval({
  description: "Agent uses check_hero_waste for a hero-waste question and reports evidence.",
  async test(t) {
    await t.send("Does https://example.com waste its mobile hero on a slider, autoplay video, or vague slogan?");
    t.succeeded();
    t.calledTool("check_hero_waste");
    t.check(t.reply, includes(/hero|slider|slogan|proof/i));
  },
});
