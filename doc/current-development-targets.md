# Current Development Targets

**Project:** Derivative Genius (`derivativegenius-com`)

**Current focus:** Validate a repeatable, founder-led **manual outreach and sales motion** for Derivative Genius website engagements before investing in additional prospecting automation. Use the existing `/centurion` operator application to prioritize prospects, support respectful calls, record outcomes, schedule follow-ups, and measure qualified conversations, proposals, and closed revenue. The public website remains the credibility and conversion layer prospects inspect after contact.

**Source documents:** `doc/lessons-of-localinternetpresence.md`, `doc/Website-Prospecting-System-Plan.md`, `doc/The-Mission.md`, `README.md`, `.agent/` (agent & skill repository), `package.json`, `devs.sh`, and the implementation under `src/app/`, `src/components/`, `src/db/`, and `src/lib/`

**Baseline reset:** August 7, 2026

**Review cadence:** Update when a target changes and review the full document every Friday.

**Document owner:** Repository maintainer

**Last updated:** September 7, 2026

## Purpose

This file is the development target management tool for this repository. It is the source of truth for current engineering priorities, release scope, open decisions, completion evidence, and deferred work.

Use it to answer five questions:

1. What outcome are we pursuing now?
2. What work is active, blocked, or next?
3. What is deliberately outside the current release?
4. What evidence is required before a target is complete?
5. What decisions could change the plan?

Business strategy belongs in the source documents above. Implementation detail belongs in code, issues, or a target-specific plan. This document connects the two without duplicating either one.

## How to manage targets

### Status vocabulary

Use only these statuses:

| Status        | Meaning                                                            |
| ------------- | ------------------------------------------------------------------ |
| `Not started` | Approved and ready to schedule, but no implementation is underway. |
| `In progress` | Actively being implemented.                                        |
| `Blocked`     | Cannot proceed until the named dependency or decision is resolved. |
| `In review`   | Implementation is complete and awaiting verification or approval.  |
| `Complete`    | The done criteria are met and verification evidence is recorded.   |
| `Deferred`    | Intentionally outside the current release boundary.                |

### Working rules

- Keep no more than two targets `In progress` at once.
- Work in priority order unless the decision log records why the order changed.
- Every active target must contain a status, priority, outcome, checklist, done criteria, and verification method.
- Mark a checklist item complete only when the repository or linked evidence proves it.
- Do not mark a target `Complete` while required verification is failing.
- Record blockers beside the affected target and in the decision queue when owner input is required.
- Update the summary table, target body, verification log, and `Last updated` field together.
- Move completed release targets to the completed-target log during the next weekly review; do not silently delete history.
- Treat web development capabilities, performance benchmarks, technology stack claims, client portfolio examples, and SLA assurances as unverified until supporting evidence is recorded.
- Mandate plain-language explanations (the "digital employee", "24/7 digital assistant", "search by meaning", and "digital dominoes" analogies) across all client-facing marketing materials and project proposals alongside technical specifications.

### Required update sequence

At the beginning of a development session:

1. Read this file and the relevant source document (`README.md`, `package.json`, etc.).
2. Confirm the selected target is not blocked or deferred.
3. Change its status to `In progress` if implementation actually begins.

At the end of a development session:

1. Update its checklist and status.
2. Add dated verification evidence.
3. Record any new decision or blocker.
4. Set `Last updated` to the current date.

## Current release objective

Run a 25-company, founder-led manual outreach pilot for one vertical across approximately five cities. The objective is to validate which prospect attributes, website observations, call openers, follow-up actions, and offer framing consistently produce qualified commercial conversations before expanding the prospecting system or paying for scaled discovery and enrichment.

```text
Choose one vertical and five cities
    -> Hand-qualify 25 companies
        -> Record one specific, credible website observation per company
            -> Prioritize the daily queue in /centurion
                -> Place respectful manual calls
                    -> Record every outcome and follow-up commitment
                        -> Create an audit only after interest or a promising conversation
                            -> Hold discovery and issue a proposal
                                -> Capture an approved deposit and project handoff
```

The current release is an operating validation cycle, not an automation project. `/centurion` should reduce preparation and record-keeping friction while preserving human judgment. The public website should give contacted prospects enough proof, offer clarity, and trust to continue the conversation.

**First-dollar definition:** At least one company reached through the manual pilot accepts a real Derivative Genius engagement and pays the required deposit through an approved hosted payment link or invoice. The transaction, project specification, receipt, outreach source, and development milestone kickoff must be recorded in the database (prospect → opportunity → proposal → project handoff chain) and verifiable without committing client PII or sensitive credentials to this repository.

The release is complete when:

- One vertical, approximately five cities, and 25 hand-qualified companies are documented.
- Every active prospect has a specific observed website issue, a next action, source provenance, and suppression status.
- Manual calls and their outcomes are recorded consistently without a parallel private spreadsheet.
- The pilot produces qualified conversations and at least one proposal, or records enough outcome evidence to revise the offer or targeting deliberately.
- Audits are created only after interest or a promising conversation and receive human approval before delivery.
- The public website clearly explains the offer and provides a validated inquiry path for prospects who research Derivative Genius after contact.
- Public and private APIs preserve authentication, authorization, validation, and suppression controls.
- The repository continues to pass linting (`npm run lint`), tests (`npm test`), production build (`npm run build`), and deployment verification after any supporting changes.

## Release boundaries

### Included in this release

- A 25-company manual pilot in one vertical across approximately five cities.
- Founder-led research, manual calls, outcome logging, scheduled follow-ups, discovery, proposal, and project handoff.
- Existing `/centurion` campaign, prospect, daily queue, activity, scoring, and suppression workflows used as operator support.
- One concise, evidence-based website observation and call opener for each active prospect.
- Funnel reporting centered on qualified conversations per operator hour, discovery calls, proposals, closed revenue, and loss reasons.
- Production Next.js 16 App Router frontend positioned for AI-First Web Development (Home, Services, About, Contact, API Route Handlers) with plain-English analogies ("Digital Employee", "24/7 Digital Assistant", "Search by Meaning", "Digital Dominoes").
- Interactive web project scope & intake form incorporating Radix UI primitives, dynamic animations (`DynamicBackground.tsx`), and Tailwind CSS v3 styling.
- Secure server-side form validation via Zod schemas (`/api/contact`).

### Deferred until demand and operating readiness are proven

- Fully automated instant client code-generation portal with self-checkout.
- Real-time client project dashboard with automated GitHub progress tracking and automated invoice generation.
- Containerized Cloud Run LLM worker deployment pipeline before volume demands dedicated GPU compute nodes.
- Complex third-party OAuth integrations beyond standard session authentication.
- Scaled Google Places discovery, mass CSV acquisition, and broad contact enrichment.
- Apollo or other paid enrichment beyond individually approved, qualified prospects.
- Automated cold email, texting, calling, AI voice, sequencing, or bulk audit delivery.
- Additional prospect scoring sophistication that is not supported by pilot outcomes.
- New background jobs or provider integrations intended primarily to increase outreach volume.

