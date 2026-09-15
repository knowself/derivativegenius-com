# Derivative Genius User Manual — The operating instrument for the mission

**App:** `/centurion` (private operator console, Derivative Genius)
**Mission:** make local businesses **found, remembered, called** — via respectful, audit-led conversations, compounded city by city to $150M ARR.
**Source of truth for strategy:** `doc/The-Mission.md` (v3.2). This manual is the *how-to-use-the-app* companion. If the two ever conflict, The-Mission wins.

> **The one idea behind this manual:** every screen in `/centurion` exists to move one number — **qualified conversations per operator hour** — and to turn those conversations into retainers. If what you're doing in the app isn't serving that, stop doing it.

---

## 1. What the app is for (and what it is not)

`/centurion` is the **system of record** for the founder-led outreach motion. It:

- holds the market you're working (campaigns),
- holds the businesses you've qualified (prospects),
- tells you who to call next (queue),
- remembers every outcome and promise (activities, tasks),
- carries audits from draft to approved to sent (audits),
- tracks money-in-motion (pipeline),
- proves what happened with real numbers (reports),
- and enforces the guardrails automatically (suppressions, roles, audit logs).

It is **not** a marketing blaster, an auto-dialer, or a sequence machine. There is no bulk send anywhere in this app, and there never will be without a new dated founder decision. Agents prepare, draft, and surface; **humans approve and send.** If a workflow you're imagining ends with the app contacting someone on its own, that workflow doesn't belong here.

---

## 2. Roles — who sees what

| Role | Home | Can do |
|---|---|---|
| `centurion_admin` (Joe) | `/centurion` | Everything: campaigns, queue, audits, pipeline, compliance, exports, team |
| `prospector` | `/operator` | Research, call, log outcomes, qualify, audits, pipeline — no exports, no compliance admin |
| `customer` | `/portal` | Own portal only |
| `viewer` | `/no-access` | Read-only. Cannot create, edit, call, suppress, or export anything |

Sign-in is handled by Clerk. If `/centurion` bounces you to sign-in or to another dashboard, that's the role gate working — not a bug.

---

## 3. The map: which screen serves which mission goal

| Mission goal (The-Mission §) | Screen | What it accomplishes |
|---|---|---|
| Lock one market at a time (§7.1) | `/centurion/campaigns` | One vertical × one geography per campaign, with the offer and price range written down |
| Build the 25-company list (§8, DT-18) | `/centurion/import`, `/centurion/prospects` | Evidence-backed CSV import with dedup; every prospect carries source, observation, score, suppression status, next action |
| Run the daily call block (§6) | `/centurion/queue` | Due-first queue: overdue commitments first, then due follow-ups, then priority leads |
| Record every outcome (§3.3) | Queue → activity log | 11 standard outcomes; `follow_up_requested` requires a due date; `do_not_contact` suppresses immediately |
| Keep every promise | `/centurion/tasks` | Dated follow-up commitments, retrievable and sortable by overdue |
| Audits earn (§2, §3.2) | `/centurion/audits` | `draft → internal_review → approved → sent`; human approval before anything leaves the building |
| Turn interest into money (§3.4) | `/centurion/pipeline` | Opportunities → proposals → project handoffs, every deal with a dated next step |
| Prove it with numbers (§3.4, §6) | `/centurion/reports` | Calls, conversations, discovery, proposals, founder hours, pipeline value — from real records, no vanity counts |
| Permission + suppression doctrine (§7) | `/centurion/compliance` | Suppressions, audit-log trail, admin-only export |
| Diagnose a site fast (§3.2) | `/centurion/audit-tools` | Structured checks backing the 5-check audit stack |

---

## 4. First 14 days in the app (The-Mission §8)

Do these in order. Nothing else in the app matters until they work.

