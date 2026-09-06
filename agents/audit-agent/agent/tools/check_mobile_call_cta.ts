import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchPublicHtml } from "../lib/safe_fetch.js";

const outputSchema = z.object({
  url: z.string(),
  finalUrl: z.string().nullable(),
  reachable: z.boolean(),
  hasTel: z.boolean(),
  telCount: z.number(),
  stickyMarkerFound: z.boolean(),
  verdict: z.enum(["pass", "fail", "inconclusive"]),
  evidence: z.array(z.string()),
  note: z.string(),
});

type Output = z.infer<typeof outputSchema>;

function unreachable(url: string, evidence: string, note: string): Output {
  return {
    url,
    finalUrl: null,
    reachable: false,
    hasTel: false,
    telCount: 0,
    stickyMarkerFound: false,
    verdict: "inconclusive",
    evidence: [evidence],
    note,
  };
}

export default defineTool({
  description:
    "Check a public business URL for a tap-to-call tel: link and sticky/fixed positioning markers. Read-only: fetches public HTML with SSRF guards, never executes site scripts.",
  inputSchema: z.object({
    url: z.string().url().describe("Public http(s) URL of the page to check."),
    viewportWidth: z.number().int().min(320).max(768).default(390),
  }),
  outputSchema,
  async execute({ url, viewportWidth }): Promise<Output> {
    const evidence: string[] = [];
    let finalUrl: string;
    let html: string;
    try {
      ({ finalUrl, html } = await fetchPublicHtml(url));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return unreachable(
        url,
        `fetch failed for ${url}: ${message}`,
        "Page could not be fetched safely; report as inconclusive, not as a failure of the business.",
      );
    }

    // Static parse only — no script execution. Case-insensitive tel: anchor scan.
    const telMatches = html.match(/href\s*=\s*["']tel:[^"']*["']/gi) ?? [];
    const telCount = telMatches.length;
    const hasTel = telCount > 0;
    evidence.push(hasTel ? `found ${telCount} tel: link(s)` : "no tel: link found in HTML");

    // Sticky/fixed marker heuristic on tel-bearing elements and global CSS.
    const stickyPattern = /sticky|position\s*:\s*(sticky|fixed)/i;
    const anchorTags = html.match(/<a\b[^>]*href\s*=\s*["']tel:[^>]*>/gi) ?? [];
    const stickyOnTelAnchor = anchorTags.some(
      (tag) => stickyPattern.test(tag) || /class\s*=\s*["'][^"']*(sticky|fixed|call-now|tap-to-call)[^"']*["']/i.test(tag),
    );
    const stickyInStyle = /position\s*:\s*(sticky|fixed)/i.test(html);
    const stickyMarkerFound = stickyOnTelAnchor || (hasTel && stickyInStyle);
    if (stickyOnTelAnchor) evidence.push("tel: anchor carries a sticky/fixed marker");
    else if (hasTel && stickyInStyle) evidence.push("page CSS contains sticky/fixed positioning");
    else if (hasTel) evidence.push("no sticky/fixed marker found near tel: link");
    evidence.push(`checked at mobile viewport width ${viewportWidth}px (static heuristic)`);

    const verdict = !hasTel ? "fail" : stickyMarkerFound ? "pass" : "fail";
    return {
      url,
      finalUrl,
      reachable: true,
      hasTel,
      telCount,
      stickyMarkerFound,
      verdict,
      evidence,
      note: "Static-HTML heuristic: true thumb-zone placement needs a rendered check. Treat 'fail' as 'needs human confirmation', not proof.",
    };
  },
  toModelOutput(output) {
    if (!output.reachable) {
      return { type: "text", value: `Call-CTA check inconclusive for ${output.url}: ${output.evidence.join("; ")}` };
    }
    return {
      type: "text",
      value: `Call-CTA check ${output.verdict} for ${output.url}: ${output.telCount} tel: link(s), sticky marker ${output.stickyMarkerFound ? "found" : "not found"}. ${output.note}`,
    };
  },
});
