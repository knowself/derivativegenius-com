# Current Development Targets

**Project:** Derivative Genius (`derivativegenius-com`)

**Current focus:** Transition Derivative Genius into a premiere **AI-First Web Development Agency** — leveraging full-stack agentic coding workflows, modern UI/UX design systems, hybrid serverless architecture (**Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v3, Radix UI, Zod, and Jest**), plain-language client explanations, and specialized AI resources (`.agent/` suite) to deliver high-impact, AI-native websites, web applications, and intelligent web portals for enterprise and growth-stage clients.

**Source documents:** `README.md`, `.agent/` (agent & skill repository), `package.json`, `devs.sh`, and the implementation under `src/app/`, `src/components/`, `src/db/`, and `src/lib/`

**Baseline reset:** August 7, 2026

**Review cadence:** Update when a target changes and review the full document every Friday.

**Document owner:** Repository maintainer

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

Ship a secure, high-converting production web platform for Derivative Genius as an **AI-First Web Development Agency**. The platform highlights our AI-native web development offerings (AI-Driven Web Apps, Intelligent Frontend/Backend Systems, AI Workflow & LLM Integration, Custom Web Portals), features clear plain-English explanations for non-technical clients, captures detailed project requirements safely via server-side Zod validation, and offloads payment collection to hosted Stripe/invoice links.

```text
Client Visitor on DerivativeGenius.com
    -> Explores Plain-English AI Web Dev Services & Scoping Intake Form
        -> Submits Web Development Project Inquiry / Consultation Request
            -> Validated Server-Side via Zod (Route Handler: /api/contact)
                -> Durable Lead Storage with Detailed Project Scope (Primary)
                    -> Asynchronous Notification Dispatch (Secondary)
                        -> Developer Discovery & Plain-English Technical Project Proposal
                            -> Hosted Deposit / Milestone Payment Link
                                -> Captured Production Payment & AI-Driven Project Kickoff
```

The current release is an agency platform and client portal interface designed for maximum conversion. It leverages our full frontend design asset library, dynamic background animations (`DynamicBackground.tsx`), plain-language business analogies, and Next.js 16 App Router infrastructure.

**First-dollar definition:** At least one real external client completes a captured production payment of at least $1 for an approved Derivative Genius AI-first web development or consulting package. The transaction, project specification, receipt, and development milestone kickoff must be verified without committing client PII or sensitive credentials to this repository.

The release is complete when:

- Visitors can clearly evaluate Derivative Genius AI-First Web Development services with both plain-English analogies and technical specifications.
- Every primary call to action (CTA) routes to a validated project inquiry path.
- Inquiries are validated on the server via Zod, saved durably, and backed by resilient notifications.
- Public API endpoints do not expose administrative functions or unauthenticated triggers.
- Material tech stack claims, performance statistics, and case study demos are verified or qualified.
- The repository passes linting (`npm run lint`), unit/integration tests (`npm test`), production build (`npm run build`), and deployment verification.
- Search Engine & Generative Engine Optimization (SEO/GEO) and Core Web Vitals monitor user experience cleanly.

## Release boundaries

### Included in this release

- Production Next.js 16 App Router frontend positioned for AI-First Web Development (Home, Services, About, Contact, API Route Handlers) with plain-English analogies ("Digital Employee", "24/7 Digital Assistant", "Search by Meaning", "Digital Dominoes").
- Interactive web project scope & intake form incorporating Radix UI primitives, dynamic animations (`DynamicBackground.tsx`), and Tailwind CSS v3 styling.
- Full-stack AI-first developer resources and workflows integrated via `.agent/` skills and guidelines.
- Secure server-side form validation via Zod schemas (`/api/contact`).
- Resilient email dispatch capability via Nodemailer.
- Comprehensive automated linting (ESLint Next.js config), testing (Jest + Testing Library), and production build verification (`next build`).
- SEO, GEO (Generative Engine Optimization), JSON-LD structured data for `WebDevelopment` services, and sitemap generation.

### Deferred until demand and operating readiness are proven

- Fully automated instant client code-generation portal with self-checkout.
- Real-time client project dashboard with automated GitHub progress tracking and automated invoice generation.
- Containerized Cloud Run LLM worker deployment pipeline before volume demands dedicated GPU compute nodes.
- Complex third-party OAuth integrations beyond standard session authentication.

