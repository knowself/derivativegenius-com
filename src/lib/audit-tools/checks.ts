import 'server-only';

import { fetchPublicHtml } from './safe_fetch';

export type Verdict = 'pass' | 'fail' | 'inconclusive';

export interface CallCtaResult {
  url: string;
  finalUrl: string | null;
  reachable: boolean;
  hasTel: boolean;
  telCount: number;
  stickyMarkerFound: boolean;
  verdict: Verdict;
  evidence: string[];
  note: string;
}

export interface HeroResult {
  url: string;
  finalUrl: string | null;
  reachable: boolean;
  sliderSignals: number;
  carouselLibrary: string | null;
  heroVideoAutoplay: boolean;
  phoneInHero: boolean;
  proofInHero: boolean;
  vagueSloganHits: string[];
  verdict: Verdict;
  evidence: string[];
  note: string;
}

export interface OwnedContentResult {
  url: string;
  finalUrl: string | null;
  reachable: boolean;
  hasSitemap: boolean;
  hasBlogOrArticles: boolean;
  hasRssOrPodcast: boolean;
  socialOnlySignals: number;
  verdict: Verdict;
  evidence: string[];
  note: string;
}

const CAROUSEL_LIBS = [
  'swiper', 'slick', 'owl-carousel', 'glide', 'splide', 'flickity',
  'bootstrap carousel', 'rev_slider', 'smartslider', 'metaslider', 'soliloquy',
];

const VAGUE_SLOGANS = [
  'excellence in every',
  'best in class',
  'world class',
  'welcome to our website',
  'your trusted partner in excellence',
  'synergy',
];

function originOf(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
}

