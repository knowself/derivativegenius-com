# Agent Development Plan — Derivative Genius Builds Agents (for Clients and Ourselves)

> Derivative Genius is in the business of building agents — for our clients and for ourselves. We sell, deliver, and operate eve-based agents as a core offering, and we run our own local-presence fulfillment on the same agent platform we deploy for clients.

- **Positioning:** Agent builder. Every engagement ships durable eve agents + the VSL/GEO/jingle system they operate. We eat our own cooking: the internal fleet in this doc is the reference implementation we productize for clients.

- **Organization:** Derivative Genius
- **Operator:** Joe Terry, human Centurion
- **Framework:** eve from Vercel (`eve`, open-source, beta)
- **Source playbook:** Live book at `src/app/book/page.tsx` (`/book`), frozen archive at `doc/localinternetpresence-book.html`, deep analysis at `doc/lessons-of-localinternetpresence.md`
- **Operating instrument:** `/centurion` (private Next.js operator app + Neon Postgres)
- **Public site:** `derivativegenius.com` codebase in this repo (`dg-web`, Next.js 16, React 19, TypeScript, Tailwind v3, Drizzle ORM)
- **Doc type:** Plan + build log + education hub for the agent toolset
- **Status:** Plan — no eve code built yet. No autonomous outreach authorized.
- **Last updated:** 2026-09-06
- **Owner:** Repository maintainer (updates on every agent decision, build, or eval result)

---

## 1. Vision

Derivative Genius builds agents as the product — not as back-office scripts. Two tracks, one platform:

1. **Agents for clients:** scoped, durable eve agents we design, deploy, observe, and maintain (audit agent, GEO publisher, VSL builder, jingle, ad-ops spec, GBP care). Clients buy outcomes (found / remembered / called) delivered by agents with human approval gates.
2. **Agents for ourselves:** the same fleet run internally to fulfill the **$300/mo core / $500/mo growth** promise and to run the DT-18 pilot (audit prep, opener drafts, publish drafts, Monday reporting). Internal use hardens what we sell.

The book reduces all local marketing to three outcomes: **found, remembered, called**.

- **Found:** Map Pack + organic + AI answers (Pillars 1–2).
- **Remembered:** 15-second SERP-term earworm + YouTube living-room saturation (Pillar 4).
- **Called:** One-problem VSL page + sticky tap-to-call + risk-reversal headline (Pillar 3).
- **Trust engine:** In-person audits + plain talk (Pillar 5) and the "brain-to-tongue" content machine (Ch. 9–10).

The agent fleet exists to compress the **$300/mo core / $500/mo growth** fulfillment promise — currently specified as ~15–20 min/client/month of AI-assisted work — into a reliable, auditable, Joe-approved pipeline:

```text
Owner talks 3 min
  -> agents transcribe, draft, voice, mix, publish, syndicate, optimize GBP, assemble VSL, launch pre-rolls
    -> Joe reviews and approves
      -> client replies YES by SMS
        -> calls, rankings, and revenue get measured
```

Agents **expand capability**. Joe supplies **purpose, judgment, and accountability** (`doc/The-Mission.md`). `/centurion` remains the system of record. eve agents are workers that read from and write to it only through approved, suppression-checked tools — they never own relationships, invent claims, or decide volume beats respect.

### What "effortless" means (and does not mean)

- Means for clients: they talk 3 minutes; their agents (built and managed by Derivative Genius) transcribe, draft, voice, publish, syndicate, and prep GBP/VSL/jingle work — client replies YES, Joe's team approves, calls get measured.
- Means for us: one observation per prospect, one audit after interest, four topics per client per month, one VSL per urgent problem, one jingle per SERP term — all drafted by our own agents, approved by Joe in minutes.
- Customer-facing promise: "We build you agents that do the book for you — audit, content, pages, jingles, follow-ups — with you approving, not doing."
- Does not mean: auto-scraping, auto-enrichment at scale, auto cold email/SMS/calls, auto audit blasts, auto ad spend, auto GBP edits, auto publishing under a client's name. Every one of those requires explicit human approval and, during the DT-18 pilot, is forbidden until pilot evidence names a measured bottleneck.

---

## 2. Ground truth — read before building

| Source | What it governs | Path |
|---|---|---|
| Live book | Client-facing playbook, 5 pillars, 4 weapons, traps, proof, audit | `src/app/book/page.tsx` |
| Deep analysis | Cognitive mechanisms, VSL formula, arbitrage math, AI stack (Gemini / ElevenLabs / Suno), unit economics | `doc/lessons-of-localinternetpresence.md` |
| Mission charter | 13 operating doctrines, Centurion role, test for every change | `doc/The-Mission.md` |
| Current targets | DT-19 readiness, DT-18 25-company HVAC pilot (Lake County CA), DT-01 offer, DT-04 anti-agency site, DT-07 SEO/GEO baselines, DT-09 paid onboarding | `doc/current-development-targets.md` |
| Prospecting spec | Roles, dedup, scoring, queue, audit builder, pipeline, compliance, SSRF guards | `doc/Website-Prospecting-System-Plan.md` |
| Transcript | Mike Stewart's voice, phrasing, objections | `doc/mike-stewart-on-thekoerneroffice-transcript.md` |
| Workbook | 5-minute self-audit questions agents must automate read-only | `doc/pass-the-audit-workbook.md` |

Book-to-agent mapping (canonical):

| Book unit | Agent responsibility |
|---|---|
| Ch.2 Pillar 1 — Map & reviews | GBP audit + maintenance drafting, review-reply drafts, photo checklists |
| Ch.2 Pillar 2 — Owned web + GEO | Transcript → blog + FAQ schema + RSS syndication pipeline |
| Ch.2 Pillar 3 — Page + ads match | VSL page assembler (headline, video slot, proof strip, copy, sticky call) + Kennedy ad drafts |
| Ch.2 Pillar 4 — Jingle + YouTube | Lyric + Suno prompt packager, 0–5s anchor checker, geo-only pre-roll spec |
| Ch.2 Pillar 5 — Handshakes | Audit-talk prep, 1-on-1leave-behind, objection handling — never auto-outreach |
| Ch.3 — 15-sec recipe | Jingle validator (anchor ≤5s, SERP term verbatim, nudge at end, no owner slogan bloat) |
| Ch.4 — YouTube loophole | Targeting guard (15–20 mi radius/zips, no micro-filtering), skip-economics explainer |
| Ch.5 — Page that rings | VSL 5-part validator, risk-reversal headline generator, "Watch my video" CTR rule |
| Ch.6 — Two traps | Anti-agency linter (sliders, hamburger-hidden call, social-only content) |
| Ch.7 — Proof | Case-study skill (Abilene, Party Boat, Honey, Mount Lawley, Haynes, Ted Yates) with honest baselines |
| Ch.8 + Appendix A — Audit | Read-only 5-minute self-audit engine (homepage mistake, sticky call, hero waste, GBP void, walled garden) |
| Ch.9 — Extraction | 50-problems worksheet → diagnostic question → 3-min recording checklist → transcript template |
| Ch.10 — AI factory | Monthly SMS YES flow, weekly publish cadence, sample-month planner |

