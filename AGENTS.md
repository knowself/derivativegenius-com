<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack constraint (repository policy)

Node.js + Next.js only. Never propose, scaffold, or add Python, Django, FastAPI, Flask, Celery, Vue, or Firebase runtimes, backends, or dependencies. Backend work belongs in Next.js Route Handlers and server actions with Drizzle ORM + Neon PostgreSQL. (Historical removal record lives in `doc/migration-audit.md`; do not reintroduce what it removed.) Internet Computer (ICP) canisters, ICP Ninja, Motoko/Rust-on-ICP, and caffeine.ai are banned everywhere, permanently, per founder decision 2026-09-13 (reverses EX-2026-09-08-01). Zero exceptions.

---

# Derivative Genius Canonical Context (synced 2026-09-13)

**Purpose:** This section is the portable source of truth for any AI coding
platform (Claude Code, Cursor, Copilot, Windsurf, etc.) working on Derivative
Genius or VoiceGeni.us code. It is a distilled sync of the founder's Empire OS
document. If anything here conflicts with an older prompt, doc, or memory,
**this section wins** — check its "Last synced" date against the Empire OS first.

**Last synced:** 2026-09-13, from the full reconciliation rewrite of
`DerivativeGenius_Empire_OS` (Sections 1, 2, 4, 6, 7, 11).

**Source documents (do not deviate without a new founder Decision Log entry):**
`The-Mission.md` (v3.2, EX-2026-09-08-01 SUPERSEDED — see ban below),
`current-development-targets.md`,
`Website-Prospecting-System-Plan.md`, `lessons-of-localinternetpresence.md`,
`the-first-priority.md` — all founder-supplied, dated 2026-08-17 through
2026-09-08.

---

## 1. Company Context

- **Derivative Genius** (derivativegenius.com) is the primary company: an
  AI-native web development agency building "smart digital employees" —
  embedded AI assistants, semantic search, autonomous workflows — replacing
  static brochure websites, for local service businesses, real estate,
  insurance, e-commerce, and professional-services clients.
- Derivative Genius also runs a **local SEO / lead-generation offer** (fast
  landing pages, local presence engines, free website/ad audits) for service
  businesses that want more calls and booked jobs.
- **VoiceGeni.us** — a programmable AI voice agent platform for
  tradies/HVAC/home-service businesses — is an early-stage **portfolio
  venture inside Derivative Genius**, not a separate primary company, unless
  the founder documents otherwise in the Decision Log.
- Founder/operator: Joe Terry.

---

## 2. Non-Negotiable Technical Stack

- **Next.js 16 (App Router) + TypeScript**
- **Clerk** for authentication
- **Neon Postgres** — the system of record for all PII, consent,
  suppressions, and revenue data
- **Drizzle ORM**
- **Zod** validation on every API route
- Deployment: **Vercel only**, for every agent and every app, current or future

### Permanently banned technology
- Python, Django, FastAPI, Flask, Celery, Vue, Firebase (migration to the
  stack above completed 2026-08-17 — never reintroduce these)
- **Internet Computer (ICP) canisters, ICP Ninja, Motoko/Rust-on-ICP, and
  caffeine.ai — banned everywhere, permanently, as of the founder's
  2026-09-13 decision.** This reverses a prior stack exception
  (EX-2026-09-08-01) that had authorized four ICP canisters
  (proof-anchor, deai-assist, deliverable-vault, pay-rail-pilot). That
  exception is dead. If you see any reference to those canisters or ICP in
  older docs, treat it as superseded — rebuild that functionality on the
  Next.js/Neon stack instead. Do not suggest, scaffold, or write any code
  targeting ICP or caffeine.ai under any circumstance.

---

## 3. /centurion Operator Platform — Architecture

- Private operator app behind auth — **not** a public directory. Public
  routes (`/services/websites`, `/website-audit`, `/case-studies`) must never
  expose prospect data, scores, call history, or proposal details.
- **Roles:** `centurion_admin` (full access, exports, compliance, deletion),
  `prospector` (discover/import/research/score/call/audit/opportunities),
  `customer` (own portal only), `viewer` (no access until granted).
- **Core modules:** Target Market Builder, Business Discovery,
  Deduplication, Website Inspection, Lead Scoring, Decision-Maker
  Enrichment, Personalized Audit Builder, Outreach Queue (manual only),
  Sales Pipeline, Compliance Center (DNC/suppressions/consent/export logs).