Deferred prospecting automation may be promoted only after the manual pilot records qualified conversations and at least one proposal. Any promotion requires a dated decision identifying the proven bottleneck the automation will remove.

## Next targets to production release

Work these in sequence. DT-05 quality work may continue in parallel.

1. **DT-19 — Complete Centurion Pilot Readiness.** Close the verified system-of-record, authorization, queue, follow-up, audit, pipeline, and reporting gaps before live outreach.
2. **DT-20 — Add Permission-Tracked Followup Queue.** Make targeted audits the primary lead source with sophisticated internal followup (surfacing, drafting, escalation) and permission-gated external touches only — no cold automation.
3. **DT-18 — Run the 25-Company Founder-Led Manual Outreach Pilot.** Validate targeting, observations, call openers, follow-ups, and offer framing through real conversations after DT-19 passes, using the DT-20 followup queue.
4. **DT-21 — Build VSL Demo Assembler (Slice 1, no keys).** Assemble a demo-able 5-part VSL page from existing prospect data with phone-video/YouTube slot, browser-native voiceover preview, and lyric-card jingle slot — no paid tools, no trial keys, no new dependencies.
5. **DT-01 — Define & Approve AI-First Web Development & Local Presence Offerings.** Finalize the offer, retainer packaging ($300–$500/mo), and proof needed to support pilot conversations and proposals.
6. **DT-04 — Strengthen Prospect-Facing Credibility & Anti-Agency Conversion.** Fix website copy or conversion gaps revealed when contacted prospects research Derivative Genius.
7. **DT-07 — Establish SEO, GEO, and Open-Web Syndication Baselines.** Operationalize the Audio-to-Text GEO pipeline and schema architecture.
8. **DT-02 — Secure Public APIs and Environment Secrets.** Protect the public inquiry and private operator paths used by the pilot.
9. **DT-03 — Verify Project Lead Capture & Scoping Resilience.** Confirm interested prospects can submit and be stored without data loss.
10. **DT-09 — Launch Paid Pilot Onboarding & Payment Flow.** Convert a qualified manual-outreach opportunity into a real proposal, deposit, and project handoff.

DT-10 and DT-11 remain lower-priority website expansion work unless pilot evidence shows that missing legacy content is blocking trust or conversion.

## Target summary

| ID    | Priority | Target                                                                            | Status      | Depends on                           | Last updated |
| ----- | -------- | --------------------------------------------------------------------------------- | ----------- | ------------------------------------ | ------------ |
| DT-19 | P0       | Complete Centurion Pilot Readiness                                                | In review   | Authenticated readiness smoke test    | 2026-08-19   |
| DT-20 | P0       | Add Permission-Tracked Followup Queue (audit-led, no cold automation)             | Not started | DT-19 readiness verification         | 2026-09-07   |
| DT-21 | P1       | Build VSL Demo Assembler (Slice 1: no keys, no new deps)                          | Not started | DT-20 permission basis defined       | 2026-09-07   |
| DT-18 | P0       | Run 25-Company Founder-Led Manual Outreach Pilot                                  | In progress | DT-19 readiness verification         | 2026-09-03   |
| DT-17 | P0       | Implement Private Operator Prospecting System (`/centurion`) Phase 1            | In review   | DT-16 and Clerk authentication       | 2026-08-19   |
| DT-12 | P0       | Integrate Mobile-First Prospecting & Scoping Components                           | Complete    | DT-04 and responsive-dev.md          | 2026-08-17   |
| DT-13 | P0       | Fortify Lead Intake Route & Scoping Persistence                                   | Complete    | DT-03 and Zod validation             | 2026-08-17   |
| DT-14 | P1       | Complete Mobile Ergonomics & Viewport Verification Audit                          | In review   | DT-12 and responsive-dev.md          | 2026-08-17   |
| DT-15 | P1       | Execute Git Commit & Clean Deployment Release Snapshot                            | Complete    | DT-12, DT-13, DT-14                  | 2026-08-17   |
| DT-16 | P0       | Integrate Drizzle ORM & Serverless Neon PostgreSQL Data Layer                     | Complete    | DT-13, Website Prospecting System    | 2026-08-17   |
| DT-01 | P0       | Define & Approve AI-First Web Development & Local Presence Offerings & Claims Reg | In progress | Owner decisions and service specs    | 2026-09-03   |
| DT-02 | P0       | Secure Public APIs and Configuration                                              | Not started | DT-01 for endpoint scope             | 2026-08-07   |
| DT-03 | P0       | Make AI Web Dev Project Lead Capture & Scoping Resilient                          | In progress | Lead storage and notification setup  | 2026-08-07   |
| DT-04 | P0       | Transform Frontend for AI Web Dev Agency Positioning & Portfolio                  | In progress | DT-01 for copy and service structure | 2026-09-03   |
| DT-10 | P1       | Recreate the Legacy Derivative Genius Homepage Conversion Elements                 | Not started | DT-01 and DT-04                      | 2026-08-15   |
| DT-11 | P1       | Rebuild the Full Legacy Site Page Architecture                                     | Not started | DT-10, DT-01, DT-04                 | 2026-08-15   |
| DT-09 | P0       | Launch Paid Pilot AI Web Dev Project Onboarding & Payment Link Flow               | Blocked     | DT-18 qualified opportunity          | 2026-08-19   |
| DT-05 | P1       | Establish Automated Quality, Testing, and CI Gates                                | Complete    | None                                 | 2026-08-07   |
| DT-06 | P1       | Complete Accessibility and Responsive UX Verification                             | Not started | DT-04                                | 2026-08-07   |
| DT-07 | P1       | Establish SEO, GEO, Analytics, Privacy, and Operational Baselines                 | In progress | DT-01 and DT-04                      | 2026-09-03   |
| DT-08 | P1       | Make Deployment Configuration Reproducible                                        | Not started | DT-02                                | 2026-08-07   |

## Active development targets

### DT-19. Complete Centurion Pilot Readiness

**Priority:** P0

**Status:** In review

**Outcome:** Make `/centurion` the complete, secure system of record required for the ten-business-day manual pilot. This target fixes operator workflow gaps; it does not add scaled discovery or autonomous outreach.

- [x] Enforce Clerk authentication and Centurion roles inside every private page and API action.
- [x] Restrict exports and compliance administration to `centurion_admin`.
- [x] Replace raw normalized suppression values with keyed hashes and transactional opt-out handling.
- [x] Associate imports with a campaign and preserve useful source provenance.
- [x] Add editable website observations, contacts, qualification evidence, scores, statuses, and hard disqualifiers.
- [x] Fix the import-to-priority-queue path and require human score confirmation.
- [x] Add every required call outcome, custom notes, next action, owner, and due date.
- [x] Order the queue by overdue commitments, due follow-ups, engaged activity, and then qualified priority.
- [x] Add minimal audit approval, opportunity, proposal, and project-handoff records.
- [x] Calculate pilot metrics from real activities, work sessions, opportunities, and proposals.
- [x] Add unit and authorization-policy regression tests.
- [ ] Complete the signed-in Joe Terry readiness test from campaign creation through proposal retrieval.