---

## 3. Non-negotiable guardrails

These override any agent convenience. Violating one is a build failure.

1. **Centurion supremacy.** Joe approves audits, outbound messages, GBP writes, ad launches, publishes, and proposals. Agents draft; Joe decides.
2. **Manual pilot first (DT-18 gate).** No scaled discovery, mass enrichment, sequencing, auto audit delivery, AI voice calls, or bulk texting until the 25-company HVAC pilot yields qualified conversations + ≥1 proposal and a dated decision names the bottleneck. This doc may plan those agents but marks them `Deferred — gated`.
3. **Read-only by default.** Website inspection, GBP observation, and scoring are read-only tools. Any write (DB update, file publish, ad API, GBP API, email/SMS send) is a separate tool with `approval: always()` and suppression re-check.
4. **Suppression is central.** Every queue, draft, enrichment, audit-send, or export path re-checks `suppressions` (keyed hashes, never raw PII in logs). `do_not_contact` halts all future work immediately.
5. **Evidence before claims.** Agents never invent traffic, rankings, revenue loss, review counts, or "guaranteed leads." Numbers come from tools or are qualified as estimates. No fabricated case studies.
6. **Privacy by design.** Prospect PII, voice samples, credentials, and raw provider payloads stay server-side in the app runtime, never in model context unless minimized, never in git, never in public bundles. Redact logs. Separate prod/dev data.
7. **Open web before rented land.** Agents publish transcripts, blogs, and RSS on client domains with JSON-LD (`LocalBusiness`, `Service`, `FAQPage`, `VideoObject`, `Review`). Social-only posting is flagged as the walled-garden trap.
8. **Anti-agency linter.** Every page agent output must pass: headline states the problem + risk reversal, proof visible without scroll, sticky `tel:` in mobile thumb zone (≥48px), no hero sliders, no hamburger-hidden call, sub-1s intent to call.
9. **eve is beta.** Pin `eve` version, track breaking changes, treat `https://eve.dev/docs` + `https://github.com/vercel/eve` as truth. Budget for migration.
10. **Smallest responsible step.** One agent, one eval, one approval gate at a time. No fleet big-bang.

---

## 4. eve in five minutes (what the links below teach)

`agent/` **is the agent.** File path = capability name. `agent/tools/get_weather.ts` → tool `get_weather`. `agent/skills/summarize.md` → skill `summarize`. `agent/subagents/researcher/agent.ts` → subagent `researcher`. No separate registration boilerplate.

- **Root agent needs `instructions.md`; `agent.ts` is optional** until you need model, compaction, or experimental config: `defineAgent({ model: "anthropic/claude-opus-4.8" })` or AI Gateway routing.
- **Tools = typed code you control.** `defineTool({ description, inputSchema: z.object(...), execute })` runs in the app runtime with `process.env` access. Use `outputSchema` + `toModelOutput` to give the model a gist while channels keep rich output. Async-generator `yield` streams `action.partial` snapshots; only the final yield enters model history. Gate writes with `approval: always() / once() / never()` or input-dependent policies.
- **Skills = load-on-demand Markdown.** Advertised by `description`, loaded via framework `load_skill`. Flat `forecast.md` or packaged `research/SKILL.md` + `references/`. Keep prompts lean; put procedures in skills, executable behavior in tools.
- **Subagents = isolated specialists.** Declared at `agent/subagents/<id>/` with required `description`, own instructions/tools/skills/sandbox. Parent calls them like tools with `{ message, agentId?, outputSchema? }`; they run as durable background tasks (`{ status: "working", taskId }` + notifications). Built-in root `agent` tool spawns copies of root (shared sandbox/tools); declared subagents inherit nothing — author or mount everything they need. Never rely on delegation alone as an approval boundary.
- **Connections = external MCP/OpenAPI without leaking creds.** `defineMcpClientConnection({ url, auth: { getToken } })`. Model sees discovered tools, never URLs/tokens. Vercel Connect handles OAuth.
- **Sandbox = untrusted code computer.** Per-session filesystem + shell, seeded from `agent/sandbox/workspace/**`, surfaced via `ctx.getSandbox()`. App runtime stays trusted. Locally Docker/microsandbox/just-bash; in prod Vercel Sandbox. Skills materialize under `$HOME/.agents/skills/<skill>/`.
- **Durability = sessions survive crashes.** Session → turn → step. Each step checkpoints via Workflow SDK (local `.eve/.workflow-data`, prod Vercel Workflow). Completed steps replay, interrupted steps re-run — so make charges/emails idempotent or approval-gated. Parked work (approval, OAuth) suspends with zero compute.
- **Schedules = cron files.** `defineSchedule({ cron, run })` or Markdown + `cron` frontmatter. Root-only. On Vercel they become Cron Jobs.
- **Channels = one file per surface.** `eve channels add slack` writes `channels/slack.ts`. HTTP API on by default (`POST /eve/v1/session`, `GET /eve/v1/session/:id/stream`). Sessions move across channels.
- **Memory = provider-backed persistence beyond a session.** Use for client voice profile, SERP term, offer, GBP state — never for secrets.
- **Evals + traces = QA.** `defineEval` in `evals/` with `t.send / t.calledTool / t.check`. `eve eval` locally or against deploy; wire into CI as deploy gate. Every run emits OTel spans (`ai.eve.turn`, `ai.toolCall`) viewable in Agent Runs tab.
- **`eve build` → deployable host; `vercel deploy` ships it.** Same directory runs locally and in prod. Preview deployments carry channels. Roll back instantly on regression.

---

## 5. Where agents live in this repo

`dg-web` today is a Next.js 16 App Router site + `/centurion` operator app. It has **no eve code yet** (`package.json` has no `eve` dep; Node engine is `>=20.19.0 <25` but eve requires **Node 24+**).

Recommended layout — **nested eve apps in a fleet monorepo**, sharing one extension library:

```text
dg-web/
  src/                          # existing Next.js site + /centurion (unchanged)
  agents/                       # NEW — eve fleet (each dir is a deployable eve project)
    optio-centuriae/            # Optio Centuriae — router / dispatcher (root-only schedules + channels)
      package.json              # name, node >=24, deps: eve, ai, zod
      agent/
        agent.ts
        instructions.md
        tools/                  # router tools: centurion_read_* (read-only), handoff writers (approval-gated)
        skills/                 # triage, suppression-check, evidence-rules
        subagents/              # mount points — local or REMOTE agents below
        channels/
        schedules/
        sandbox/
    audit-agent/                # read-only 5-min self-audit + GBP observation
    geo-publisher-agent/        # transcript → blog + FAQ schema + RSS
    vsl-builder-agent/          # VSL page assembler + anti-agency linter
    jingle-agent/               # lyric + Suno prompt packager + anchor validator
    ad-ops-agent/               # Kennedy ad drafts + geo-only pre-roll spec (DEFERRED send/launch)
    gbp-care-agent/             # review-reply drafts + photo checklists (DEFERRED writes)
    outreach-assist-agent/      # opener + objection drafts from audit evidence (DEFERRED auto-send)
    evals/                      # shared eval suites per agent
  extensions/
    dg-book/                    # shared book skills (chapters, audit checklist, case studies)
    dg-centurion/               # shared read-only centurion client + suppression guard
    dg-geo/                     # shared JSON-LD + transcript templates
  .eve/                         # build artifacts, never commit secrets
```