- [ ] **Day 1:** Create your campaign at `/centurion/campaigns` — e.g. `chamber-clearlake-2026` or the Lake County HVAC pilot. Name it `vertical-place-year`. Import your first members/companies at `/centurion/import` with source noted (e.g. `chamber-directory-2026-09-14`).
- [ ] **Day 2:** Research 5 high-visibility businesses. For each, record **one specific, viewport-confirmed website observation** on its prospect page — something you saw on your phone, reproducible, tied to a customer action. Never an invented number.
- [ ] **Day 3:** First event or first call block. Open `/centurion/queue`, call the top item, log the outcome **before** dialing the next number.
- [ ] **Days 4–10:** 5 audits/day drafted (`/centurion/audits`, status `draft` → `internal_review`), call blocks from the queue, 5 audit walkthroughs booked (`meeting_booked`).
- [ ] **Day 11:** Lunch-and-learn pitch. Log it as a work session in `/centurion/reports`.
- [ ] **Days 12–14:** First 2 proposals in `/centurion/pipeline` (1 VSL + 1 retainer). Friday: open `/centurion/reports` and read the funnel honestly.

**Success in 14 days:** 60+ imported, 25+ audits drafted, 10+ conversations, 3+ discoveries, 1+ proposal. If the numbers say otherwise, the numbers — not your mood — decide what changes.

---

## 5. Screen-by-screen guide

### 5.1 Dashboard (`/centurion`) — start every session here

The dashboard opens with a **blockers header**: overdue follow-ups, proposals awaiting decision, audits stuck before send, open deals with no next action. Rule: **clear blockers before new leads.** Commitments you already made outrank calls you haven't placed — the mission measures kept promises, not dial volume.

Below that: due-today count, proposals outstanding ($), weighted pipeline ($), priority leads (score 75+). Then the four-step revenue workflow — queue → audits → pipeline → next campaign — and recent activity. If the blockers count is zero, the dashboard tells you the next safe valuable action: work the queue.

### 5.2 Campaigns (`/centurion/campaigns`) — one market, one experiment

A campaign locks: **vertical + state + ~5 cities + qualification floor (min reviews/rating) + offer + price range.** Sixty seconds to create; then it runs invisibly — imports and new prospects default to the first active campaign automatically.

Campaigns turn a pile of prospects into a **measurable experiment**: same market, same offer, same time window, so the Day 10 continue/revise/stop verdict rests on evidence. Filter the list by status; act on cards as pushes end:

- **Pause** — "not now, maybe later." Prospects leave the queue; everything resumes cleanly on reactivate. Use for seasonal lulls or capacity crunches.
- **Complete** — "finished, it ran its course." Use when the pilot delivered its verdict or the market converted.
- **Retire** — "killing this one." Asks for confirmation, writes to the audit log. Use for dead verticals or failed offers. **Nothing is ever deleted** — a retired campaign is the evidence that justifies stopping it.

> New here and campaigns feel like busywork? They are, until Day 10 — then they're the whole argument. Create one, ignore the page for ten working days, retire or complete it at review.

### 5.3 Import (`/centurion/import`) — the 25-company list enters here

Paste CSV rows with **source evidence and commercial consequence** per company. Rules the app enforces for you:

- Every row needs a real business name; blanks and guesses score zero — nothing is inferred.
- **Dedup is automatic** across domain → phone → name: re-importing a business returns a conflict, not a duplicate.
- Pick the campaign first (active sorts to the top; retired is disabled). No campaign, no import — provenance is mandatory.

Spend 10–15 minutes of human research per company *before* importing. The import screen records evidence; it cannot create it.

### 5.4 Prospects (`/centurion/prospects`) — one page per business, total recall

Each prospect page is the **single place** the readiness test demands for "every required pilot field and outcome": evidence flags, decision-maker contacts, transparent score with human confirmation, website observation, qualification status, suppression state, activities, audits, opportunities, tasks. Open it before every call — contact route, observation, offer sentence, and suppression status are all there.