- **MVP scope explicitly excludes:** automated cold texting, AI-voice or
  prerecorded calls, autonomous email sequencing, automated audit
  publishing.

## 4. Eve Agent Fleet — Build Engine

Absolute rule: **agents prepare, draft, and surface; humans approve and
send.** No exceptions.

- **Built today:** `audit-agent` (read-only website auditor — hero waste,
  mobile call CTA, owned content, evidence scoring, SSRF-safe fetch) and
  `optio-centuriae` (orchestrator chaining founder → Optio → specialist
  agents).
- **Fleet build order:** 1) harden audit-agent, 2) followup-drafter,
  3) vsl-assembler, 4) content-factory, 5) gbp-rescue + jingle-writer,
  6) city-cloner.
- **Never-build list:** cold-sequence agents, cold-text agents, cold-call
  agents, AI-voice-call agents, bulk-blast agents of any kind.
- **Ship gate**, in order: type-check clean → eval suite passes (including
  adversarial cases) → root lint/test/build gates pass → signed-in
  disposable-data walkthrough → deploy → rollback tagged by git SHA.

---

## 5. Current Development Targets (DT Tracker)

Source of truth: `current-development-targets.md` (baseline reset
2026-08-07, last updated 2026-09-07). **Update this section whenever a DT
changes status — do not let it drift from the engineering record.**
Operating rule: no more than 2 targets "In progress" at once.

| DT | Priority | Title | Status | Notes |
|----|----------|-------|--------|-------|
| DT-18 | P0 | Run 25-company founder-led manual outreach pilot | **In progress** | Vertical = HVAC; geography = Lake County, CA. Dual offer: VSL Sprint $1,500–$2,500 fixed, or Growth Retainer $300–$500/mo. Proceeds regardless of DT-19 — "software never delays market contact." |
| DT-19 | P0 | Complete /centurion pilot readiness | **In review** | Schema pushed, lint/tsc/tests/build all passing. Blocked only on Joe's signed-in end-to-end readiness test (campaign creation through proposal retrieval). |
| DT-20 | P0 | Add permission-tracked followup queue | Not started | Depends on DT-19 readiness verification. Explicitly excludes cold sequences, auto-texts, auto-calls, AI-voice, bulk-send, and timers. |
| DT-21 | P1 | Build VSL Demo Assembler (Slice 1, no keys) | Not started | Depends on DT-20 permission basis. Slice 1 excludes paid TTS/jingle-synthesis tools and any external API keys. |
| DT-01 | — | Define/approve AI-first web dev & local presence offerings | In progress | Pricing tiers locked — see Section 6. |
| DT-02–DT-17 | — | Earlier platform/stack/Centurion-Phase-1 targets | Mostly Complete/In review | DT-05 (quality/CI gates) and DT-12/13/15/16 Complete; DT-17 (Centurion Phase 1) and DT-14 In review; a few remain In progress/Not started/Blocked — see `current-development-targets.md` for the full table. |

**The next best action (as of 2026-09-13):** Complete Joe's signed-in DT-19
readiness test so /centurion can absorb DT-18 pipeline tracking, while
manual DT-18 outreach continues in parallel.

---

## 6. Pricing (current-development-targets.md / The-Mission.md)

| Offer | Price | Scope |
|-------|-------|-------|
| VSL Sprint (Option A) | $1,500–$2,500 fixed | One-problem video sales letter landing page, 10-day sprint |
| Core Retainer (Option B) | $300/month | Ongoing GBP/website management and reporting, no ad spend |
| Growth Retainer (Option B, full-service) | $500/month + client ad spend | GBP rescue, content, jingle/video assets, ad management, reporting |
| Fixed-scope website | $2,000–5,000 | Standalone site build, outside retainer/VSL motion |
| MVP Web App Sprint | $2,500–5,000+ | Custom AI-native app work outside the productized local offer |

---

## 7. ICP (Ideal Customer Profile) — Vertical Priority

**Note on terminology:** "ICP" here means *Ideal Customer Profile*
(marketing/sales term) — unrelated to the banned Internet Computer
Protocol blockchain platform in Section 2. Both use the same acronym; do
not confuse them.

Locked per `current-development-targets.md` (2026-09-07) and
`The-Mission.md` §6 — not a hypothetical wedge; DT-18 outreach is in
progress against this exact list.