Rules:

- Start with **one eve app** (`agents/audit-agent`) via `npx eve@latest init agents/audit-agent`. Prove local `npm run dev` → session → eval → Vercel preview before adding a second agent.
- Prefer **one orchestrator + remote subagents** over a mega-agent: orchestrator holds channels/schedules/memory routing; specialists hold narrow tools. Mount shared skills via workspace extensions so every agent cites the same book truth.
- To add eve to the existing Next.js app itself (flat layout: `agent.ts`, `tools/`, `skills/` at root) — don't. Keep site and agents separate; connect via HTTP API + least-privilege service tokens, never browser keys.
- Upgrade path: bump `engines` to Node 24 in agent `package.json`s only; leave site engine until Next.js 16 supports it cleanly. Track in DT-08 (reproducible deploy).
- `eve info` debugs file discovery; `.eve/` artifacts are inspectable but git-ignored.

---

## 6. Agent roster (canonical — doubles as our client product catalog)

Each agent below is built once, run twice: internally to fulfill our own pipeline, and as a shippable product we deploy, observe, and maintain for paying clients. When talking to customers, name the agent, the outcome it owns, and the approval gate — "your audit agent finds the flaw, your publisher drafts the post, you approve with YES."

Autonomy levels: `READ-ONLY` (may run now) · `DRAFT` (may draft, human sends/publishes) · `DEFERRED` (planned, gated by DT-18 evidence).

### 6.1 `optio-centuriae` — Optio Centuriae, router / dispatcher (DRAFT)

- **Name:** Optio Centuriae — second-in-command to Joe Terry, the human Centurion. The optio executes the Centurion's intent, routes work to specialists, and never supplants command.
- **Chain of command:** the Centurion manages through the Optio, and the Optio delegates to specialists generally — but the Centurion retains direct command and may give orders to any agent at any time, overriding the Optio.

- **Job:** Accept "client X needs Y" or "prospect P needs audit prep," load the right skill, delegate to exactly one specialist, combine results, request Joe approval for any write.
- **Book mapping:** Ch.8 next-step triage; Mission "judgment before automation."
- **Inputs:** client/prospect id, goal, prior session memory. **Outputs:** plan + delegated result + approval request. Never invents audit findings.
- **Tools:** `route_task` (local), `centurion_read_prospect`, `centurion_read_scores`, `centurion_create_task` (approval-gated), `request_approval` (human-in-loop).
- **Skills:** `triage-playbook`, `evidence-rules` (no invented numbers), `suppression-check`.
- **Subagents:** `audit-agent`, `geo-publisher-agent`, `vsl-builder-agent`, `jingle-agent` (local first; remote after deploy). Max one delegation per turn unless parallel non-overlapping writes.
- **Connections:** none initially (all centurion access via approval-gated tools, not raw DB creds in context).
- **Schedules:** none (specialists own cadence; orchestrator is on-demand).
- **Memory:** per-client working profile (vertical, town, SERP term, offer) — plain facts Joe confirmed.
- **Evals:** routes HVAC audit request to `audit-agent`; routes transcript to `geo-publisher`; refuses auto-send request with guardrail citation.
- **DT mapping:** DT-18 ops support, DT-01 offer clarity.

### 6.2 `audit-agent` — 5-minute self-audit + GBP observation (READ-ONLY, build first)

- **Job:** Answer "what is the next safe, valuable fix?" with ≤3 observed, screenshot-citable problems from the book checklist. This is the pilot's money agent.
- **Book mapping:** Appendix A + Ch.6 traps + Pillar 1.
- **Checks (read-only):** homepage-vs-problem-page mismatch, sticky `tel:` presence + thumb-zone size, hero slider/call-below-fold, GBP signals (<20 reviews, unanswered 1-stars, no owner replies, stale photos — via observation notes + Place Details where permitted), social-only vs owned-domain content.
- **Tools:** `fetch_public_page` (SSRF-guarded: block localhost/private/link-local/metadata, timeouts, size caps, no script exec), `check_mobile_call_cta`, `check_hero_waste`, `score_audit_evidence` (transparent, versioned), `read_centurion_prospect` (read-only). No GBP write, no screenshot publish, no enrichment — those are deferred tools that don't exist yet.
- **Skills:** `five-minute-audit` (Appendix A verbatim), `homepage-mistake`, `tap-to-call-standard`, `gbp-void-signals`, `walled-garden-test`, `case-proof-pack` (Ch.7 honest baselines).
- **Sandbox:** parse HTML, measure response time, generate private audit markdown + redacted screenshot manifest. Screenshots stay private (`centurion` storage), never public.
- **Approval:** none needed for reads; `needsApproval: always()` on any future write tool (not scaffolded yet).
- **Evals:** on 3 fixture sites (good / slider-trap / no-call-button) asserts correct ≤3 findings, zero invented traffic numbers, correct next action.
- **DT mapping:** DT-18 audit checklist, DT-19 queue evidence, DT-04 anti-agency standard.

Example tool shape:

```ts
// agents/audit-agent/agent/tools/check_mobile_call_cta.ts
import { defineTool } from "eve/tools";
import { z } from "zod";
export default defineTool({
  description: "Check a public URL for a sticky tel: call button in the mobile thumb zone. Read-only.",
  inputSchema: z.object({ url: z.string().url(), viewportWidth: z.number().default(390) }),
  async execute({ url, viewportWidth }, ctx) {
    const sandbox = ctx.getSandbox();
    // fetch + parse in sandbox with timeout/size caps; never execute site JS
    return { url, hasStickyTel: false, evidence: "no tel: anchor in first viewport", viewportWidth };
  },
});
```

### 6.3 `geo-publisher-agent` — brain-to-tongue → transcript → blog + RSS (DRAFT)

- **Job:** Turn a 3-min owner recording into a weekly blog + podcast episode + syndication pack without the owner writing.
- **Book mapping:** Ch.9 extraction + Pillar 2 GEO.
- **Flow:** 50-problems worksheet → diagnostic question → recording checklist → transcript template → FAQ schema → RSS-ready audio manifest (audio rendering itself stays in ElevenLabs/Suno dashboards until approved connectors exist).
- **Tools:** `format_transcript_post` (title = customer question, 150-word answer, 3 bullets, FAQ x3, call box), `build_faq_jsonld`, `build_rss_item_draft`, `geo_citation_check` (does the draft answer a hyper-local question quotably?). All output drafts; publish tool is `DEFERRED` + approval-gated.
- **Skills:** `brain-to-tongue`, `transcript-template`, `geo-question-framing` ("How much… in [Town]?"), `syndication-manifest` (Apple/Spotify/Amazon/YouTube).
- **Sandbox:** format markdown, validate JSON-LD, stage files under `/workspace/drafts/`.
- **Schedule (after approval):** weekly per client — draft post + episode; monthly 4-topic pack for SMS YES flow.
- **Evals:** transcript in → valid JSON-LD + FAQ + call box out; rejects social-only publish plan.
- **DT mapping:** DT-07 GEO baselines, DT-01 $300 retainer fulfillment.

