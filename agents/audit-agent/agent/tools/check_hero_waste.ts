import { defineTool } from "eve/tools";
import { z } from "zod";
import { fetchPublicHtml } from "../lib/safe_fetch.js";

const outputSchema = z.object({
  url: z.string(),
  finalUrl: z.string().nullable(),
  reachable: z.boolean(),
  sliderSignals: z.number(),
  carouselLibrary: z.string().nullable(),
  heroVideoAutoplay: z.boolean(),
  phoneInHero: z.boolean(),
  proofInHero: z.boolean(),
  vagueSloganHits: z.array(z.string()),
  verdict: z.enum(["pass", "fail", "inconclusive"]),
  evidence: z.array(z.string()),
  note: z.string(),
});

type Output = z.infer<typeof outputSchema>;

const CAROUSEL_LIBS = ["swiper", "slick", "owl-carousel", "glide", "splide", "flickity", "bootstrap carousel", "rev_slider", "smartslider", "metaslider", "soliloquy"];

const VAGUE_SLOGANS = [
  "excellence in every",
  "best in class",
  "world class",
  "welcome to our website",
  "your trusted partner in excellence",
  "synergy",
];

export default defineTool({
  description:
    "Check a public business URL for the award-website trap: hero sliders, autoplay video backgrounds, vague slogans, and missing phone/proof above the fold. Read-only static-HTML heuristic, never executes site scripts.",
  inputSchema: z.object({
    url: z.string().url().describe("Public http(s) URL of the page to check."),
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
        sliderSignals: 0,
        carouselLibrary: null,
        heroVideoAutoplay: false,
        phoneInHero: false,
        proofInHero: false,
        vagueSloganHits: [],
        verdict: "inconclusive",
        evidence: [`fetch failed for ${url}: ${message}`],
        note: "Page could not be fetched safely; report as inconclusive, not as a failure of the business.",
      };
    }

    const lower = html.toLowerCase();
    const evidence: string[] = [];

    // Carousel library references anywhere in the document.
    const carouselLibrary = CAROUSEL_LIBS.find((lib) => lower.includes(lib)) ?? null;

    // Slide markers: classes/ids containing slide/carousel-cell, plus swiper/slick slide divs.
    const slideMarks =
      html.match(/class\s*=\s*["'][^"']*\b(slide|slides|carousel-cell|swiper-slide|slick-slide)\b[^"']*["']/gi) ?? [];
    const sliderSignals = slideMarks.length + (carouselLibrary ? 1 : 0);
    evidence.push(
      sliderSignals > 0
        ? `found ${slideMarks.length} slide marker(s)${carouselLibrary ? ` + carousel library ref (${carouselLibrary})` : ""}`
        : "no slider/carousel markers found",
    );

    // Autoplay hero video: <video autoplay> in the first fifth of the document.
    const head = html.slice(0, Math.floor(html.length / 5));
    const heroVideoAutoplay = /<video\b[^>]*\bautoplay/gi.test(head);
    evidence.push(heroVideoAutoplay ? "autoplay <video> present in hero region" : "no autoplay hero video detected");

    // Phone and proof above the fold, approximated by early-document position.
    const heroSlice = html.slice(0, Math.floor(html.length * 0.15));
    const proofSlice = html.slice(0, Math.floor(html.length * 0.3));
    const phoneInHero = /href\s*=\s*["']tel:/i.test(heroSlice) || /\(\d{3}\)\s*\d{3}[-.]\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b/.test(
      heroSlice.replace(/<[^>]*>/g, " "),
    );
    evidence.push(phoneInHero ? "phone number present in hero region" : "no phone number in hero region");
    const proofInHero =
      /review|rating|\bstars?\b|google.{0,20}(rating|\breview)|trustpilot|bbb\b/i.test(proofSlice.replace(/<[^>]*>/g, " ")) &&
      /\d(\.\d)?\s*(\/|out of)\s*5|\(\d+\s*reviews?\)|\d+\s*(five-star|google)\s*reviews?/i.test(proofSlice.replace(/<[^>]*>/g, " "));
    evidence.push(proofInHero ? "review proof present near hero" : "no review proof near hero");

    // Vague slogan scan on visible hero text.
    const heroText = heroSlice.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]*>/g, " ").toLowerCase();
    const vagueSloganHits = VAGUE_SLOGANS.filter((slogan) => heroText.includes(slogan));
    evidence.push(
      vagueSloganHits.length > 0 ? `vague slogan phrase(s): ${vagueSloganHits.join("; ")}` : "no known vague-slogan phrases in hero",
    );

    const sliderWaste = sliderSignals >= 3 || (carouselLibrary !== null && slideMarks.length >= 2);
    const verdict = sliderWaste || (heroVideoAutoplay && !phoneInHero) ? "fail" : phoneInHero && proofInHero && !sliderWaste && !heroVideoAutoplay ? "pass" : "fail";
    if (verdict === "fail" && !sliderWaste && !heroVideoAutoplay) {
      evidence.push("hero hides phone or proof without a clear above-the-fold call path");
    }

    return {
      url,
      finalUrl,
      reachable: true,
      sliderSignals,
      carouselLibrary,
      heroVideoAutoplay,
      phoneInHero,
      proofInHero,
      vagueSloganHits,
      verdict,
      evidence,
      note: "Static-HTML heuristic: true fold position needs a rendered check. Treat 'fail' as 'needs human confirmation', not proof.",
    };
  },
  toModelOutput(output) {
    if (!output.reachable) {
      return { type: "text", value: `Hero check inconclusive for ${output.url}: ${output.evidence.join("; ")}` };
    }
    return {
      type: "text",
      value: `Hero check ${output.verdict} for ${output.url}: ${output.evidence.join("; ")}. ${output.note}`,
    };
  },
});