**Done when:** An authorized operator can run a 25-prospect test campaign from import through proposal, retrieve every commitment and disposition, enforce an opt-out everywhere immediately, view accurate pilot metrics, and complete the process without a parallel spreadsheet.

**Verification:** Live `npm run db:push` passed; all six new workflow tables were verified through PostgreSQL `information_schema`; repository-wide `npm run lint` passes with zero errors and four existing warnings; `npx tsc --noEmit` passed; all 23 Jest tests passed; `npm run build` compiled all 31 routes; unauthenticated smoke checks redirect `/centurion` and return `401` for private APIs. Complete the authenticated readiness test in `doc/the-first-priority.md` before changing DT-19 to `Complete` or unblocking DT-18.

### DT-18. Run the 25-Company Founder-Led Manual Outreach Pilot

**Priority:** P0

**Status:** In progress

**Operating rule:** Software never delays market contact. Manual research, prospect qualification, high-leverage audits, and direct founder phone calls proceed immediately; `/centurion` serves as the durable record as its authenticated readiness test (DT-19) is completed.

**Outcome:** Validate a repeatable sales motion for fixed-scope Derivative Genius website engagements and recurring local presence retainers by manually researching and contacting 25 qualified companies in one vertical across approximately five cities. Ground outreach in Mike Stewart's direct-response audit methodology (`doc/lessons-of-localinternetpresence.md`). Use `/centurion` to support human judgment and record the work; do not expand automation during the pilot.

- [x] Select initial vertical and geographic market:
  - **Vertical:** HVAC (Heating, Ventilation & Air Conditioning) — high-ticket emergency replacements, AC repair, heat pumps, and ductwork.
  - **Geographic Market:** Lake County, California (Clearlake, Lakeport, Kelseyville, Middletown, Lower Lake, Nice, Lucerne).
- [ ] Define the dual pilot offer structure:
  - **Option A (Fixed Sprint):** Dedicated High-Converting HVAC Video Landing Page build ($1,500–$2,500) designed to convert paid/organic search traffic into booked emergency and replacement calls.
  - **Option B (Recurring Growth Retainer):** $300–$500/month "Done-For-You" Local Authority & GEO Retainer (weekly AI owner-voice podcast, open-web blog transcripts, GBP maintenance, and included Suno SERP term jingle).
- [ ] Hand-qualify 25 operating HVAC companies in/serving Lake County with verified source provenance and no disqualifier.
- [ ] Audit each prospect using the Mike Stewart High-Leverage Audit checklist:
  - **The Homepage Mistake:** Does the business run paid search/PPC ads that send visitors to a cluttered homepage instead of a dedicated, single-problem landing page?
  - **The Acoustic & GEO Blind Spot:** Is the business trapped on rented social media land with zero indexable open-web audio/transcripts cited by AI assistants (Gemini, ChatGPT, Perplexity)?
  - **Google Business Profile (GBP) Neglect:** Is the profile unverified, lacking owner review responses, or missing geo-tagged work photos?
  - **Mobile Call Friction:** Does the site take $>3$ seconds to load on mobile, or force users to pinch/search for a phone number rather than providing a sticky 1-tap `tel:` button?
- [ ] Record one specific, undeniable website or conversion observation and next action for every active prospect.
- [ ] Craft short, plain-language call openers focused on direct economic relief (e.g., stopping wasted ad spend on bouncing mobile clicks).
- [ ] Identify the best available public business line or verified decision-maker route.
- [ ] Place calls manually during appropriate local calling windows.
- [ ] Record every attempt, conversation, objection, commitment, opt-out, and follow-up in `/centurion`.
- [ ] Create a concise audit only after the prospect expresses interest or the conversation establishes a credible reason to continue.
- [ ] Hold discovery calls and issue at least one proposal when qualification supports it.
- [ ] Review results by city, score band, observation, opener, objection, and funnel stage.
- [ ] Document workflow friction and promote automation only for a repeated, measured bottleneck.

**Operating metrics:**

- qualified conversations per operator hour;
- decision-maker reach rate;
- follow-up commitments;
- discovery calls held;
- proposals issued (sprint vs. monthly retainer);
- closed revenue and average project value / MRR;
- loss and objection reasons; and
- time spent researching, calling, and following up.

Raw prospects, contacts found, calls attempted, and audits generated are supporting counts, not success criteria.

**Automation gate:** Do not add scaled Google Places discovery, mass enrichment, autonomous sequences, automatic audit delivery, or new volume-oriented background jobs until the pilot has produced qualified conversations and at least one proposal. A later automation target must name the measured bottleneck it removes.

**Done when:** All 25 prospects have a documented disposition; manual activity and follow-ups are recorded without a parallel private spreadsheet; the pilot has produced qualified conversations and at least one proposal, or enough structured evidence to revise the niche, offer, or outreach message; and the owner records a dated continue, revise, or stop decision.

**Verification:** Review the `/centurion` campaign, prospect sources, activities, suppressions, follow-up tasks, funnel report, proposal evidence, and dated pilot decision. Verification artifacts must not expose prospect PII or credentials in the repository.

### DT-20. Add Permission-Tracked Followup Queue (audit-led, no cold automation)

**Priority:** P0

**Status:** Not started

**Outcome:** Make targeted audits the primary source of new leads with a followup queue that gets more sophisticated internally while staying permission-gated externally. Every external touch carries a permission basis, passes a send-time suppression re-check, requires human approval, and is fully logged. Cold automation is explicitly out of scope and stays blocked by the DT-18 automation gate.

**Background:** `doc/The-Mission.md` v1.3 (§16) names targeted audits as the primary lead source and permission-based followup as the compounder. Current code gaps: `audits` PATCH to `sent` records no permission basis, recipient, or channel (`src/app/api/centurion/audits/route.ts`); `activities` accepts `email` / `audit_sent` types with no permission field and no send-time suppression check (`src/app/api/centurion/activities/route.ts`); queue/tasks UIs capture due dates but no permission basis. DT-20 closes exactly these gaps and nothing more.

- [ ] Add minimal additive permission tracking (preferred: small additive migration under `drizzle/manual/`, e.g. `followup_permission` enum `requested_info | granted_permission | established_conversation` plus approver, channel/recipient, and suppression-check result on the followup activity/audit-send record — no widening of prospect PII storage).
- [ ] Require permission basis + due date for `follow_up_requested` server-side (Zod rejection otherwise); block `email` / `audit_sent` activity creation and audit `sent` transitions without a recorded permission basis.
- [ ] Add send-time suppression re-check in the audit-send and external-followup API paths (keyed-hash lookup; blocked send returns a suppression error and logs the attempt without exposing raw contact values).
- [ ] Require human approval before any external send (audit `approved` → `sent` records approver + timestamp; external followup activity records approver; no timers, workers, or background jobs that send).
- [ ] Upgrade internal sophistication only: due-first ordering already exists — add overdue escalation surfacing and a read-only auto-draft of the next touch from call notes + audit findings that the founder edits and sends (drafts never send themselves).
- [ ] Surface permission basis + suppression clearance + approval state in the queue, tasks, prospect detail, and audits UIs so the founder sees *why this touch is allowed* before acting.
- [ ] Add Jest + authorization-policy regression tests: permissionless external send rejected; suppressed prospect send blocked at send time; approval attribution recorded; cold-sequence/bulk-send paths absent.
- [ ] Record verification without prospect PII in the repo.