### 6.4 `vsl-builder-agent` — one problem, one video, one button (DRAFT)

- **Job:** Assemble a problem-specific VSL page spec + copy draft that passes the anti-agency linter.
- **Book mapping:** Ch.5 + Pillar 3.
- **5-part output:** risk-reversal headline ("…guaranteed or it's free" localized), 45–60s video outline + jingle slot, proof strip (live review carousel placeholder), agitate-solve copy + FAQ, sticky call spec.
- **Tools:** `draft_vsl_headline`, `outline_explainer_video`, `lint_vsl_page` (fails sliders, hidden call, vague slogans like "Excellence in Every Pipe"), `draft_kennedy_ad` ("Tired of…? Scared…? …Watch my video.").
- **Skills:** `vsl-formula`, `risk-reversal-headlines`, `watch-my-video-ctr`, `anti-agency-rule`.
- **Sandbox:** scaffold Next.js page draft + copy deck; never push to prod without Joe + `npm run build` + design review.
- **Evals:** HVAC slab-leak brief → headline + outline + proof slot + sticky-call spec; linter catches slider hero fixture.
- **DT mapping:** DT-04 conversion standard, DT-01 $1,500 landing-page package, DT-18 Option A proposal support.

### 6.5 `jingle-agent` — SERP-term earworm packager (DRAFT)

- **Job:** Produce lyric + Suno prompt + anchor validation for a 15-sec earworm. Never claims studio audio it didn't render.
- **Book mapping:** Ch.3 + 21-time rule + golden production rule.
- **Recipe enforced:** 0–5s anchor (exact SERP term + brand, pre-skip), 5–12s benefit in owner voice, 12–15s nudge ("Search [term] today!" / phone). Rejects owner slogan bloat with Mike's "$2,000 studio" line.
- **Tools:** `draft_jingle_lyric`, `build_suno_prompt` (genre, tempo, exact-term constraint), `validate_jingle_anchor` (term verbatim in first 5s, ≤15s total).
- **Skills:** `fifteen-second-recipe`, `serp-term-discipline`, `pink-plumber-precedent`, `spanish-dub-note` (ElevenLabs dub as follow-on).
- **Sandbox:** lyric sheets + prompt JSON + timing table; audio files only from approved Suno/ElevenLabs exports, stored as drafts.
- **Evals:** "Mount Lawley Pest Control" brief → lyric with verbatim term in line 1 + passing validation; slogan-bloated input gets pushback.
- **DT mapping:** DT-01 earworm asset, DT-07 audio pipeline.

### 6.6 `ad-ops-agent` — YouTube pre-roll + PPC spec (DRAFT spec, DEFERRED launch)

- **Job:** Draft geo-only pre-roll and Kennedy PPC specs with honest skip economics. Never launches or spends.
- **Book mapping:** Ch.4 arbitrage + targeting axiom.
- **Rules baked in:** 15–20 mi radius / zip cluster only; no age/interest micro-filtering; jingle front-loaded; billing explanation ($0 if skip <30s); living-room effect noted; Abilene/Haynes baselines cited with spend ranges, never promised as guarantees.
- **Tools:** `draft_preroll_spec`, `draft_geo_target` (radius/zips only — rejects demographic filters), `explain_skip_economics`. No `launch_campaign` tool until legal + DT-18 gate + spend-cap + approval design lands.
- **Skills:** `preroll-arbitrage`, `geography-over-guesswork`, `kennedy-agitation`.
- **Evals:** Lake County HVAC brief → radius-only target + 0–5s anchor check; demographic-filter request gets refusal + correction.
- **DT mapping:** DT-01 $500 growth retainer scope, DT-18 Option B.

### 6.7 `gbp-care-agent` — review + photo maintenance drafter (DRAFT, writes DEFERRED)

- **Job:** Draft review replies, review-ask checklists, and photo-upload queues from GBP observations. Never edits GBP directly yet.
- **Book mapping:** Pillar 1 activity signals + drown-out engine.
- **Tools (now):** `draft_review_reply` (plain, human, no fake reviews), `build_photo_checklist`, `build_review_ask_script`. **Tools (deferred, not scaffolded):** `publish_gbp_post`, `reply_gbp_review` — both `approval: always()` + audit-logged when eventually designed.
- **Skills:** `drown-out-engine`, `owner-reply-voice`, `nap-consistency`.
- **Schedule (deferred):** weekly GBP photo/review nudge draft per client.
- **Evals:** 1-star fixture → empathetic draft with offline-takeover line, no admission of fault, no invented facts.
- **DT mapping:** DT-01 core retainer GBP line, DT-07 local schema.

### 6.8 `outreach-assist-agent` — opener + objection drafter (DRAFT, auto-send DEFERRED/forbidden)

- **Job:** Turn one audit observation into a short, plain-language call opener + follow-up note for Joe's manual call. This is a writing assistant, not a sequencer.
- **Book mapping:** Pillar 5 diagnostic demonstration + Ted Yates 1-on-1 proof.
- **Tools:** `draft_opener` (observation → economic relief in ≤30s of talk), `draft_followup_note`, `log_call_prep_to_centurion` (approval-gated write). No email/SMS/call tools. No bulk actions.
- **Skills:** `diagnostic-demo` (show the flaw, not the deck), `plain-language-openers`, `loss-reason-taxonomy` (DT-18 metrics).
- **Guard:** must cite the specific audit evidence id; refuses "write 100 cold emails" with Mission + automation-gate citation.
- **Evals:** homepage-mistake evidence → opener mentioning wasted ad spend + bouncing mobile clicks; bulk-send request → refusal.
- **DT mapping:** DT-18 queue support, DT-19 compliance.

### 6.9 `prospect-intel-agent` — centurion research helper (READ-ONLY helper, optional Phase 2)

- **Job:** Explain scores, surface missing evidence, and prep research checklists. Never scrapes against terms, never enriches at scale.
- **Tools:** `explain_score` (rule version + points), `suggest_next_research` (public sources only), `check_suppression` (hash-compare). Google Places / Apollo tools deferred until Phase 3 with quotas, budgets, idempotency, and provenance fields per prospecting spec §5–8.
- **DT mapping:** DT-17/19 scoring transparency, DT-18 research support.

### Optio note (fleet command)

Chain of command: Joe (Centurion) → Optio Centuriae → specialists. Normal flow goes through the Optio; Joe may bypass and task any specialist directly, and direct orders override delegated ones.

Start with `audit-agent` + `optio-centuriae` only. Add `geo-publisher` + `vsl-builder` after first evals pass. `jingle`, `ad-ops`, `gbp-care`, `outreach-assist` follow in that order. `prospect-intel` and any Places/enrichment work wait for DT-18 proposal evidence.

---

## 7. Shared building blocks

### 7.1 Tool catalog (naming = file path)