**Lead scoring (the model, not a verdict):** customer value >$1k (20) · specific nameable website issue (20) · 30+ reviews (15) · reachable decision-maker (10) · multiple locations (10) · running ads (10) · weak booking flow (10) · growth trigger (5). Bands: **75–100 priority · 60–74 qualified/nurture · 40–59 research only · <40 excluded.** Human judgment overrules the score; the score prompts, never decides.

### 5.5 Queue (`/centurion/queue`) — the daily 90 minutes

The queue orders itself **due-first**: overdue commitments, then due follow-ups, then engaged prospects, then priority leads. Prospects in paused/completed/retired campaigns and suppressed contacts never appear. Your job:

1. Call the top item (manual call, public business line, `tel:` link on mobile).
2. Pick one of the 11 outcomes, write a short factual note, set a next action + due date whenever a commitment was made (`follow_up_requested` *requires* one).
3. Only then dial the next number. **No outcome left unlogged, ever.**

The touch sequence from the mission maps directly onto outcomes — intro (`decision_maker_reached`), teaser delivered (`audit_requested` only with permission), value touch (note it), breakup (`not_interested` with the reason, no rebuttal), opt-out (`do_not_contact` → instant suppression, pursuit ends everywhere, permanently).

### 5.6 Audits (`/centurion/audits`) — the trust wedge

The audit is the lead. Standard: **20 minutes to produce, 1 page to read, ≤3 problems, zero invented numbers**, run through the 5-check stack (one-problem page? sticky tap-to-call? hero proof? GBP health? owned content?). Workflow is gated: `draft → internal_review → approved → sent` — a human reviews every word before delivery, screenshots stay private, and the full audit goes out **only after interest or a credible conversation reason**. Before that: the teaser (one observation) plus a booking link, nothing more.

Record the audit on the prospect page, approve it in the audits list, and log the send as an activity with the permission basis written in the notes (`requested_info`, `granted_permission`, or `established_conversation`).

### 5.7 Pipeline (`/centurion/pipeline`) — interest becomes money

Move qualified conversations through discovery → proposal → negotiation → won, one dated next step per deal at all times. Record the **offer ladder in order — never pitch all at once:**

1. Free 20-min audit (trust wedge, already delivered)
2. **VSL Sprint — $1,500:** one problem, one 45–60s video, one sticky call button, 2–3 week build
3. **Growth Retainer — $300/mo Core / $500/mo Growth + ad spend:** weekly owner-voice content on their domain, GBP maintenance, jingle included
4. Expansion ($2k–$5k rebuilds, portals) only when ready

Close language: *"Most members start with the $1,500 page so wasted clicks stop bouncing, then keep the $300/$500 factory running so Google and AI assistants cite you every week. Which problem should we fix first?"* Log loss reasons on closed-lost — they're Day 10 evidence.

### 5.8 Tasks (`/centurion/tasks`) — promises kept

Every follow-up commitment lives here with an owner and a due date. Overdue surfaces first, everywhere. Check it at the start of every block; end every day with zero undated promises. This screen is the difference between "good conversations" and revenue.

### 5.9 Reports (`/centurion/reports`) — the Friday review

Real records only: companies, priority count, calls, conversations, audit requests, audits sent, meetings, proposals, open follow-ups, founder hours, weighted pipeline, won value — plus conversation rate, proposal rate, and revenue per founder hour. Also log work sessions here (research/call/follow-up minutes per campaign) so the pilot judges economics honestly.

**Read it weekly. Kill the worst opener, double the best. Decide with numbers.**

### 5.10 Compliance (`/centurion/compliance`) — the guardrails, enforced

Suppressions (keyed hashes — raw phone/email values are never stored), the audit-log trail of sensitive actions, and admin-only export. Exporting prospect data requires `centurion_admin` and is logged; treat every export as a supervised event. Prospect PII never enters the repo, screenshots, analytics, or public pages — no exceptions.

### 5.11 Audit-tools, Team, Newsletter