**Explicit non-goals (stay blocked):** cold sequences, cold auto-texts, cold auto-calls, AI-voice calls, automatic audit blasts, bulk send, scaled Places discovery, mass enrichment, or any timer/worker that sends externally. Any of these needs a new dated decision after DT-18 produces qualified conversations and at least one proposal.

**Done when:** an authorized operator can (1) see overdue/permissioned followups surfaced first with an editable draft, (2) record a permission basis once per thread, (3) send an approved audit or requested followup only after a passing suppression re-check, (4) retrieve permission basis + approver + suppression result for every external touch, and (5) watch a permissionless or suppressed send get rejected server-side — all without a parallel spreadsheet and without any cold automation existing in the codebase.

**Verification:** run `npm run lint`, `npm test`, `npm run build`; exercise the signed-in queue → prospect → audits path with disposable test data (permissioned send succeeds and logs; permissionless/suppressed send rejected); confirm `/centurion` still redirects unsigned users and private APIs still return `401`; record dated evidence in the verification log without PII.

### DT-21. Build VSL Demo Assembler (Slice 1: no keys, no new deps)

**Priority:** P1

**Status:** Not started

**Outcome:** Let the founder demo "the page that rings" live on a call from data already in `/centurion` — a private, prospect-specific assembly of the book Ch. 5 five-part VSL (risk-reversal headline, 45–60s script + video slot, proof strip, agitation + FAQ-schema draft, sticky `tel:` button) with zero paid tools, zero trial keys, and zero new dependencies.

**Background:** `doc/The-Mission.md` v1.3 makes VSL pages + $300/$500 retainers the primary offer. The repo can display video (`src/components/LazyYouTube.tsx`) and diagnose missing VSL elements (`/centurion/audit-tools`) but cannot assemble a demo VSL. Trial-backed voiceover (TTS) and jingle synthesis are explicitly later slices — DT-21 must run fully with no keys set.

- [ ] Add a private Centurion demo route (e.g. `/centurion/demos/new?prospect=<id>`) behind the existing `requireCenturionPageAction` gate that assembles the 5-part page from the prospect record: SERP term + `websiteObservation` + `commercialConsequence` + review count → risk-reversal headline, 45–60s script draft from a book-grounded template (Problem → Agitate → "Watch my video"), proof strip from recorded review evidence, FAQ-schema draft, sticky `tel:` button reusing the prospect's public business phone.
- [ ] Video slot supports two no-cost inputs only: phone-video file reference/URL and unlisted-YouTube embed via the existing `LazyYouTube` component; empty state shows a shot-list card (what to film in 60 seconds) instead of failing.
- [ ] Voiceover preview uses browser-native Web Speech API synthesis only (client-side, no key, no account, no audio stored); jingle slot is a lyric + timing card (0–5s anchor / 5–12s benefit / 12–15s nudge) with no synthesis.
- [ ] Every demo is watermarked DEMO, private to `/centurion` (no public route, no indexing, no prospect PII committed to the repo), and links back to the prospect workspace; demo views/sends go through the DT-20 permission-tracked followup path once it lands (until then: show live on calls only, no external send).
- [ ] Add Jest + authorization-policy regression tests: unsigned users redirected / private APIs `401`; demo route requires a real prospect id and renders all five parts from disposable test data; no network calls to paid/trial providers exist in the Slice 1 code path.
- [ ] Record verification without prospect PII in the repo.

**Explicit non-goals (later slices):** server-side TTS/voice-clone, Suno/Udio jingle synthesis, avatar video, stock-media pipelines, podcast RSS publishing, any new dependency, any env key, any background job. Slice 2 (trial TTS) and Slice 3 (trial jingle) each get their own dated decision after Slice 1 demos on live calls.

**Done when:** an authorized operator can open a prospect, assemble the five-part demo page with an editable script, preview voiceover in-browser with no keys configured, see the shot-list empty state when no video exists, and show it live on a call — all passing `npm run lint`, `npm test`, and `npm run build` with no new dependencies and no trial accounts.

**Verification:** run `npm run lint`, `npm test`, `npm run build`; exercise the signed-in prospect → demo path with disposable test data; confirm unsigned redirect + private-API `401`; confirm no outbound provider calls and correct behavior with zero media keys set; record dated evidence in the verification log without PII.

### DT-12. Integrate Mobile-First Prospecting & Scoping Components

**Priority:** P0

**Status:** Complete

**Outcome:** Wire the accessible `ResponsiveDialog` (`src/components/ui/drawer.tsx`) into interactive prospecting workflows (Call Outcome Logger, Stage Mover, Follow-up Date Selector) with click-to-call (`tel:`) and click-to-email (`mailto:`) quick actions.

- [x] Create accessible `ResponsiveDialog` component (mobile bottom sheet, desktop modal).
- [x] Connect bottom sheets to quick actions (Call Outcome, Pipeline Stage Change, Quick Scope Inquiry).
- [x] Add 1-tap `tel:` and `mailto:` contact buttons in sticky `MobileBottomBar` thumb zone.
- [x] Ensure non-interactive multi-step forms use dedicated screens rather than bottom drawers.

**Done when:** Prospecting operators can log call results, change stages, and initiate calls on mobile with $\ge 48\text{px}$ touch targets in the bottom thumb zone.

### DT-13. Fortify Lead Intake Route & Scoping Persistence

**Priority:** P0

**Status:** In review

**Outcome:** Lead capture endpoint `src/app/api/contact/route.ts` is fully validated with Zod schemas, persisted to Drizzle PostgreSQL (`src/db/`), and sends instant Nodemailer/mailer notifications with optimistic UI states.

- [x] Add Zod validation schema for project scope, contact info, and budget.
- [x] Implement Drizzle PostgreSQL lead persistence and resilient email notification dispatch.
- [x] Add Sonner toast notifications (`sonner`) and optimistic loading feedback.

**Done when:** Mobile form submissions register instantly with server-side sanitization and zero data loss.

### DT-14. Complete Mobile Ergonomics & Viewport Verification Audit

**Priority:** P1

**Status:** In review

**Outcome:** All site pages (`/`, `/about`, `/contact`, `/portfolio`, `/services`, `/solutions`) are audited against `doc/responsive-dev.md` standards.

- [x] Audit touch target sizes ($\ge 48\text{px}$) and target gaps ($\ge 8\text{px}$).
- [x] Ensure hero CTAs are placed in the lower thumb-friendly arc zone on mobile (< 768px).
- [x] Verify zero horizontal overflow across 360px, 390px, and 414px viewports.