| File | Mode | Approval | Purpose |
|---|---|---|---|
| `tools/fetch_public_page.ts` | READ | never (guarded fetch) | SSRF-safe public HTML fetch with timeout/size/redirect caps |
| `tools/check_mobile_call_cta.ts` | READ | never | Sticky `tel:` + thumb-zone audit |
| `tools/lint_vsl_page.ts` | READ | never | Anti-agency linter (sliders, hidden call, slogans) |
| `tools/explain_score.ts` | READ | never | Transparent score breakdown with rule version |
| `tools/check_suppression.ts` | READ | never | Hash-compare against `suppressions` before any draft |
| `tools/format_transcript_post.ts` | DRAFT | once per client | Blog + FAQ draft from transcript |
| `tools/build_faq_jsonld.ts` | DRAFT | once per client | `FAQPage` + `LocalBusiness` schema draft |
| `tools/draft_vsl_headline.ts` | DRAFT | once per client | Risk-reversal headline variants |
| `tools/draft_jingle_lyric.ts` | DRAFT | once per client | 15-sec lyric with anchor check |
| `tools/draft_opener.ts` | DRAFT | once per prospect | Manual-call opener from one observation |
| `tools/centurion_create_task.ts` | WRITE | always | Durable follow-up in `/centurion` |
| `tools/publish_blog_post.ts` | WRITE | **deferred + always** | Not scaffolded until DT-07 publish flow approved |
| `tools/send_audit.ts` | WRITE | **deferred + always** | Not scaffolded until DT-18 gate lifts |
| `tools/launch_ad_campaign.ts` | WRITE | **deferred + always** | Not scaffolded until legal + spend-cap design |

Every write tool re-checks suppression, takes an idempotency key, and logs `{ agent, tool, prospect/client id, approval by, at }` without PII.

### 7.2 Skill catalog (book as skills — one chapter, one skill)

Package in `extensions/dg-book/skills/` and mount everywhere:

- `five-minute-audit.md` — Appendix A verbatim + pass/fail thresholds.
- `vsl-formula.md` — 5-part funnel + headline formula + proof-strip rule.
- `fifteen-second-recipe.md` — 0–5/5–12/12–15 timing + verbatim-term rule.
- `preroll-arbitrage.md` — skip billing + living-room effect + Abilene math.
- `geography-over-guesswork.md` — radius-only targeting axiom.
- `brain-to-tongue.md` — 50-problems worksheet + diagnostic question + recorder checklist.
- `transcript-template.md` — title/answer/bullets/FAQ/call-box.
- `anti-agency-rule.md` — hero/call/slider/hamburger prohibitions.
- `walled-garden-test.md` — owned-domain vs social-only check.
- `case-proof-pack.md` — Ch.7 cases with spend/result ranges and "don't promise" guard.
- `sms-yes-flow.md` — Ch.10 monthly approval + weekly publish + review Zoom.
- `triage-playbook.md` — orchestrator routing + Mission test (10 questions).
- `evidence-rules.md` — no invented numbers, qualify estimates, cite tool output.

Skill frontmatter pattern:

```md
---
description: Use when auditing a local site for the 5-minute self-audit failures.
---
```

### 7.3 Connections (all deferred until needed + reviewed)

| Connection file | Service | Auth | Used by |
|---|---|---|---|
| `connections/neon_read.ts` | Neon Postgres (read replica / least-privilege role) | service token, server-only | orchestrator, audit-agent reads |
| `connections/gbp.ts` | Google Business Profile API | OAuth via Vercel Connect | gbp-care (deferred writes) |
| `connections/ads.ts` | Google Ads / YouTube Ads API | OAuth, spend caps | ad-ops (deferred launch) |
| `connections/slack.ts` | Slack (approvals as buttons) | Connect OAuth | orchestrator approvals |
| `connections/suno.ts` | Suno (lyric→audio export) | API key, server-only | jingle-agent (deferred render) |
| `connections/elevenlabs.ts` | ElevenLabs (voice clone/dub) | API key, server-only | geo-publisher (deferred render) |

Model never sees URLs or tokens. Interactive OAuth parks durably until consent completes.

### 7.4 Extensions

- `@dg/book` — all §7.2 skills + transcript/VSL templates. Mounted in every agent.
- `@dg/centurion` — read-only prospect/score client + `check_suppression` + evidence schema. Mounted in orchestrator, audit, outreach-assist.
- `@dg/geo` — JSON-LD builders + RSS item templates + GEO question bank. Mounted in geo-publisher, vsl-builder.

---

## 8. Human-in-the-loop and approval matrix

| Action | Tool | Policy | Surface |
|---|---|---|---|
| Read public site / explain score | read tools | `never()` | runs freely, logged |
| Draft audit / opener / headline / lyric / post | draft tools | `once()` per client/prospect | Joe reviews in dev TUI or Slack |
| Create `/centurion` task / activity | `centurion_create_task` | `always()` | Slack approval button; parks with zero compute |
| Publish blog / RSS / GBP edit / ad launch / audit send / enrichment charge | deferred tools | `always()` + suppression + spend/consent check | **Do not scaffold yet** — needs legal + DT-18 decision |
| Bulk outreach / auto sequence / AI voice call | — | **forbidden** | agent must refuse and cite Mission §"What we refuse" |

Approval rendering: Slack buttons / select menus via channel; web fallback via HTTP stream. Parked turns resume exactly where they left off after approval.

---

## 9. Durability, state, memory, schedules

- **Sessions:** one durable session per (client × month) for fulfillment and per (prospect) for audit prep. Turns checkpoint per step; redeploys don't lose work. Completed steps replay; interrupted writes re-run — hence idempotency keys on all writes.
- **State (`defineState`):** per-session draft status (`topics_approved: 2/4`, `vsl_lint: pass/fail`, `jingle_anchor_ok: bool`). Never shared across subagents; each child starts fresh and receives only its `message` pack.
- **Memory:** provider-backed per-client facts (SERP term, town, voice-sample id, offer, GBP place id) and per-prospect facts (observation ids, loss reasons). No secrets, no raw PII beyond what's in `/centurion` under access control.
- **Schedules (root-only, all start as drafts needing Joe enable):**
  - `weekly-publish-draft.ts` — `0 9 * * 1` — "Draft this week's transcript post + episode for {client}."
  - `monthly-topics-pack.ts` — `0 9 1 * *` — "Assemble 4 topics for SMS YES approval."
  - `monday-pilot-report.ts` — `0 8 * * 1` — "Summarize pilot: conversations/hr, reach rate, follow-ups, proposals, loss reasons."
  - `gbp-nudge-draft.ts` — `0 9 * * 3` — "Draft review-reply + photo checklist."
- **Steering:** default `turnPolicy: "steer"` so Joe's correction interrupts cleanly; `queue` for scheduled turns.

---

## 10. Deployment and operations