- **Audit-tools:** structured site checks behind fast audits — use while drafting, confirm every fail in a real phone viewport before quoting it.
- **Team:** admin-only role assignment. Grant `prospector` to operators (they land in `/operator`, a leaner research-call-close console); keep `viewer` read-only until trust is earned.
- **Newsletter:** subscriber management for the public-site audience — separate from prospect outreach, never mixed.

---

## 6. Operating rhythms (put these on the calendar)

**Daily — 90-minute call block (non-negotiable):** open dashboard → clear blockers → `/centurion/queue` top-down → log every outcome immediately → end with zero undated promises. Follow-up commitments come before new calls.

**Daily shutdown (5 min):** every call has an outcome · every promise has an owner + due date · every opt-out suppressed · no PII left in notes beyond what's needed · time logged · one learning note captured · tomorrow's first action clear.

**Weekly:** 1 audit-batch morning · call blocks Tue–Thu (10am–12pm, 2–4pm local) · Friday `/centurion/reports` review · 1 post on your own domain + 1 GBP update (eat your own cooking) · ask 3 happy contacts for reviews.

**Monthly:** re-run the 5-minute self-audit on derivativegenius.com · funnel review by vertical/city/opener · kill worst opener, double best · dated continue/revise/stop note for each live campaign.

---

## 7. How you know it's working (Phase A exit criteria)

Check these in `/centurion/reports` + campaign dispositions — not in your gut:

- Every member/prospect has a **documented disposition**
- **≥30%** had a real conversation with a decision-maker
- **≥10 retainers + pipeline ≥$50k weighted** (Phase A chamber math)
- One lunch-and-learn delivered (logged as a work session)
- A **dated continue / revise / stop** recorded per campaign

Then clone the motion to the next vertical or city: new campaign, same loop. Every city compounds — transcripts, reviews, GBP history, and proof from real towns make each new audit sharper. That compounding is the moat, and this app is where it accumulates.

---

## 8. The 8 guardrails (in-app behavior version)

1. **One vertical × one geography per campaign** until dispositioned. Don't mix markets in one list.
2. **One viewport-confirmed observation before any call.** If you didn't see it on a phone, don't say it.
3. **Manual calls on public business lines.** No auto-dialing, no prerecorded or AI cold voice, no cold auto-text — the app has no such buttons, keep it that way.
4. **External sends only on permission** (`requested_info` / `granted_permission` / `established_conversation`), written in the activity notes, human-approved. Drafts never send themselves.
5. **Opt-out ends pursuit everywhere, immediately, permanently.** `do_not_contact` → suppression → gone from queue. Never override because a prospect looks valuable.
6. **No invented numbers.** No traffic, conversion, ranking, compliance, or revenue claims without evidence. Cite real client results under their conditions, or say nothing.
7. **Prospect PII stays in Neon.** Never in repo files, screenshots committed anywhere, analytics, exports lying around, or public pages.
8. **Measure revenue, not list size.** MRR, proposals, closes, churn. Raw prospect counts are supporting trivia.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix in the app |
|---|---|---|
| Queue is empty but prospects exist | Campaign paused/completed/retired, or all prospects excluded/suppressed | Check campaign status at `/centurion/campaigns`; check suppression state on prospect pages |
| Import says "choose campaign first" | No campaign selected (or none active) | Create/activate one at `/centurion/campaigns`, then import |
| Duplicate warning on import | Business already exists (dedup working) | Open the existing prospect instead — update its evidence |
| Can't export | Requires `centurion_admin` | Ask Joe; exports are logged supervised events |
| Landed on `/no-access` | `viewer` role | Request `prospector` from an admin |
| Proposal stuck with no next step | Missing `nextActionAt` on the opportunity | Date it in `/centurion/pipeline` — every open deal needs one |
| Reports look flat | Activities/tasks logged elsewhere or not at all | The app only reports what's recorded — log outcomes in the queue, hours in reports |

---

*This manual grows with the mission. When a new screen ships or a rule changes, update this file alongside `doc/The-Mission.md` and `doc/current-development-targets.md` — never let the manual drift from the app.*