**Done when:** All mobile pages pass automated layout and touch target audits with sub-100ms INP.

### DT-15. Execute Git Commit & Clean Deployment Release Snapshot

**Priority:** P1

**Status:** Complete

**Outcome:** Repository working tree is clean, verified with `npm run build`, and committed with a comprehensive git message.

- [x] Run full build verification (`npm run build`).
- [x] Stage all updated target docs and mobile PWA components.
- [x] Create comprehensive git commit snapshot.

**Done when:** `git status` reports clean working tree and build verification passes.

### DT-16. Integrate Drizzle ORM & Serverless Neon PostgreSQL Data Layer

**Priority:** P0

**Status:** Complete

**Outcome:** Full-stack relational database layer (`src/db/`) established with Drizzle ORM and Neon PostgreSQL serverless driver matching MicrogreensLA stack specifications.

- [x] Install `drizzle-orm`, `@neondatabase/serverless`, and `drizzle-kit`.
- [x] Configure `drizzle.config.ts` for automated Drizzle Kit migrations.
- [x] Define relational schema (`src/db/schema.ts`) for campaigns, prospects, contacts, audits, suppressions, and activities.
- [x] Create serverless database client connection helper (`src/db/index.ts`).
- [x] Wire live Neon `DATABASE_URL` secret into `.env.local` and push schema with `npm run db:push`.

**Done when:** `npm run db:push` applies relational tables cleanly to live Neon PostgreSQL with 100% passing tests and build verification.

### DT-17. Implement Private Operator Prospecting System (/centurion) Phase 1

**Priority:** P0

**Status:** In review

**Outcome:** Private operator web application built at `/centurion` behind Clerk authentication and explicit role assignment, with campaign targeting, prospect records, evidence-aware CSV import, deduplication, transparent scoring, action-prioritized manual outreach, audits, pipeline records, reporting, and compliance controls.

- [x] Protect every `/centurion` page and API data action with Clerk authentication and server-side role checks.
- [x] Implement fail-closed Centurion role governance (`src/lib/auth/roles.ts`) with explicit Joe Terry administrator configuration.
- [x] Build transparent v1.0 lead scoring engine (`src/lib/prospecting/scoring.ts`) and Jest unit test suite.
- [x] Build multi-tier deduplication hierarchy engine (`src/lib/prospecting/dedup.ts`) matching Place ID, domain, phone, and address.
- [x] Add `auditLogs` table to schema (`src/db/schema.ts`) and API endpoints for campaigns, prospects, import, export, and activities.
- [x] Create responsive operator layout (`src/app/centurion/layout.tsx`) and screens (`/centurion`, `/centurion/campaigns`, `/centurion/prospects`, `/centurion/prospects/[id]`, `/centurion/import`, `/centurion/queue`, `/centurion/compliance`).
- [x] Complete server-side role enforcement, campaign-aware qualification, durable follow-ups, audits, opportunities, proposals, and real pilot reporting under DT-19.
- [ ] Pass the signed-in end-to-end readiness test under DT-19.

**Done when:** Unit tests pass, `/centurion` routes compile in a Next.js production build, and the DT-19 readiness workflow proves all Phase 1 operator flows function without a parallel spreadsheet.

### DT-01. Define & Approve AI-First Web Development & Local Presence Offerings & Claims Register

**Priority:** P0

**Status:** In progress

**Outcome:** Public copy accurately describes Derivative Genius AI-first web development and local presence services using both plain-English analogies and technical specs (Next.js 16, React 19, TypeScript, Tailwind CSS, Zod, Jest), incorporating the high-converting methodologies of Mike Stewart (`doc/lessons-of-localinternetpresence.md`).

- [x] Align agency focus explicitly around AI-First Web Development, Web Applications, and High-Converting Local Presence Systems.
- [x] Migrate core stack to Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS matching MicrogreensLA.
- [x] Incorporate plain-language analogies ("Smart Digital Employee", "24/7 Digital Assistant", "Search by Meaning", "Digital Dominoes") into home, service, and README documentation.
- [ ] Define core service offerings with primary focus first:
  - **Primary: Local Presence, GEO & Direct-Response Engines (The LIP Model)**
    - **Single-Problem Video Landing Pages**: Blazing-fast, mobile-first landing pages built without menu distractions, featuring problem-specific explainer video containers, instant trust proof, and sticky 1-tap mobile phone dialers.
    - **Local Authority & GEO Retainer ($300/mo Core, $500/mo Growth)**: "Done-For-You" weekly audio podcasts recorded via ElevenLabs voice clone of the owner, transcribed into rich SEO/GEO blog articles on the client's primary domain, and syndicated to Apple/Spotify/Amazon/YouTube for authoritative backlinks. Includes continuous Google Business Profile (GBP) optimization and free AI SERP-term jingle.
    - **Auditory Brand Retention (SERP Term Earworms)**: Suno AI-generated musical signatures embedding the exact high-ranking SERP term and phone anchor, exploiting involuntary musical imagery (INMI) to guarantee local recall.
    - **Hyper-Local Video Ad Arbitrage**: 5-second skippable YouTube pre-roll ad architectures broadcasting television-grade branding into local living rooms on smart TVs for $0 when skipped.
  - **Secondary: Modern Full-Stack & AI Web Applications (sold secondarily, on readiness)**
    - **AI-Native Web Applications**: Custom web apps built with embedded AI capabilities (chat, search, automated workflows).
    - **Modern Full-Stack Web Development**: High-performance Next.js 16 single-page & server-rendered applications.
    - **AI Feature Integration & API Orchestration**: Embedding LLM APIs, fine-tuned models, and smart automation into existing web apps.
    - **Web Application Modernization**: Upgrading legacy, slow web systems to high-speed serverless architectures.
- [ ] Establish transparent project and retainer tiers (primary first):
  - **High-Converting Video Landing Page Package** ($1,500 fixed setup)
  - **Core Local Presence & GEO Retainer** ($300/month recurring)
  - **Full-Service Growth Retainer** ($500/month recurring + client ad spend)
  - **Fixed-Scope Website Package** ($2,000–$5,000, sold secondarily)
  - **MVP Web App Sprint** ($2,500–$5,000+ fixed sprint, sold secondarily)
- [ ] Create a claims register covering build velocity, code quality benchmarks, accessibility compliance, sub-1-second mobile load speeds, and verified review integration.

**Done when:** All material claims map to an approved web dev claims register, and public pages reflect active capabilities, retainer pricing, and direct-response clarity.

### DT-10. Recreate the Legacy Derivative Genius Homepage Conversion Elements

**Priority:** P1

**Status:** Not started

**Outcome:** The current Derivative Genius website includes the strongest legacy conversion elements from derivativegenius.com while preserving the new AI-first agency positioning, modern Next.js layout, and responsive conversion flow.