- **Local:** `npm run dev` (= `eve dev`) in one agent dir at a time. Drive via TUI, then HTTP: `POST /eve/v1/session`, `GET /eve/v1/session/:id/stream`, follow-up with `continuationToken`. `eve info` when discovery misses a file.
- **Ship:** `eve build` → `vercel deploy`. Same directory locally and in prod; sandbox swaps to Vercel Sandbox with no code change. Mid-task sessions finish on the version they started on. Preview deploys carry channels so Joe can talk to the next version in Slack before promotion. Instant rollback on regression.
- **Observability:** every run → trace (`ai.eve.turn` → `ai.streamText` + `ai.toolCall`) with inputs/outputs and sandbox commands. OTel export (Honeycomb/Datadog/etc.); on Vercel the Agent Runs tab. Track per-client cost (tokens + sandbox + ad spend separately).
- **Pricing/limits:** eve usage maps to Functions, Workflows, Sandbox, AI Gateway. Set per-agent token budgets, sandbox timeouts, and (when deferred connectors land) provider spend caps + quotas. No unbounded batch jobs.
- **Security checklist before any prod agent:** secrets in Vercel env (never `agent.ts`), least-privilege Neon role, SSRF guards on fetch tools, size/time caps on parsing, no script exec of fetched sites, redacted logs, export limits + audit log, prod/dev data separation, threat model for dialer/messaging (deferred).

---

## 11. Evals and quality gates

`evals/` lives beside `agent/`, runs with `eve eval` locally / against deploy / in CI as deploy gate.

Minimum suites per agent:

- **Audit:** fixtures (clean site / slider-trap / no-call) → exact ≤3 findings, cites evidence, zero invented metrics, correct next action. Must flag social-only + GBP void correctly.
- **VSL:** brief → headline with risk reversal + video outline + proof slot + sticky-call spec; linter fixture must fail with named violations.
- **GEO:** transcript → valid JSON-LD + FAQ + call box; rejects social-only plan.
- **Jingle:** brief → verbatim SERP term in first line + ≤15s timing table; bloated-slogan input gets formula pushback.
- **Ad-ops:** brief → radius-only target; demographic-filter request refused with correction.
- **Outreach-assist:** evidence → ≤30s opener with economic relief; bulk-send request refused with Mission citation.
- **Router:** task → correct delegation; auto-send/publish request refused.

Repo gates stay mandatory: `npm run lint`, `npm test`, `npm run build` for the site; `eve eval` + typecheck per agent. A prompt/model change that breaks an eval blocks promotion.

---

## 12. Phased build plan (tied to current targets)

> No phase authorizes autonomous outreach. Each phase ends with a dated decision in `doc/current-development-targets.md`.

**Phase 0 — Learn eve (1–2 days, alongside DT-19 review).**
- Site stays on Node 22 (`node`/`npm` → `~/.local/node-v22.13.1-linux-x64`, per `.nvmrc`). Agents use side-by-side Node 24.20.0 (`~/.local/node-v24.20.0-linux-x64`, installed 2026-09-06). `npx24`-style symlinks do NOT work (package shebangs resolve `node` from PATH, so they still run Node 22) — run all `eve` commands with the Node 24 bin dir first on PATH: `export PATH="$HOME/.local/node-v24.20.0-linux-x64/bin:$PATH"`. This split is temporary (see 2026-09-06 decision below).
- `npx24 eve@latest init agents/audit-agent`, run first session + HTTP stream, read §§4 + "Recommended reading order" below. Pin version. (DT-08).

**Phase 1 — Audit-assist MVP (1 week, supports DT-18 pilot).**
- Ship `audit-agent` (read-only §6.2) + `optio-centuriae` skeleton + `@dg/book` skills (`five-minute-audit`, `evidence-rules`, `anti-agency-rule`).
- Evals green, `eve eval` in CI, Vercel preview reviewed by Joe. `/centurion` remains the only writer (via approval-gated task tool).
- Exit: 5 pilot prospects get Joe-approved audit drafts from agent output; time-saved + accuracy logged.

**Phase 2 — Fulfillment drafts (1–2 weeks, supports DT-01/DT-04/DT-07).**
- Add `geo-publisher-agent` + `vsl-builder-agent` (draft-only). JSON-LD + RSS draft validation, VSL linter in CI. Publish tool stays unscaffolded; Joe copy-pastes or approves manual publish.
- Exit: one demo client month (4 topics → drafts → Joe-approved) produced end-to-end in staging.

**Phase 3 — Earworm + ad specs (1–2 weeks, supports DT-01 growth tier).**
- Add `jingle-agent` + `ad-ops-agent` (spec-only). Suno/ElevenLabs/Ads connectors designed but not credentialed; audio/ad launch stays manual.
- Exit: demo client gets lyric + prompt pack + pre-roll spec Joe can hand to production.

**Phase 4 — Care + outreach-assist (gated).**
- Add `gbp-care-agent` + `outreach-assist-agent` (draft-only). GBP writes, audit sends, enrichment, and any messaging automation stay deferred until DT-18 proposal evidence + legal review + spend/consent design.
- Exit: Joe measures opener acceptance rate + reply-draft acceptance rate; decides whether to design approval-gated writers.

**Phase 5 — Controlled connectors (requires dated DT promotion).**
- Least-privilege Neon read replica, Slack approvals, then (in order) GBP read → GBP write-design → podcast RSS publish-design → Ads read → Ads launch-design. Each needs quotas, idempotency, audit logging, evals, and rollback test.
- Never: bulk cold text/calls, AI voice prospecting, auto audit blasts, mass enrichment — each needs its own legal + Mission review, not just a technical gate.

---

## 13. Continuous improvement (how this doc stays true)

- This file is the agent source of truth. Update it in the same commit as any agent change: roster, tools, skills, approvals, evals, decisions.
- Friday review (with `current-development-targets.md`): promote/demote agents, record pilot friction, retire stale skills.
- Verification log (append-only):

