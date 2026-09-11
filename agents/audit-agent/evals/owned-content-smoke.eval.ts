import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

// Requires a configured model (AI_GATEWAY_API_KEY or provider key).
export default defineEval({
  description: "Agent uses check_owned_content for an owned-domain content question.",
  async test(t) {
    await t.send("Does https://example.com publish anything indexable on its own domain, or is everything trapped on social media?");
    t.succeeded();
    t.calledTool("check_owned_content");
    t.check(t.reply, includes(/sitemap|blog|rss|social|domain/i));
  },
});