Deferred work may be promoted only through a dated decision that defines its release outcome and dependencies.

## Next five targets to production release

Work these in sequence. DT-05 quality work may continue in parallel.

1. **DT-01 — Define & Approve AI-First Web Development Offerings & Claims Register.** Define core service packages, plain-language business analogies, technology stacks, pricing tiers, and public copy.
2. **DT-02 — Secure Public APIs and Environment Secrets.** Protect endpoints, sanitize input schemas via Zod, and verify credential security.
3. **DT-03 — Make AI Web Dev Project Lead Capture & Scoping Resilient.** Enforce data-persistence-first pattern with detailed project requirements and notification handling.
4. **DT-04 — Transform Frontend for AI Web Dev Agency Positioning & Portfolio.** Refine UI components, plain-English explainer sections, interactive project intake tools, and service pages.
5. **DT-10 — Recreate the Legacy Derivative Genius Homepage Conversion Elements.** Bring over the proven conversion content from derivativegenius.com while adapting it to the new AI-first agency positioning and current frontend architecture.
6. **DT-11 — Rebuild the Full Legacy Site Page Architecture.** Recreate the non-homepage pages from derivativegenius.com — About, Articles, Contact, and supporting conversion/content pages — in the new Next.js site without losing the AI-first agency narrative.
7. **DT-09 — Launch Paid Pilot AI Web Dev Project Onboarding & Payment Link Flow.** Qualify real client leads and process deposit/project payments via approved hosted payment links or invoices.

## Target summary

| ID    | Priority | Target                                                                  | Status      | Depends on                           | Last updated |
| ----- | -------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------ | ------------ |
| DT-12 | P0       | Integrate Mobile-First Prospecting & Scoping Components                 | Complete    | DT-04 and responsive-dev.md          | 2026-08-17   |
| DT-13 | P0       | Fortify Lead Intake Route & Scoping Persistence                         | Complete    | DT-03 and Zod validation             | 2026-08-17   |
| DT-14 | P1       | Complete Mobile Ergonomics & Viewport Verification Audit                | In review   | DT-12 and responsive-dev.md          | 2026-08-17   |
| DT-15 | P1       | Execute Git Commit & Clean Deployment Release Snapshot                  | Complete    | DT-12, DT-13, DT-14                  | 2026-08-17   |
| DT-01 | P0       | Define & Approve AI-First Web Development Offerings & Claims Register   | In progress | Owner decisions and service specs    | 2026-08-07   |
| DT-02 | P0       | Secure Public APIs and Configuration                                    | Not started | DT-01 for endpoint scope             | 2026-08-07   |
| DT-03 | P0       | Make AI Web Dev Project Lead Capture & Scoping Resilient                | In progress | Lead storage and notification setup  | 2026-08-07   |
| DT-04 | P0       | Transform Frontend for AI Web Dev Agency Positioning & Portfolio        | In progress | DT-01 for copy and service structure | 2026-08-07   |
| DT-10 | P1       | Recreate the Legacy Derivative Genius Homepage Conversion Elements       | Not started | DT-01 and DT-04                      | 2026-08-15   |
| DT-11 | P1       | Rebuild the Full Legacy Site Page Architecture                           | Not started | DT-10, DT-01, DT-04                 | 2026-08-15   |
| DT-09 | P0       | Launch Paid Pilot AI Web Dev Project Onboarding & Payment Link Flow     | Blocked     | DT-01 through DT-04                  | 2026-08-07   |
| DT-05 | P1       | Establish Automated Quality, Testing, and CI Gates                      | Complete    | None                                 | 2026-08-07   |
| DT-06 | P1       | Complete Accessibility and Responsive UX Verification                   | Not started | DT-04                                | 2026-08-07   |
| DT-07 | P1       | Establish SEO, GEO, Analytics, Privacy, and Operational Baselines       | Not started | DT-01 and DT-04                      | 2026-08-07   |
| DT-08 | P1       | Make Deployment Configuration Reproducible                              | Not started | DT-02                                | 2026-08-07   |

## Active development targets

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

**Status:** Complete

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

### DT-01. Define & Approve AI-First Web Development Offerings & Claims Register

**Priority:** P0

**Status:** In progress