| Priority | Segment | Buying Signal | Avoid / Disqualify |
|----------|---------|----------------|---------------------|
| 1 (DT-18 active) | HVAC — Lake County, CA (Clearlake, Lakeport, Kelseyville, Middletown, Lower Lake, Nice, Lucerne) | Missed calls, delayed estimates, weak GBP/website, no structured intake | Complex multi-location enterprise; outside Lake County during DT-18 |
| 2 | Plumbing | Same as above | Same as above |
| 3 | Roofing | Same as above | Same as above |
| 4 | Electrical | Same as above | Same as above |
| 5 | Pest control | Same as above | Same as above |
| 6 | Tree service | Same as above | Same as above |
| 7 | Restoration | Same as above | Same as above |
| 8 | Remodeling | Same as above | Same as above |
| 9 | Dental | Repeated intake/scheduling questions, weak online booking | Regulated workflow without expert oversight |
| 10 | Med spa | Same as above | Same as above |
| 11 | Legal | Same as above | Same as above |

### Lead Scoring Model
| Signal | Points |
|--------|--------|
| Customer lifetime value > $1,000 | 20 |
| Weak website with a specific, nameable issue | 20 |
| 30+ Google reviews | 15 |
| Clear, reachable decision-maker (owner-operator) | 10 |
| Multiple locations | 10 |
| Currently running paid ads | 10 |
| Weak or missing booking/scheduling flow | 10 |
| Recent growth trigger (hiring, new location, funding) | 5 |

Score bands: **75–100** priority outreach · **60–74** qualified/nurture ·
**40–59** research only, no outreach yet · **<40** exclude.

---

## 8. $150M ARR Math (founder planning target, not a forecast)

~27,000 retainer locations (~20,000 Growth Retainer @ $500/mo + ~7,000 Core
Retainer @ $300/mo) across ~270 cities, reached via 5 phases:
**A** (home chamber) → **B** (home city) → **C** (5-city network) →
**D** (30-city network) → **E** (270-city network). All dollar figures in
this file are the founder's own planning targets/scenarios, not verified
company financials — never present them as actuals.

---

## 9. Decision Log Entries Relevant to Engineering (2026-09-13)

1. **Adopted** the five founder-supplied documents as the new source of
   truth for mission, ICP, product architecture, and build status —
   superseding the earlier generic "AI Lead Recovery Service" rollout
   framing wherever the two differ.
2. **Rejected all future use of Internet Computer (ICP) canisters, ICP
   Ninja, and caffeine.ai** across every Derivative Genius system,
   including /centurion and every Eve agent — reverses stack exception
   EX-2026-09-08-01. No new technical evidence was cited for the
   reversal; it is a founder decision and is absolute until a new,
   separately documented founder decision reverses it again.

---

## 10. Hard Rules for Any AI Agent Working on This Codebase

1. Never write, scaffold, or suggest code targeting ICP canisters,
   Motoko, Rust-on-ICP, or caffeine.ai. Zero exceptions.
2. Never write cold-sequence, cold-text, cold-call, AI-voice-call, or
   bulk-blast agent logic (never-build list, Section 4).
3. Never bypass the ship gate (type-check → eval suite → lint/test/build →
   signed-in walkthrough → deploy → rollback tag) for agent changes.
4. Never invent customer, revenue, or metrics data. Use `[TBD]` where the
   founder hasn't supplied a real number — see Empire OS Operating Rule 3.
5. Do not send external communications, publish content, modify production
   systems, or make purchases without explicit founder approval (Empire OS
   Operating Rule 7).
6. If a change conflicts with anything in this file, stop and flag it
   rather than silently deviating — this file only changes when the
   founder logs a new Decision Log entry in the Empire OS.

---

## Keeping This File in Sync

This section is generated from the Derivative Genius Empire OS document,
maintained in the "Derivative Genius Empire OS" Perplexity project. When a
reconciliation or strategy update happens there, request a refreshed
sync and re-copy it into every repo/platform that needs it
(Claude Code, Cursor, or any other tool that reads a root-level agents
file). There is currently no automated push — treat the copy in the
Empire OS project's `docs/` folder as canonical, and this project's
`AGENTS.md` as the copy of record to sync out from. (Merged here from the
separate `AGENTS.md — AI Platform Sync.md` drop on 2026-09-14; that
separate file is removed to keep one copy of record.)