- [ ] Audit the live homepage and extract all proven conversion sections and patterns.
- [ ] Recreate the brand/hero framing: logo treatment, headline, subhead, and primary CTA flow.
- [ ] Port the core value proposition narrative: AI automation agency positioning, business impact, and plain-English explanations.
- [ ] Add the MicrogreensLA demo bot callout and CTA to the AI training / lead-generation story.
- [ ] Add the newsletter signup block with safe validation and consent language.
- [ ] Add the customer examples / testimonial section and proof-based social trust content.
- [ ] Restore the article, contact, and about navigation structure and link flow.
- [ ] Add the footer with social links, legal/footer branding, and site-level navigation.
- [ ] Validate responsive layout, clear CTA hierarchy, and conversion-focused copy against the live reference.

**Done when:** The homepage includes the legacy site’s core trust and conversion elements while fitting the new messaging, design system, and performance constraints.

**Verification:** Design review against the live homepage, responsive QA, CTA path checks, and confirmation that all major sections render without broken links or missing form validation.

### DT-11. Rebuild the Full Legacy Site Page Architecture

**Priority:** P1

**Status:** Not started

**Outcome:** The non-homepage pages from derivativegenius.com are recreated in the modern Next.js product so the full site carries the same legacy content architecture and conversion intent as the original, while aligning each page to the new AI-first agency brand.

- [ ] Map the legacy site navigation and page structure: Home, Articles, Contact, and About.
- [ ] Recreate the About page with the original founder/agency story, mission language, and trust-building business narrative.
- [ ] Recreate the Contact page with a conversion-first intake form, proof messaging, and clear service CTAs.
- [ ] Recreate the Articles page with article cards, editorial hierarchy, and CTA paths to deeper content.
- [ ] Ensure each page preserves a consistent CTA funnel to project scoping and inquiry capture.
- [ ] Validate footer links, social links, and page-to-page navigation patterns against the live site.
- [ ] Confirm the overall experience remains clean, conversion-led, and mobile-responsive after the migration.

**Done when:** All key legacy pages are present in the new site and match the original information architecture and conversion flow while using the current branding and technical stack.

**Verification:** Page-by-page content parity review, navigation QA, CTA flow checks, and responsive review against the live reference site.

### Page-by-page implementation checklist

This checklist covers the full site conversion rebuild. Each page should be checked against both the live legacy site and the new AI-first messaging framework before it is marked complete.

#### Home page
- [ ] Restore the legacy hero framing and value proposition while keeping the AI-first agency positioning.
- [ ] Retain the headline, subheadline, and CTA hierarchy for project inquiry and consultation.
- [ ] Add the “we are all standing on the shoulders of giants” brand narrative and plain-English value proposition.
- [ ] Include the MicrogreensLA demo bot story and CTA in a way that supports lead capture.
- [ ] Re-add trust-building proof blocks: customer examples, newsletter signup, and business value statements.
- [ ] Implement the "Eat Your Own Cooking" conversion elements:
  - Personal 60-to-90 second explainer video of founder Joe Terry addressing local business owners directly.
  - Persistent, sticky 1-tap call button (`tel:`) in the mobile bottom thumb zone and desktop header.
  - Interactive audio demonstration playing the Derivative Genius 15-second Suno SERP earworm jingle.
- [ ] Verify the page fully matches the conversion flow: headline -> video / jingle -> CTA -> contact / 1-tap call.
- [ ] Confirm mobile responsiveness, sub-1-second mobile load speed, and zero distracting background animations that delay calling.

#### About page
- [ ] Restore founder/agency story and mission-driven narrative from the legacy site.
- [ ] Add AI-first positioning, engineering methodology, and security/quality framing.
- [ ] Include three to five proof pillars that explain what the agency does and why it is credible.
- [ ] Add a strong CTA to project scoping or consultation.
- [ ] Ensure branding tone is confident, educational, and conversion-minded without becoming generic.

#### Services page
- [ ] Recreate the service catalog in plain English and technician-friendly language.
- [ ] Keep the four core analogies: smart digital employee, 24/7 digital assistant, search by meaning, and digital dominoes.
- [ ] Introduce the Local Presence & GEO Engine offerings: single-problem video landing pages, automated audio/podcast transcription pipelines, and AI-generated SERP-term earworms.
- [ ] Add transparent pricing and retainer framing ($300 Core / $500 Growth retainers; fixed-scope sprints) that invites inquiry rather than creating friction.
- [ ] Link each service to a project inquiry path or scoping CTA.
- [ ] Salesforce/CRM style service clarity is not required for the first pass, but decision clarity is.

#### Solutions / industry pages
- [ ] Recreate the industry-specific solution positioning from the legacy business story.
- [ ] Map each industry to a real use case, value proposition, and example AI workflow.
- [ ] Showcase high-ticket local service blueprints (pest control, roofing, plumbing, niche rental operators) demonstrating how video landing pages and GEO capture high-intent local demand.
- [ ] Keep solution cards concise, high-clarity, and visually scannable.
- [ ] Add CTAs that push the user toward a consultation or project inquiry.

#### Articles page
- [ ] Restore the editorial layout and article card hierarchy.
- [ ] Recreate article metadata: title, author, date, and category.
- [ ] Preserve the educational tone and trust-building positioning of the brand.
- [ ] Ensure every article card leads into an article detail page with a clean reading experience.
- [ ] Include a newsletter or subscription capture that matches the conversion flow.

#### Article detail page
- [ ] Preserve article readability with strong typography and scannable sections.
- [ ] Keep author/date metadata and sticky or prominent navigation back to the articles index.
- [ ] Add a CTA to project scoping or contact after the article content.
- [ ] Ensure article content and layout feel editorial, not like a generic blog template.

#### Contact page
- [ ] Preserve the conversion-first design and clear inquiry CTA.
- [ ] Keep the service selection, budget range, and message fields that drive project scoping.
- [ ] Confirm the form uses server-side validation and safe, durable lead capture.
- [ ] Include proof language that reassures the visitor the request is real and reviewed.
- [ ] Add post-submit success messaging with next-step clarity.
- [ ] Validate the form path to the API, notification pipeline, and project inquiry flow.

#### Footer and shared navigation
- [ ] Recreate the navigation links and trust cues across all pages.
- [ ] Restore social links and site-level callouts in the footer.
- [ ] Ensure nav and footer are consistent across Home, About, Services, Solutions, Articles, and Contact.
- [ ] Confirm all links point to valid routes and do not dead-end or break the conversion funnel.

**Completion rule:** A page is complete only when the copy, CTA flow, design hierarchy, technical implementation, and user path match the legacy site’s intent while reflecting the current AI-first positioning.

### DT-07. Establish SEO, GEO, Analytics, Privacy, and Operational Baselines

**Priority:** P1

**Status:** In progress

**Outcome:** Establish a dual-engine discovery architecture (traditional SERP SEO + LLM Generative Engine Optimization) powered by automated audio-to-text transcript pipelines, podcast RSS backlink syndication, complete JSON-LD structured data, privacy-preserving analytics, and operational baselines matching Mike Stewart's playbooks (`doc/lessons-of-localinternetpresence.md`).

