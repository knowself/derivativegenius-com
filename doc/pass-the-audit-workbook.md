# Pass-the-Audit Workbook — 0 Fails on the Book's 5-Minute Self-Audit

**Goal:** every check in `/book#audit` passes with margin ("flying colors"), so the site itself is the proof of Ch. 5.
**Baseline (2026-09-05):** 0 confirmed fails · 1 partial (hero proof strip) · 2 unknowns (ad routing, GBP health).
**Canonical audit:** `src/app/book/page.tsx` → `#audit`. If the audit wording changes there, re-score here.

## Scorecard

| # | Check | Baseline | Target |
|---|-------|----------|--------|
| 1 | Ads/search go to one problem page, not homepage | ⚠️ Unknown (routing lives in Google Ads, not the repo) | ✅ Every ad group → matching problem page |
| 2 | Sticky tap-to-call on mobile, no menu hunting | ✅ Pass (`src/components/MobileBottomBar.tsx:36-47`) | ✅ Hold + verify on real devices |
| 3 | Hero: no slider, reviews + phone visible | ⚠️ Partial (phone ✅, no slider ✅, reviews ❌) | ✅ Proof strip in hero |
| 4 | GBP: 20+ reviews, 1-stars answered, owner replies, fresh photos | ⚠️ Unknown (not verifiable from code) | ✅ 20+ reviews, 100% reply rate, weekly photos |
| 5 | Content lives on our domain, not just social | ✅ Pass (`/articles`, `/book`, newsletter) | ✅ Weekly cadence + syndication + schema |

---

## Check 1 — One problem page per ad (owner: ads console, not code)

**Evidence:** focused pages already exist — `/services/websites`, `/services`, `/solutions`, `/book`, `/contact`. The repo cannot confirm where paid clicks land.
- [ ] Inventory every active ad group in Google Ads; record final URL for each.
- [ ] Map each ad to its matching problem page. Rule: ad promising X must land on the page that solves X with video + proof + tap-to-call (book Ch. 5 formula).
- [ ] Any ad pointing at `/` (homepage) gets repointed or gets a new problem page built for it.
- [ ] Add agitation + "Watch my video" framing to ad copy per `src/app/book/page.tsx#ch-5`.
- [ ] **Verify:** click every ad (or use final-URL report) — 0 ads resolve to `/`.

## Check 2 — Sticky tap-to-call (already passing, hold it)

**Evidence:** `src/components/MobileBottomBar.tsx:36-47` — fixed bottom bar, mobile-only (`md:hidden`), 1-tap `tel:+13103799822`, 48px targets. `src/app/layout.tsx` reserves space (`pb-16 md:pb-0`).
- [ ] Test on real iOS Safari (safe-area notch) + Android Chrome: bar visible, call button one tap, nothing important covered.
- [ ] Confirm the bar never appears on desktop breakpoints.
- [ ] **Verify:** cold-load any page on a phone → call button reachable in the thumb zone within 3 seconds, no menu hunting.

## Check 3 — Hero proof strip (the one code gap — fix first)

**Evidence:** `src/app/page.tsx:88-141` — no slider in hero ✅, phone CTA ✅, Free Book banner ✅, but **zero reviews/stars/social proof** in the hero. The "Customer Examples & Proof" section further down has text cards only (no ratings). The book's own site fails its own Ch. 5 proof-strip rule.
- [ ] Add a compact proof strip directly under the hero CTAs (before/after the book banner): Google star rating + review count + 1-line client quote. Reuse the existing "Customer Examples" quotes as source material.
- [ ] Link the strip to the GBP listing (target `_blank`, like the `LocalInternetPresence.com` links on `/book`).
- [ ] Once real Google numbers are known (Check 4), add `AggregateRating` JSON-LD on `/` matching the visible stars exactly (never fake the count).
- [ ] Keep the carousel below the hero — do not move sliders back above the fold.
- [ ] **Verify:** 3-second mobile test — headline + phone + stars all visible without scrolling; desktop screenshot archived in this doc's PR.

## Check 4 — GBP health (external, highest leverage per the book)

**Evidence:** none in repo — must be checked by hand in Google Business Profile / Maps.
- [ ] Claim + verify the profile; confirm category, hours, service area, and phone match the site footer/contact page character-for-character (NAP).
- [ ] Count reviews. If < 20: start the review engine — ask every satisfied client, link the ask to a moment of delight (project launch, audit delivery). Target 20, then 30+ (matches `src/lib/prospecting/scoring.ts` 30+ rule we apply to prospects — eat our own cooking).
- [ ] Reply to 100% of reviews, including every 1-star (public, calm, specific). Target: zero unanswered negatives.
- [ ] Upload fresh job/site photos weekly; add a GBP post per published article (`/articles`) or book chapter.
- [ ] **Verify:** re-run `src/app/book/page.tsx#audit` Q4 literally — 20+ reviews, no unanswered 1-stars, owner replies everywhere, photos < 7 days old.

## Check 5 — Owned-domain content (passing, compound it)

**Evidence:** `/articles` (2 posts), `/book` (full text), `Newsletter` component on home + articles. No podcast/RSS yet.
- [ ] Set a weekly publishing cadence: one customer-question post (150-word answer + 3 bullets + 3-Q FAQ, per book Ch. 9 template).
- [ ] Add FAQ/Article JSON-LD schema to article pages; confirm posts are indexed (`site:` search).
- [ ] Stand up a podcast RSS feed from the same 3-minute voice memos; syndicate to Apple/Spotify/YouTube for the backlinks (book Ch. 9).
- [ ] Cross-link: each post → relevant book chapter; book chapters → audit/contact CTAs (already partially done).
- [ ] **Verify:** 0 announcements living only on social; every claim on social links back to a domain URL.

---

## Bonus — flying-colors items beyond the 5 checks

- [ ] **Missing sitemap:** `src/app/robots.ts` advertises `/sitemap.xml` but no `src/app/sitemap.ts` exists → crawlers hit a 404. Add the route (include `/book`).
- [ ] **NAP consistency sweep:** footer phone/email/address vs GBP vs contact page — one source of truth.
- [ ] **Core Web Vitals:** hero LCP on mid-tier Android; the audit's "3 seconds to trust" assumes the page actually loads in ~3 seconds.
- [ ] **OG/social cards:** `/book` + `/services/websites` need share images so borrowed traffic looks credible.

## Execution order

1. **Phase 0 (no code):** Checks 1 + 4 inventory — read-only pass over Google Ads + GBP. Record numbers below.
2. **Phase 1 (code):** Check 3 hero proof strip + bonus sitemap. Smallest diff, most visible.
3. **Phase 2 (habit):** Check 4 remediation + review engine running; Check 5 cadence starts.
4. **Phase 3 (ads):** Check 1 repointing once problem pages cover every ad group.
5. **Re-audit:** score all five checks from the live site + a stranger's phone. Target: 0 fails. Log the date + score below.

## Audit log

| Date | Score | Notes |
|------|-------|-------|
| 2026-09-05 | 0 fail · 1 partial (#3) · 2 unknown (#1, #4) | Baseline from repo + code evidence. |
