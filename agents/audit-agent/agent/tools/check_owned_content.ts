import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchPublicHtml } from "../lib/safe_fetch.js";

const outputSchema = z.object({
  url: z.string(),
  finalUrl: z.string().nullable(),
  reachable: z.boolean(),
  hasSitemap: z.boolean(),
  hasBlogOrArticles: z.boolean(),
  hasRssOrPodcast: z.boolean(),
  socialOnlySignals: z.number(),
  verdict: z.enum(["pass", "fail", "inconclusive"]),
  evidence: z.array(z.string()),
  note: z.string(),
});

type Output = z.infer<typeof outputSchema>;

function originOf(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
}

export default defineTool({
  description:
    "Check whether a business publishes indexable content on its owned domain (sitemap, blog/articles, RSS/podcast) or shows social-only signals. Read-only static checks, never executes site scripts.",
  inputSchema: z.object({
    url: z.string().url().describe("Public http(s) URL of the business homepage."),
  }),
  outputSchema,
  async execute({ url }): Promise<Output> {
    let finalUrl: string;
    let html: string;
    try {
      ({ finalUrl, html } = await fetchPublicHtml(url));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        url,
        finalUrl: null,
        reachable: false,
        hasSitemap: false,
        hasBlogOrArticles: false,
        hasRssOrPodcast: false,
        socialOnlySignals: 0,
        verdict: "inconclusive",
        evidence: [`fetch failed for ${url}: ${message}`],
        note: "Page could not be fetched safely; report as inconclusive, not as a failure of the business.",
      };
    }

    const evidence: string[] = [];
    const origin = originOf(finalUrl);
    const lower = html.toLowerCase();

    // Sitemap: probe /sitemap.xml and sitemap_index.xml (cheap, read-only).
    let hasSitemap = false;
    for (const path of ["/sitemap.xml", "/sitemap_index.xml"]) {
      try {
        const { html: sm } = await fetchPublicHtml(origin + path);
        if (sm.includes("<url") || sm.includes("<sitemap")) {
          hasSitemap = true;
          evidence.push(`sitemap found at ${path}`);
          break;
        }
      } catch {
        // Absent sitemap file is a signal, not an error.
      }
    }
    if (!hasSitemap) evidence.push("no sitemap.xml found");

    // Blog/articles: internal links to blog-like paths.
    const internalBlogLinks =
      html.match(/href\s*=\s*["'](\/(blog|articles|news|insights|resources)[^"']*|https?:[^"']*\/(blog|articles|news)[^"']*)["']/gi) ?? [];
    const hasBlogOrArticles = internalBlogLinks.length > 0;
    evidence.push(
      hasBlogOrArticles ? `found ${internalBlogLinks.length} blog/article link(s)` : "no blog/article links found",
    );

    // RSS/podcast: feed link tags or podcast platform embeds pointing at owned feeds.
    const hasRssOrPodcast =
      /<link\b[^>]*type\s*=\s*["']application\/(rss|atom)\+xml["']/i.test(html) ||
      /href\s*=\s*["'][^"']*\/(feed|rss|podcast)(\.xml)?["']/i.test(html);
    evidence.push(hasRssOrPodcast ? "RSS/podcast feed reference found" : "no RSS/podcast feed reference found");

    // Social-only signals: social profile links with no owned content to balance them.
    const socialLinks =
      html.match(/href\s*=\s*["']https?:\/\/(www\.)?(facebook|instagram|tiktok|twitter|x)\.com[^"']*["']/gi) ?? [];
    const socialOnlySignals = socialLinks.length;
    if (socialOnlySignals > 0) evidence.push(`${socialOnlySignals} social profile link(s) found`);

    const ownedSignals = [hasSitemap, hasBlogOrArticles, hasRssOrPodcast].filter(Boolean).length;
    const verdict = ownedSignals >= 2 ? "pass" : ownedSignals === 0 && socialOnlySignals > 0 ? "fail" : "fail";
    if (verdict === "fail" && ownedSignals > 0) {
      evidence.push("some owned content exists but coverage is thin (fewer than 2 signals)");
    }

    return {
      url,
      finalUrl,
      reachable: true,
      hasSitemap,
      hasBlogOrArticles,
      hasRssOrPodcast,
      socialOnlySignals,
      verdict,
      evidence,
      note: "Presence checks only: a sitemap/blog link existing does not prove the content answers customer questions. Treat 'fail' as 'needs human confirmation'.",
    };
  },
  toModelOutput(output) {
    if (!output.reachable) {
      return { type: "text", value: `Owned-content check inconclusive for ${output.url}: ${output.evidence.join("; ")}` };
    }
    return {
      type: "text",
      value: `Owned-content check ${output.verdict} for ${output.url}: ${output.evidence.join("; ")}. ${output.note}`,
    };
  },
});