- [ ] Implement the Dual-Engine Discovery Pipeline:
  - **Traditional SERP SEO**: Meta title tags, descriptions, Open Graph cards, sitemaps (`sitemap.ts`), and canonical links for all public routes.
  - **Generative Engine Optimization (GEO)**: Semantic question-and-answer sections answering hyper-local service inquiries, formatted for direct citation in ChatGPT, Google Gemini, Claude, and Perplexity.
- [ ] Implement Open-Web Audio & Transcript Pipeline:
  - Publish rich text transcripts directly on primary domain URLs alongside multimedia/audio players.
  - Establish podcast RSS feed endpoint (`/feed/podcast.xml`) syndicateable to Apple Podcasts, Spotify, Amazon Music, and YouTube to build authoritative domain backlinks.
- [ ] Inject complete JSON-LD structured data schema across all public routes:
  - `LocalBusiness`, `ProfessionalService`, `Service`, `FAQPage`, and `Review` schemas.
- [ ] Configure lightweight, privacy-respecting client analytics without third-party surveillance scripts.
- [ ] Add Google Search Console & Bing Webmaster verification tokens to environment configuration.

**Done when:** All public routes generate validated JSON-LD schema, podcast RSS feed validates cleanly, and GEO semantic structure passes automated accessibility and SEO audit checks.

### DT-05. Establish Automated Quality, Testing, and CI Gates

**Priority:** P1

**Status:** Complete

**Outcome:** Contributors run single non-interactive commands (`npm run lint`, `npm test`, `npm run build`) to verify linting, unit tests, and Next.js production build.

- [x] Configure Next.js ESLint (`eslint-config-next`) and Jest testing environment.
- [x] Add Jest test suite (`src/app/__tests__/page.test.tsx`).
- [x] Verify `npm run lint`, `npm test`, and `npm run build` pass cleanly on the new Next.js 16 stack.

**Done when:** `npm run lint` yields 0 warnings/errors, `npm test` passes all Jest tests, and `npm run build` generates Next.js production artifacts without error.

**Verification:** Passed Jest test suite (2/2 tests pass), ESLint run (0 errors), and Next.js production build (7 static/dynamic pages compiled in 2.8s).

## Decision log

### 2026-09-07: DT-21 VSL Demo Assembler Slice 1 (no paid tools, free trials later)

Primary offer per `doc/The-Mission.md` v1.3 is VSL pages + $300/$500 retainers, but the repo can only display video, not assemble a demo VSL. DT-21 Slice 1 closes that with zero cost and zero trial risk: private Centurion demo route from existing prospect data, phone-video/YouTube slot via `LazyYouTube`, browser-native speech preview, lyric-card jingle slot, DEMO watermark, no new deps, no keys, no jobs. Trial-backed TTS (Slice 2) and jingle synthesis (Slice 3) are deferred to their own dated decisions after Slice 1 demos on live calls. Demo distribution follows the DT-20 permission-tracked path.

### 2026-09-07: DT-20 Permission-Tracked Followup Queue (audit-led, no cold automation)

Per `doc/The-Mission.md` v1.3 §16, targeted audits become the primary source of new leads and followup gets more sophisticated within permission bounds. DT-20 is the smallest implementation of that charter change: additive permission basis + approver + suppression-check result on followup/audit-send records, server-side permission + send-time suppression gates, human-approval-before-send, overdue surfacing + read-only auto-drafts internally. It explicitly does not authorize cold sequences, auto-texts/calls, audit blasts, bulk send, or send-timers — those stay blocked under the DT-18 automation gate until the pilot produces qualified conversations and at least one proposal.

### 2026-09-03: Integrating Local Internet Presence (LIP) Principles into Agency Strategy and Pilot Targets

Adopted core principles from Mike Stewart's 30-year local marketing playbook (`doc/lessons-of-localinternetpresence.md`) to refine agency positioning, pilot outreach, and product offerings:
1. **Offer Architecture (DT-01)**: Expanded service catalog to incorporate a high-margin, predictable recurring revenue model ($300–$500/mo Local Authority & GEO Retainer) alongside custom web application sprints. Added single-problem Video Landing Pages, AI SERP Term Jingles (Suno), and 5-second YouTube pre-roll ad arbitrage.
2. **Founder-Led Pilot (DT-18)**: Grounded prospect qualification in high-leverage friction audits: identifying "The Homepage Mistake" (spending money on Google Ads that route paid clicks to general homepages), mobile phone friction, GBP neglect, and missing GEO indexing. Opener scripts focus on concrete, money-saving fixes.
3. **Anti-Agency Web Standard (DT-04)**: Codified conversion-centered hero essentials (direct headline, problem subhead, zero-friction 1-tap call CTA, verified trust badges) and eliminated vanity agency bloat (slow video backgrounds, sliders) across public pages.
4. **GEO Infrastructure (DT-07)**: Formalized the Audio-to-Text GEO pipeline on the open web, including syndicated podcast feeds (Apple, Spotify, Amazon, YouTube) for authoritative backlinks and LLM citation dominance.

### 2026-08-19: DT-17 Reopened and DT-18 Blocked Pending Pilot Readiness

A code-level capability audit found that the implemented Centurion foundation does not yet satisfy its stated Phase 1 exit criterion. Normal UI imports cannot reach the score-75 priority queue, the UI lacks durable follow-up and complete disposition controls, audits have no operator workflow, opportunities and proposals are absent, pilot reporting is synthetic, and Clerk roles are defined but not enforced inside data actions.

DT-17 is therefore returned to `In review`, DT-18 is blocked, and DT-19 becomes the immediate P0 remediation target. This work is limited to the manual system of record and does not authorize scaled discovery, enrichment, or autonomous outreach.

### 2026-08-19: DT-19 Implementation Complete, Authenticated Review Pending

Centurion now implements the manual system of record required by DT-18: explicit server-side roles, administrator-only exports and compliance, keyed DNC hashes with transactional opt-out updates, campaign-aware evidence import, human-confirmed scoring, due-first calling, complete outcomes and follow-ups, decision-maker contacts, audits, opportunities, proposals, handoffs, work sessions, and real pipeline reporting. The additive schema was pushed to live Neon and the Joe Terry Clerk account was explicitly configured as `centurion_admin` locally. DT-19 moves to `In review`; DT-18 remains blocked until Joe performs the signed-in readiness checklist with test data.

### 2026-08-19: Manual Outreach Validation Precedes Further Prospecting Automation

Founder-led manual outreach is now the immediate P0 operating objective. The existing `/centurion` Phase 1 application will support a 25-company pilot in one vertical across approximately five cities, while the operator manually researches prospects, places calls, records outcomes, follows up, and advances qualified opportunities.

The public website remains the credibility and conversion layer for prospects who investigate Derivative Genius after contact. Additional discovery, enrichment, scoring, sequencing, and background-job automation is deferred until the pilot produces qualified conversations and at least one proposal. Future automation must address a repeated bottleneck demonstrated by pilot evidence rather than increase list size for its own sake.

