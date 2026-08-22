# Centurion Pilot Readiness

## Goal

Make `/centurion` the complete, secure system of record required to begin the DT-18 manual outreach pilot without a parallel spreadsheet.

## Tasks

- [x] Reconcile DT-17, DT-18, and DT-19 status across the three prospecting documents. → Verify: summaries, dependencies, and readiness gates agree.
- [x] Add regression tests for authorization, keyed suppression hashes, import scoring, queue priority, dispositions, next actions, and quoted CSV. → Verify: 18 focused prospecting tests pass.
- [x] Extend the Drizzle schema with prospect findings, tasks, opportunities, proposals, work sessions, and required indexes. → Verify: Drizzle generated a valid temporary migration and live `db:push` succeeded.
- [x] Centralize Clerk role checks and apply them inside every Centurion route handler and protected server page. → Verify: unauthenticated page redirects; private APIs return `401`; role policy tests pass.
- [x] Complete campaign-aware import, prospect editing, contact management, transparent qualification, and suppression-safe queue selection. → Verify: implementation compiles and the scoring path can produce priority records from confirmed evidence.
- [x] Complete call outcomes, notes, durable next actions, audits, opportunity/proposal stages, and pilot reporting. → Verify: routes, schema, and operator screens compile in production.
- [x] Run database validation, repository lint, type checks, unit tests, production build, and unauthenticated workflow smoke tests. → Verify: live tables present, lint passes with zero errors, type-check passes, Jest 23/23 passes, and build 31/31 routes passes.
- [ ] Run Joe Terry's authenticated workflow smoke test. → Verify: complete the checklist in `doc/the-first-priority.md` with disposable test data.
- [ ] Record the signed-in verification evidence and unblock DT-18 only after the readiness test passes. → Verify: the development target status and evidence match the repository.

## Done when

- [ ] A 25-prospect test campaign can be operated end to end in Centurion.
- [ ] Every outcome, commitment, suppression, audit, opportunity, and proposal is retrievable.
- [ ] Role boundaries and administrative exports are enforced server-side.
- [ ] Pilot metrics are calculated from real records.
- [ ] No parallel spreadsheet is required.