| Date | Agent/scope | Evidence | Result |
|---|---|---|---|
| 2026-09-06 | Plan | Book + Mission + DTs + eve docs distilled into roster/phases | Plan drafted; no code built; autonomous outreach stays deferred |
| 2026-09-06 | Internal-first dogfood rule | Owner directive: build + use own agents first while slowly becoming agent-first | Website evolves incrementally toward agent-builder positioning; full agent-outcome pitch waits for dogfood evidence |
| 2026-09-06 | audit-agent scaffold | `npx eve@latest init agents/audit-agent` under Node 24.20.0 | eve 0.52.1 scaffolded clean (no nested .git, engines node 24.x); `agents/` untracked, uncommitted per owner rule |
| 2026-09-06 | audit-agent identity | Authored `agent/instructions.md` (read-only doctrine, 5-min audit, chain of command) | Stock model kept; `npm run typecheck` passes |
| 2026-09-06 | check_mobile_call_cta tool | SSRF-guarded static-HTML tel:/sticky check + smoke eval (eval run blocked: no model creds) | typecheck + `eve info` discovery clean; live fixture: example.com→fail, localhost/metadata→blocked |
| 2026-09-06 | check_hero_waste tool + lib refactor | Shared `agent/lib/safe_fetch.ts` (one SSRF path); hero slider/video/slogan/phone/proof heuristic | typecheck + discovery (13 tools) clean; example.com→fail w/ correct evidence; localhost→blocked; CTA regression passes |
| 2026-09-06 | score_audit_evidence tool | Rule v1.0 transparent scoring (100-pt breakdown, bands, disqualifier override) | Fixtures: 85→priority, 100+DNC→exclude, 0→exclude; discovery (14 tools) clean |
| 2026-09-06 | optio-centuriae scaffold + identity | `eve init agents/optio-centuriae` (eve 0.52.1, no nested .git); authored chain-of-command instructions | typecheck + discovery clean (11 built-in tools, 0 subagents — audit-agent mounting comes next) |
| 2026-09-06 | audit-agent mounted under Optio | `agent/subagents/audit-agent/` w/ description + re-export stubs (symlinks ignored by discovery) + lib shim + specialist instructions | typecheck + discovery (1 subagent, 3 tools) + `eve build` all clean; chain of command real in code |
| 2026-09-06 | Zen model route (Muse Spark) | `@ai-sdk/openai` + `agent/lib/model.ts` (`primaryModel`) in both projects; all 3 agent.ts on provider object + explicit 128k window | typecheck + discovery + `eve build` clean on both; live eval awaits OPENCODE_API_KEY |
| 2026-09-06 | First live eval (Zen key, git-ignored) | `eve eval call-cta-smoke`: Muse Spark via Zen drives audit-agent loop | 3/3 gates pass in ~10s — model called the tool and reported evidence |
| 2026-09-06 | First dogfood audit (own site) | Live session vs derivativegenius.com: apex failed, agent recovered via www, full 5-tool loop | 3 leverage-ordered findings (sticky call, hero proof, apex handshake) + honest scope limits; 50/100 research_only |
| 2026-09-06 | Live Optio→audit delegation | Direct order via Optio dev server: delegated, child ran 4 tools, Optio relayed 3 findings + 1 action | Chain of command runs end to end (turns 0–2); dev servers killed by exact PID only (`pkill -f` matches the wrapper shell) |
| 2026-09-06 | check_owned_content tool | Sitemap/blog/RSS presence + social-link count; mounted under Optio (4 subagent tools) | Own site: blog links yes, sitemap/RSS no (confirms DT-07 gap); discovery clean both projects |
| 2026-09-06 | Prospect audit #1: abbottshvac.com | Full 4-tool loop via dev server, option-1 review (pasted here) | 40/100 research_only; 3 findings (sticky call, hero phone+proof, thin content); sitemap present, no blog/RSS |
| 2026-09-06 | Prospect audit #2: jonasenergy.com | Full 4-tool loop, option-1 review | 40/100 research_only; 2 findings (hero slider buries proof, thumb-zone unconfirmed); owned content healthy (sitemap+36 articles+RSS) |
- Decision log (append-only):
  - **2026-09-06 — Eat our own dog food first, evolve site gradually.** Derivative Genius builds and runs its own 9-agent fleet internally before selling the client 4–6, while slowly becoming an agent-first company in public. Early website changes toward agent-builder positioning are allowed before dogfood proof; the full outcome pitch ("your 4–6 agents that do the book for you, managed by us") waits until `audit-agent` + `optio-centuriae` pass Phase 1 evals and prove time-saved + accuracy on ≥5 pilot prospects with Joe approval.
  - **2026-09-06 — No blast radius, but unify Node ASAP.** The Node 22/24 side-by-side setup is temporary scaffolding, not the end state. Owner wants everything on the same Node version as soon as possible — but never as a flag-day upgrade. Unification happens only after `lint` + `test` + `build` + deploy verification pass on the single version, with instant rollback ready.
  - **2026-09-06 — AI Gateway provider fallbacks are mandatory beyond the pilot.** Single-provider model routing is accepted for Phase 1 only. Before any client-facing deploy, every agent gets cross-provider fallbacks so provider outages don't halt fulfillment. Owner directive: we must have this.
  - **2026-09-06 — Model route: OpenCode Zen, not harness IDs.** The opencode `model` string (`opencode/...`) does not resolve in eve. Verified against https://opencode.ai/docs/zen/: agents use a separate Zen key (`OPENCODE_API_KEY`, `.env.local`, never harness credentials) through `@ai-sdk/openai` with `baseURL https://opencode.ai/zen/v1` + `.responses("muse-spark-1.3-contributor-free")` as an AI SDK provider object in `agent/lib/model.ts` (`primaryModel`, replaceable). Unlisted model requires explicit `modelContextWindowTokens` (128k conservative placeholder until Meta publishes the window).
  - **2026-09-06 — Contributor-free training-use guardrail.** The free tier permits training future Meta models on prompts/completions. Agents on this model handle public business info only — never client source, proprietary docs, PII, credentials, or confidential customer data. Switching to a zero-retention model is a config change (`primaryModel`), not a rebuild.

- Open decisions:
  1. Single orchestrator vs per-pillar deploys for prod (start single, split on cost/latency evidence).
  2. Model choice per agent (default via AI Gateway; tune on eval cost/quality).
  3. Neon access pattern (service token via approval-gated tools vs read-replica connection).
  4. Suno/ElevenLabs connector shape (dashboard-manual until Phase 3 exit).
  5. Slack approvals vs web-only for Joe (Slack preferred for parked-turn UX).

---

## 14. Educational resources on eve

Start with the **Recommended reading order**, then use the section indexes for deep work. eve is in beta — prefer `eve.dev/docs` + GitHub as truth when anything conflicts.

### Recommended reading order

1. https://vercel.com/blog/introducing-eve
2. https://eve.dev/docs/getting-started
3. https://vercel.com/docs/eve/concepts
4. https://eve.dev/docs/concepts/execution-model-and-durability
5. https://eve.dev/docs/tools
6. https://eve.dev/docs/skills
7. https://eve.dev/docs/subagents
8. https://eve.dev/docs/sandbox
9. https://eve.dev/docs/guides/deployment/vercel
10. https://vercel.com/docs/eve/observability
11. https://vercel.com/docs/eve/pricing

### Role-based paths

- **Joe / operator (30 min):** introducing-eve → getting-started → concepts → observability → pricing. Goal: what agents can/can't do, where approval parks work, what evals prove.
- **Builder (2 hrs):** above + execution-model → tools → skills → subagents → sandbox → dynamic-capabilities → deployment/vercel. Then build Phase 1 audit tool + one eval.
- **Reviewer (1 hr):** tools (approval section) → human-in-loop → observability → remote-agents → workflow-tool. Goal: approve approval-matrix + deferred-tool boundaries.

### Eve glossary (DG translation)

| eve term | Means | DG example |
|---|---|---|
| agent as directory | Path = capability | `agents/audit-agent/agent/tools/check_mobile_call_cta.ts` |
| instructions | System prompt | "You are the audit agent. Cite only tool evidence…" |
| tool | Typed code the model can call | `draft_jingle_lyric`, `lint_vsl_page` |
| skill | Markdown procedure loaded on demand | `five-minute-audit.md` |
| subagent | Isolated specialist child | `jingle-agent` under orchestrator |
| connection | MCP/OpenAPI without leaking creds | GBP/Ads/Slack via Connect |
| sandbox | Untrusted shell + files | Parse HTML, stage drafts |
| schedule | Cron job that starts the agent | Weekly publish draft |
| memory | Cross-session facts | Client SERP term, offer |
| approval | Human gate that parks durably | Joe taps Approve in Slack |
| eval | Scored behavior test | "Slider fixture must fail lint" |
| trace | Replayable run record | Agent Runs tab |
| extension | Reusable pack of tools/skills | `@dg/book` |