### 2026-08-07: Plain-Language Analogies Incorporated Across Marketing & Docs

Formally integrated plain-English analogies ("Smart Digital Employee", "24/7 Digital Assistant", "Search by Meaning", and "Digital Dominoes") alongside technical specifications in the Home page (`src/app/page.tsx`), Services page (`src/app/services/page.tsx`), `README.md`, and `doc/current-development-targets.md`.

### 2026-08-17: Tech Stack Migrated to Next.js 16 + TypeScript + Tailwind CSS (MicrogreensLA Stack)

Formally updated the technology stack of Derivative Genius (`derivativegenius-com`) to match `/home/knowself/webdev/microgreensla/`: Next.js 16 App Router, React 19, TypeScript 5.3+, Tailwind CSS v3, Radix UI primitives, Zod schema validation, and Jest testing framework.

### 2026-08-17: Drizzle ORM & Neon PostgreSQL Serverless Stack Adopted

Standardized database architecture on Drizzle ORM + `@neondatabase/serverless` PostgreSQL matching the MicrogreensLA data stack. Implemented schema definitions (`src/db/schema.ts`), serverless client (`src/db/index.ts`), automated Drizzle Kit migrations (`drizzle.config.ts`), and successfully pushed 6 core relational tables (`campaigns`, `prospects`, `contacts`, `audits`, `suppressions`, `activities`) to live Neon PostgreSQL instance.

## Verification log

Add evidence here whenever a target status changes to `In review` or `Complete`.

| Date       | Scope                  | Evidence                  | Result                                                                                                                                                     |
| ---------- | ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-07 | Plain Language Copy    | Web & Target Update       | Added "In Plain English" explainer section & business benefits to Home page, Services page, README.md, and current-development-targets.md.                  |
| 2026-08-07 | Stack Migration        | Repository Upgrade        | Replaced Vue 3 CLI with Next.js 16 App Router, TypeScript, Tailwind CSS, Zod, and Jest matching MicrogreensLA stack.                                        |
| 2026-08-07 | Quality Gates          | `npm test` & `npm build`  | Pass; Jest tests pass 100%, `npx eslint .` reports 0 errors, and Next.js production build (`next build`) compiles 7 static/dynamic routes in 2.8s.        |
| 2026-08-17 | Django Removal         | `rm` & Build Pass         | Completely removed Django framework, settings, apps, & DB; `npm run build` passes 100% with zero remaining Django references.                             |
| 2026-08-17 | Mobile PWA & Architecture | Next.js Build           | Added Web App Manifest (`manifest.ts`), App-Shell Service Worker (`sw.js`), ResponsiveDialog, and progressive Haptics API. Next.js build passes 16/16 routes. |
| 2026-08-17 | Mobile Ergonomics (DT-12/14) | Build & Audit Pass | Added `MobileBottomBar` thumb zone CTAs, 1-tap call/email, fluid typography `clamp()`, iOS zoom guard, 48px touch targets. Next.js build passes 100%. |
| 2026-08-17 | Lead Intake (DT-13)    | Jest & Validation Pass | Fortified `/api/contact` with Zod schema sanitization, Drizzle PostgreSQL persistence, resilient `mailer.ts` dispatch, and 100% passing Jest test suite (5/5 tests). |
| 2026-08-17 | Release Snapshot (DT-15) | Build & Clean Status | Cleaned legacy Vue/Vite env keys, removed unreferenced `src/firebase.js`, verified tests/build 100% pass, and created clean commit snapshot. |
| 2026-08-17 | Drizzle & Neon DB (DT-16) | `db:push` & Test Pass | Pushed relational schema to live Neon PostgreSQL instance, creating 6 core tables (`campaigns`, `prospects`, `contacts`, `audits`, `suppressions`, `activities`); Jest test suite and production build pass 100%. |
| 2026-08-19 | Centurion Capability Audit | Code and workflow review | DT-17 returned to `In review`; DT-18 blocked; DT-19 opened to correct queue, role, follow-up, audit, pipeline, suppression, and reporting gaps. |
| 2026-08-19 | Centurion DT-19 implementation | Schema, tests, build, auth smoke | Live schema push passed; six new tables verified; repository lint passed with 0 errors (4 warnings); TypeScript passed; Jest 23/23 passed; Next.js compiled 31/31 routes; unsigned page redirects and private APIs return 401. Signed-in Joe workflow remains the completion gate. |

## Migration plan: Align stack with MicrogreensLA (remove Python/Django) — COMPLETE

**Status:** Complete (2026-08-17)

**Goal:** Replaced the Django/Python backend with a Node/Next.js-only stack matching `microgreensla` (Next.js + TypeScript + Tailwind), removed runtime Python dependencies, and migrated backend responsibilities to serverless handlers.

**Why:** Simplify deployment, unify runtime (Node.js), reduce maintenance overhead, and make the repo consistent with the MicrogreensLA reference implementation.

**High-level steps (ordered):**

1. Audit and remove legacy Python/Django, Vue.js, and Firebase dependencies.
2. Map server-side features to Next.js 16 Route Handlers (`src/app/api/*`) and serverless handlers.
3. Replace legacy NoSQL persistence with Drizzle ORM + Neon PostgreSQL (`src/db/`).
4. Replace legacy environment variable keys with standard Next.js and PostgreSQL variables (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`).
5. Update `package.json` scripts, CI pipelines, and `README.md` to reflect the unified Node/PostgreSQL stack.
6. Run full verification: `npm test` and `npm run build`.

**Checklist (deliverable-oriented)**
- [x] Audit feature inventory with mapping doc `doc/migration-audit.md`.
- [x] Implement `src/app/api/contact/route.ts` replacement (Zod validation + Drizzle PostgreSQL persistence).
- [x] Remove all Firebase runtime dependencies, SDKs, and configuration files.
- [x] Replace notification dispatch with a Node mailer service (`src/lib/mailer.ts`).
- [x] Update `.env.example` and `.env.local` for PostgreSQL database connectivity.
- [x] Remove legacy Python, Vue, and Firebase setup artifacts.
- [x] Update docs: `README.md`, `doc/current-development-targets.md`, and deployment guides.
- [x] CI passes and build verification (`npm run build`) verifies 100% route compilation.

**Done criteria / verification**
- All public user flows (contact intake → persistence → notification) run end-to-end on Node-only stack.
- `npm run lint`, `npm test`, and `npm run build` pass in CI and locally.
- No Python runtime required to start any service in the repo; `requirements*.txt` removed or archived.
- Updated documentation records the migration and any remaining technical debt.

**Risks & notes**
- Some Django-only features (custom admin integrations, complex Celery workflows) may require interim architecture (small Node worker) before safe removal.
- Preserve a read-only archive of the Django source for audit and historical traceability until migration is verified.

**Estimated effort:** 2–6 engineer-days depending on background job complexity and admin UI scope.