export async function checkMobileCallCta(url: string, viewportWidth = 390): Promise<CallCtaResult> {
  let finalUrl: string;
  let html: string;
  try {
    ({ finalUrl, html } = await fetchPublicHtml(url));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      url, finalUrl: null, reachable: false, hasTel: false, telCount: 0,
      stickyMarkerFound: false, verdict: 'inconclusive',
      evidence: [`fetch failed for ${url}: ${message}`],
      note: 'Page could not be fetched safely; report as inconclusive, not as a failure of the business.',
    };
  }

  const telMatches = html.match(/href\s*=\s*["']tel:[^"']*["']/gi) ?? [];
  const telCount = telMatches.length;
  const hasTel = telCount > 0;
  const evidence: string[] = [hasTel ? `found ${telCount} tel: link(s)` : 'no tel: link found in HTML'];

  const stickyPattern = /sticky|position\s*:\s*(sticky|fixed)/i;
  const anchorTags = html.match(/<a\b[^>]*href\s*=\s*["']tel:[^>]*>/gi) ?? [];
  const stickyOnTelAnchor = anchorTags.some(
    (tag) => stickyPattern.test(tag) || /class\s*=\s*["'][^"']*(sticky|fixed|call-now|tap-to-call)[^"']*["']/i.test(tag),
  );
  const stickyInStyle = /position\s*:\s*(sticky|fixed)/i.test(html);
  const stickyMarkerFound = stickyOnTelAnchor || (hasTel && stickyInStyle);
  if (stickyOnTelAnchor) evidence.push('tel: anchor carries a sticky/fixed marker');
  else if (hasTel && stickyInStyle) evidence.push('page CSS contains sticky/fixed positioning');
  else if (hasTel) evidence.push('no sticky/fixed marker found near tel: link');
  evidence.push(`checked at mobile viewport width ${viewportWidth}px (static heuristic)`);

  return {
    url, finalUrl, reachable: true, hasTel, telCount, stickyMarkerFound,
    verdict: !hasTel ? 'fail' : stickyMarkerFound ? 'pass' : 'fail',
    evidence,
    note: 'Static-HTML heuristic: true thumb-zone placement needs a rendered check. Treat fail as needs human confirmation, not proof.',
  };
}

export async function checkHeroWaste(url: string): Promise<HeroResult> {
  let finalUrl: string;
  let html: string;
  try {
    ({ finalUrl, html } = await fetchPublicHtml(url));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      url, finalUrl: null, reachable: false, sliderSignals: 0, carouselLibrary: null,
      heroVideoAutoplay: false, phoneInHero: false, proofInHero: false, vagueSloganHits: [],
      verdict: 'inconclusive', evidence: [`fetch failed for ${url}: ${message}`],
      note: 'Page could not be fetched safely; report as inconclusive, not as a failure of the business.',
    };
  }

  const lower = html.toLowerCase();
  const evidence: string[] = [];
  const carouselLibrary = CAROUSEL_LIBS.find((lib) => lower.includes(lib)) ?? null;
  const slideMarks =
    html.match(/class\s*=\s*["'][^"']*\b(slide|slides|carousel-cell|swiper-slide|slick-slide)\b[^"']*["']/gi) ?? [];
  const sliderSignals = slideMarks.length + (carouselLibrary ? 1 : 0);
  evidence.push(
    sliderSignals > 0
      ? `found ${slideMarks.length} slide marker(s)${carouselLibrary ? ` + carousel library ref (${carouselLibrary})` : ''}`
      : 'no slider/carousel markers found',
  );

  const head = html.slice(0, Math.floor(html.length / 5));
  const heroVideoAutoplay = /<video\b[^>]*\bautoplay/gi.test(head);
  evidence.push(heroVideoAutoplay ? 'autoplay <video> present in hero region' : 'no autoplay hero video detected');

  const heroSlice = html.slice(0, Math.floor(html.length * 0.15));
  const proofSlice = html.slice(0, Math.floor(html.length * 0.3));
  const phoneInHero =
    /href\s*=\s*["']tel:/i.test(heroSlice) ||
    /\(\d{3}\)\s*\d{3}[-.]\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b/.test(heroSlice.replace(/<[^>]*>/g, ' '));
  evidence.push(phoneInHero ? 'phone number present in hero region' : 'no phone number in hero region');
  const proofInHero =
    /review|rating|\bstars?\b|google.{0,20}(rating|\breview)|trustpilot|bbb\b/i.test(proofSlice.replace(/<[^>]*>/g, ' ')) &&
    /\d(\.\d)?\s*(\/|out of)\s*5|\(\d+\s*reviews?\)|\d+\s*(five-star|google)\s*reviews?/i.test(
      proofSlice.replace(/<[^>]*>/g, ' '),
    );
  evidence.push(proofInHero ? 'review proof present near hero' : 'no review proof near hero');

  const heroText = heroSlice
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase();
  const vagueSloganHits = VAGUE_SLOGANS.filter((slogan) => heroText.includes(slogan));
  evidence.push(
    vagueSloganHits.length > 0 ? `vague slogan phrase(s): ${vagueSloganHits.join('; ')}` : 'no known vague-slogan phrases in hero',
  );

  const sliderWaste = sliderSignals >= 3 || (carouselLibrary !== null && slideMarks.length >= 2);
  const verdict =
    sliderWaste || (heroVideoAutoplay && !phoneInHero)
      ? 'fail'
      : phoneInHero && proofInHero && !sliderWaste && !heroVideoAutoplay
        ? 'pass'
        : 'fail';
  if (verdict === 'fail' && !sliderWaste && !heroVideoAutoplay) {
    evidence.push('hero hides phone or proof without a clear above-the-fold call path');
  }

  return {
    url, finalUrl, reachable: true, sliderSignals, carouselLibrary, heroVideoAutoplay,
    phoneInHero, proofInHero, vagueSloganHits, verdict, evidence,
    note: 'Static-HTML heuristic: true fold position needs a rendered check. Treat fail as needs human confirmation, not proof.',
  };
}

export async function checkOwnedContent(url: string): Promise<OwnedContentResult> {
  let finalUrl: string;
  let html: string;
  try {
    ({ finalUrl, html } = await fetchPublicHtml(url));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      url, finalUrl: null, reachable: false, hasSitemap: false, hasBlogOrArticles: false,
      hasRssOrPodcast: false, socialOnlySignals: 0, verdict: 'inconclusive',
      evidence: [`fetch failed for ${url}: ${message}`],
      note: 'Page could not be fetched safely; report as inconclusive, not as a failure of the business.',
    };
  }

  const evidence: string[] = [];
  const origin = originOf(finalUrl);

  let hasSitemap = false;
  for (const path of ['/sitemap.xml', '/sitemap_index.xml']) {
    try {
      const { html: sm } = await fetchPublicHtml(origin + path);
      if (sm.includes('<url') || sm.includes('<sitemap')) {
        hasSitemap = true;
        evidence.push(`sitemap found at ${path}`);
        break;
      }
    } catch {
      // Absent sitemap file is a signal, not an error.
    }
  }
  if (!hasSitemap) evidence.push('no sitemap.xml found');

  const internalBlogLinks =
    html.match(/href\s*=\s*["'](\/(blog|articles|news|insights|resources)[^"']*|https?:[^"']*\/(blog|articles|news)[^"']*)["']/gi) ?? [];
  const hasBlogOrArticles = internalBlogLinks.length > 0;
  evidence.push(hasBlogOrArticles ? `found ${internalBlogLinks.length} blog/article link(s)` : 'no blog/article links found');

  const hasRssOrPodcast =
    /<link\b[^>]*type\s*=\s*["']application\/(rss|atom)\+xml["']/i.test(html) ||
    /href\s*=\s*["'][^"']*\/(feed|rss|podcast)(\.xml)?["']/i.test(html);
  evidence.push(hasRssOrPodcast ? 'RSS/podcast feed reference found' : 'no RSS/podcast feed reference found');

  const socialLinks =
    html.match(/href\s*=\s*["']https?:\/\/(www\.)?(facebook|instagram|tiktok|twitter|x)\.com[^"']*["']/gi) ?? [];
  const socialOnlySignals = socialLinks.length;
  if (socialOnlySignals > 0) evidence.push(`${socialOnlySignals} social profile link(s) found`);

  const ownedSignals = [hasSitemap, hasBlogOrArticles, hasRssOrPodcast].filter(Boolean).length;
  const verdict = ownedSignals >= 2 ? 'pass' : 'fail';
  if (verdict === 'fail' && ownedSignals > 0) {
    evidence.push('some owned content exists but coverage is thin (fewer than 2 signals)');
  }

  return {
    url, finalUrl, reachable: true, hasSitemap, hasBlogOrArticles, hasRssOrPodcast,
    socialOnlySignals, verdict, evidence,
    note: 'Presence checks only: a sitemap/blog link existing does not prove the content answers customer questions. Treat fail as needs human confirmation.',
  };
}