Below are the seminal first-party documentation links for **eve**, Vercel's open-source framework for building durable AI agents. Every URL is written explicitly for easy copying.

## Start here

1. **Official eve product page**
   High-level explanation of the framework, architecture, and capabilities.
   [https://vercel.com/eve](https://vercel.com/eve)

2. **Introducing eve — Vercel's announcement**
   The foundational article explaining why Vercel created eve and its "agent as a directory" philosophy.
   [https://vercel.com/blog/introducing-eve](https://vercel.com/blog/introducing-eve)

3. **Getting started with eve**
   The best practical entry point. It introduces agents, tools, state, sandboxed analysis, skills, human approval, and deployment.
   [https://eve.dev/docs/getting-started](https://eve.dev/docs/getting-started)

4. **Complete official eve documentation**
   The main framework documentation index.
   [https://eve.dev/docs](https://eve.dev/docs)

5. **Official GitHub repository**
   Source code, examples, releases, issues, discussions, and contribution history.
   [https://github.com/vercel/eve](https://github.com/vercel/eve)

## Core architecture

6. **Vercel eve overview**
   Explains how eve integrates with Vercel Functions, Workflows, Sandbox, AI Gateway, Connect, and Observability.
   [https://vercel.com/docs/eve](https://vercel.com/docs/eve)

7. **Core concepts**
   Covers agent projects, sessions, turns, durability, channels, tools, skills, subagents, connections, and sandboxes.
   [https://vercel.com/docs/eve/concepts](https://vercel.com/docs/eve/concepts)

8. **Execution model and durability**
   Essential reading for checkpointing, resumable sessions, long-running work, isolation, and durable subagent execution.
   [https://eve.dev/docs/concepts/execution-model-and-durability](https://eve.dev/docs/concepts/execution-model-and-durability)

9. **TypeScript API reference**
   The authoritative API reference for agents, tools, skills, models, subagents, dynamic resources, and runtime configuration.
   [https://eve.dev/docs/reference/typescript-api](https://eve.dev/docs/reference/typescript-api)

## Agent capabilities

10. **Tools**
    Explains how to expose typed TypeScript functions to an agent.
    [https://eve.dev/docs/tools](https://eve.dev/docs/tools)

11. **Skills**
    Explains how to give agents reusable Markdown procedures and specialized knowledge.
    [https://eve.dev/docs/skills](https://eve.dev/docs/skills)

12. **Subagents**
    Explains how agents delegate work to independently configured specialist agents.
    [https://eve.dev/docs/subagents](https://eve.dev/docs/subagents)

13. **Connections**
    Covers connections to MCP servers and OpenAPI services while separating credentials from model context.
    [https://eve.dev/docs/connections](https://eve.dev/docs/connections)

14. **Sandbox**
    Covers isolated filesystems, command execution, attachments, and model-generated code.
    [https://eve.dev/docs/sandbox](https://eve.dev/docs/sandbox)

15. **Memory**
    Covers provider-backed information that persists beyond an individual session.
    [https://eve.dev/docs/memory](https://eve.dev/docs/memory)

16. **Schedules**
    Covers recurring and autonomous agent jobs such as reports, monitoring, synchronization, and maintenance.
    [https://eve.dev/docs/schedules](https://eve.dev/docs/schedules)

17. **Extensions**
    Explains how to package reusable tools, skills, channels, connections, schedules, subagents, hooks, and instructions.
    [https://eve.dev/docs/extensions](https://eve.dev/docs/extensions)

## Installation, deployment, and operations

18. **Installation**
    Covers creating a project, selecting a model and provider, configuring credentials, and running eve locally.
    [https://eve.dev/docs/installation](https://eve.dev/docs/installation)

19. **Deployment overview**
    Explains how `eve build` compiles an agent into deployable host output.
    [https://eve.dev/docs/guides/deployment/overview](https://eve.dev/docs/guides/deployment/overview)

20. **Deploy eve to Vercel**
    Covers Vercel deployment, Workflow, Sandbox templates, build permissions, environment configuration, and credentials.
    [https://eve.dev/docs/guides/deployment/vercel](https://eve.dev/docs/guides/deployment/vercel)

21. **Observability**
    Covers Agent Runs, sessions, turns, tool calls, reasoning, timing, token usage, and optional OpenTelemetry export.
    [https://vercel.com/docs/eve/observability](https://vercel.com/docs/eve/observability)

22. **Pricing and limits**
    Explains how eve usage maps to Vercel Functions, Workflows, Sandbox, AI Gateway, and other platform resources.
    [https://vercel.com/docs/eve/pricing](https://vercel.com/docs/eve/pricing)

## Advanced documentation

23. **Remote agents**
    Explains how one deployed eve agent can call another as a durable subagent.
    [https://eve.dev/docs/guides/remote-agents](https://eve.dev/docs/guides/remote-agents)

24. **Dynamic capabilities**
    Covers dynamically selecting instructions, tools, skills, models, and subagents according to the user, tenant, or channel.
    [https://eve.dev/docs/guides/dynamic-capabilities](https://eve.dev/docs/guides/dynamic-capabilities)

25. **Experimental Workflow tool**
    Allows an agent to create JavaScript orchestration logic across its own subagents as a durable step.
    [https://eve.dev/docs/subagents/workflow-tool](https://eve.dev/docs/subagents/workflow-tool)

26. **Install integrations**
    Covers discovering and adding eve extensions, connections, and other integrations.
    [https://eve.dev/docs/install-integrations](https://eve.dev/docs/install-integrations)

## Examples and learning resources

27. **eve Knowledge Base**
    Official collection of guides, patterns, example agents, and production use cases.
    [https://vercel.com/kb/eve](https://vercel.com/kb/eve)

28. **Build your first Slack agent with eve**
    Official tutorial for deploying a Slack-based eve agent with a tool and skill.
    [https://vercel.com/kb/guide/eve-slack-agent-starter](https://vercel.com/kb/guide/eve-slack-agent-starter)

29. **eve Personal Agent template**
    A personal agent supporting web, Slack, iMessage, and editable memory.
    [https://vercel.com/templates/nuxt/eve-personal-agent](https://vercel.com/templates/nuxt/eve-personal-agent)

30. **LLM Council example repository**
    An eve and Next.js demonstration that queries several models concurrently and uses a judge model to synthesize the answer.
    [https://github.com/vercel-labs/eve-llm-council](https://github.com/vercel-labs/eve-llm-council)

31. **Vercel Academy companion skill for building agents with eve**
    A structured example that develops an agent from typed tools through deployment, Slack, authentication, and human approval.
    [https://github.com/vercel-labs/academy-skills/blob/main/skills/building-agents-with-eve/SKILL.md](https://github.com/vercel-labs/academy-skills/blob/main/skills/building-agents-with-eve/SKILL.md)

**Important:** eve is currently in beta. Its APIs, behavior, documentation, and deployment requirements may change before general availability. For implementation work, use [https://eve.dev/docs](https://eve.dev/docs) and [https://github.com/vercel/eve](https://github.com/vercel/eve) as the primary sources of truth.
