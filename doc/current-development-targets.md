# Current Development Targets

**Project:** Derivative Genius (`derivativegenius-com`)

**Current focus:** Transition Derivative Genius into a premiere **AI-First Web Development Agency** — leveraging full-stack agentic coding workflows, modern UI/UX design systems, hybrid serverless architecture (**Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v3, Radix UI, Zod, and Jest**), plain-language client explanations, and specialized AI resources (`.agent/` suite) to deliver high-impact, AI-native websites, web applications, and intelligent web portals for enterprise and growth-stage clients.

**Source documents:** `README.md`, `FIREBASE_SETUP.md`, `.agent/` (agent & skill repository), `package.json`, `devs.sh`, and the implementation under `src/app/`, `src/components/`, and `src/lib/`

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
- Complex third-party OAuth integrations beyond standard Firebase Authentication.

Deferred work may be promoted only through a dated decision that defines its release outcome and dependencies.

## Next five targets to production release

Work these in sequence. DT-05 quality work may continue in parallel.

1. **DT-01 — Define & Approve AI-First Web Development Offerings & Claims Register.** Define core service packages, plain-language business analogies, technology stacks, pricing tiers, and public copy.
2. **DT-02 — Secure Public APIs and Environment Secrets.** Protect endpoints, sanitize input schemas via Zod, and verify credential security.
3. **DT-03 — Make AI Web Dev Project Lead Capture & Scoping Resilient.** Enforce data-persistence-first pattern with detailed project requirements and notification handling.
4. **DT-04 — Transform Frontend for AI Web Dev Agency Positioning & Portfolio.** Refine UI components, plain-English explainer sections, interactive project intake tools, and service pages.
5. **DT-09 — Launch Paid Pilot AI Web Dev Project Onboarding & Payment Link Flow.** Qualify real client leads and process deposit/project payments via approved hosted payment links or invoices.

## Target summary

| ID    | Priority | Target                                                                  | Status      | Depends on                           | Last updated |
| ----- | -------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------ | ------------ |
| DT-01 | P0       | Define & Approve AI-First Web Development Offerings & Claims Register   | In progress | Owner decisions and service specs    | 2026-08-07   |
| DT-02 | P0       | Secure Public APIs and Configuration                                    | Not started | DT-01 for endpoint scope             | 2026-08-07   |
| DT-03 | P0       | Make AI Web Dev Project Lead Capture & Scoping Resilient                | In progress | Lead storage and notification setup  | 2026-08-07   |
| DT-04 | P0       | Transform Frontend for AI Web Dev Agency Positioning & Portfolio        | In progress | DT-01 for copy and service structure | 2026-08-07   |
| DT-09 | P0       | Launch Paid Pilot AI Web Dev Project Onboarding & Payment Link Flow     | Blocked     | DT-01 through DT-04                  | 2026-08-07   |
| DT-05 | P1       | Establish Automated Quality, Testing, and CI Gates                      | Complete    | None                                 | 2026-08-07   |
| DT-06 | P1       | Complete Accessibility and Responsive UX Verification                   | Not started | DT-04                                | 2026-08-07   |
| DT-07 | P1       | Establish SEO, GEO, Analytics, Privacy, and Operational Baselines       | Not started | DT-01 and DT-04                      | 2026-08-07   |
| DT-08 | P1       | Make Deployment Configuration Reproducible                              | Not started | DT-02                                | 2026-08-07   |

## Active development targets

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