**Outcome:** Public copy accurately describes Derivative Genius AI-first web development services using both plain-English analogies and technical specs (Next.js 16, React 19, TypeScript, Tailwind CSS, Zod, Jest).

- [x] Align agency focus explicitly around AI-First Web Development & Web Applications.
- [x] Migrate core stack to Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS matching MicrogreensLA.
- [x] Incorporate plain-language analogies ("Smart Digital Employee", "24/7 Digital Assistant", "Search by Meaning", "Digital Dominoes") into home, service, and README documentation.
- [ ] Define core service offerings:
  - **AI-Native Web Applications**: Custom web apps built with embedded AI capabilities (chat, search, automated workflows).
  - **Modern Full-Stack Web Development**: High-performance Next.js 16 single-page & server-rendered applications.
  - **AI Feature Integration & API Orchestration**: Embedding LLM APIs, fine-tuned models, and smart automation into existing web apps.
  - **Web Application Redesign & Modernization**: Upgrading legacy web systems to high-speed, modern serverless stacks.
- [ ] Establish transparent project tiers (e.g. MVP Web App Sprint, Enterprise Web Portal, AI Integration Package).
- [ ] Create a claims register covering build velocity, code quality benchmarks, accessibility compliance, and performance guarantees.

**Done when:** All material claims map to an approved web dev claims register, and public pages reflect active web development capabilities with plain-language clarity.

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
- [ ] Verify the page fully matches the conversion flow: headline -> CTA -> contact form -> project inquiry.
- [ ] Confirm mobile responsiveness and strong visual hierarchy across hero, value props, and CTAs.

#### About page
- [ ] Restore founder/agency story and mission-driven narrative from the legacy site.
- [ ] Add AI-first positioning, engineering methodology, and security/quality framing.
- [ ] Include three to five proof pillars that explain what the agency does and why it is credible.
- [ ] Add a strong CTA to project scoping or consultation.
- [ ] Ensure branding tone is confident, educational, and conversion-minded without becoming generic.

#### Services page
- [ ] Recreate the service catalog in plain English and technician-friendly language.
- [ ] Keep the four key conversion narratives: smart digital employee, 24/7 digital assistant, search by meaning, and digital dominoes.
- [ ] Add price or scope framing that invites inquiry rather than creating friction.
- [ ] Link each service to a project inquiry path or scoping CTA.
- [ ] Salesforce/CRM style service clarity is not required for the first pass, but decision clarity is.

#### Solutions / industry pages
- [ ] Recreate the industry-specific solution positioning from the legacy business story.
- [ ] Map each industry to a real use case, value proposition, and example AI workflow.
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

### 2026-08-07: Plain-Language Analogies Incorporated Across Marketing & Docs

Formally integrated plain-English analogies ("Smart Digital Employee", "24/7 Digital Assistant", "Search by Meaning", and "Digital Dominoes") alongside technical specifications in the Home page (`src/app/page.tsx`), Services page (`src/app/services/page.tsx`), `README.md`, and `doc/current-development-targets.md`.

### 2026-08-07: Tech Stack Migrated to Next.js 16 + TypeScript + Tailwind CSS (MicrogreensLA Stack)

Formally updated the technology stack of Derivative Genius (`derivativegenius-com`) to match `/home/knowself/webdev/microgreensla/`: Next.js 16 App Router, React 19, TypeScript 5.3+, Tailwind CSS v3, Radix UI primitives, Zod schema validation, and Jest testing framework.

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

## Migration plan: Align stack with MicrogreensLA (remove Python/Django) — COMPLETE

**Status:** Complete (2026-08-17)

**Goal:** Replaced the Django/Python backend with a Node/Next.js-only stack matching `microgreensla` (Next.js + TypeScript + Tailwind), removed runtime Python dependencies, and migrated backend responsibilities to serverless handlers.

**Why:** Simplify deployment, unify runtime (Node.js), reduce maintenance overhead, and make the repo consistent with the MicrogreensLA reference implementation.

**High-level steps (ordered):**

1. Audit and remove legacy Python/Django, Vue.js, and Firebase dependencies.
2. Map server-side features to Next.js 16 Route Handlers (`src/app/api/*`) and serverless handlers.
3. Replace Firebase/Firestore persistence with Drizzle ORM + Neon PostgreSQL (`src/db/`).
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
