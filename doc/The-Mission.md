# The Mission — Chamber-to-City Game Plan to $150,000,000 ARR

> Build useful intelligence into the fabric of real businesses — and do it with human judgment, technical discipline, and respect for the people the technology serves.

**Organization:** Derivative Genius
**Founder / Centurion:** Joe Terry
**Operating instrument:** `/centurion`
**Canonical sales doctrine:** [`/book — Local Internet Presence`](https://www.derivativegenius.com/book) (Mike Stewart playbook, retold) + `doc/lessons-of-localinternetpresence.md`
**Document type:** Mission + go-to-market game plan + Eve agent build plan
**Version:** 3.2 — Eve-first deployment, ICP agents later
**Date:** September 8, 2026
**North Star:** $150,000,000 ARR from book-grounded local-presence systems
**Stack exception:** EX-2026-09-08-01 ACTIVE (see §10.1) — ICP canisters authorized on revenue path alongside Next.js + Neon
**Deployment posture (decided 2026-09-08):** Eve-first. All agents ship on Eve (Vercel) until promotion criteria in §9.6 are met. ICP agent hosting is reserved for named candidates only.

---

## 0. The mission in one paragraph

Derivative Genius exists to make local businesses **found, remembered, called.** We do it with single-problem VSL pages, owner-voice content factories, SERP-term jingles, GBP rescue, and hyper-local YouTube — sold via respectful, audit-led conversations, delivered with engineering discipline, and compounded city by city until we serve tens of thousands of paying locations at $150M ARR.

This file is the game plan for getting there starting with the single highest-leverage wedge available to a founder: **your local chamber of commerce.**

---

## 1. The math to $150M ARR — what has to be true

Primary engine is recurring, not one-time builds:

| Offer | Price | $/yr per account | Accounts needed alone for $150M |
|---|---|---|---|
| Core Retainer | $300/mo | $3,600 | 41,667 |
| Growth Retainer | $500/mo + ad spend | $6,000 | 25,000 |
| VSL Setup (one-time) | $1,500 | — (cash + wedge) | — |
| Fixed site (one-time, secondary) | $2,000–$5,000 | — | — |

**Blended target model that hits $150M:**

- 20,000 Growth @ $500/mo = $120M ARR
- 7,000 Core @ $300/mo = $25.2M ARR
- ~$4.8M ARR-equivalent from VSL setups ($1,500 × ~3,200/yr run-rate), care plans, and expansion web systems

**Total: ~27,000 active retainer locations.**

Why this is believable: the U.S. has ~4,000+ chambers and ~30M small businesses. 27,000 = <0.1% of SMBs = ~270 cities × 100 retainer clients per city. One chamber (150–600 members) converts to 15–60 retainers. One metro (5–10 chambers + non-members) converts to 100–300 retainers. Repeat 270 times with team + AI factory.

One-time cash funds growth but ARR is the scoreboard. Every audit is scored on: **did it create a retainer conversation?**

---

## 2. Strategic sequence — chamber → city → cities

```
Phase A: Dominate ONE chamber (Days 0-90)
  -> Phase B: Own your CITY — all chambers + verticals (Months 4-9)
    -> Phase C: Clone to 5 cities in your region (Months 10-18)
      -> Phase D: 30-city operator network (Years 2-3)
        -> Phase E: 270-city AI-factory network to $150M (Years 3-7)
```

No cold spam at any phase. Doctrine from v1.3 holds: **audits earn; followup compounds — always on permission.** Every external touch needs permission basis + suppression re-check + human approval, logged in `/centurion`.

---

## 3. PHASE A — Dominate your home chamber (Days 0–90)

Goal: 100% of fellow members audited, 30%+ in conversation, 10–20 retainers + 5–10 VSLs closed. Become "the audit guy," not "the web guy."

### 3.1 Week 0: Join right

1. Join as an active member, not a logo. Pay, show up, volunteer for the membership / ambassadors committee — that gives you legitimate reason to meet everyone.
2. Positioning line (memorize): *"I help local businesses get found, remembered, and called — I do free 20-minute website audits for members so wasted ad clicks stop bouncing."* No jargon, no "AI-first."
3. Get: member directory CSV, event calendar, newsletter ad slot, new-member list access, permission to do a 10-min lunch-and-learn on "The 5-Minute Self-Audit."
4. In `/centurion`: create campaign `chamber-[city]-[year]` — e.g. `chamber-clearlake-2026`. Import every member with source=`chamber-directory-[date]`. Dedup by domain → phone → name+postal. Tag `chamber-member`, `pillar-5-borrowed-traffic`.

### 3.2 The Audit Factory — one audit per member

You will produce a short, specific, evidence-cited audit for **every** other member. This is Pillar 5 + Book Ch. 8. The audit is the lead.

**Audit SLA:** 20 minutes to produce, 1 page to read, ≤3 problems, zero invented numbers.

Use the standard 5-check stack (from `/book#audit` + `doc/pass-the-audit-workbook.md`):

1. **One problem, one page?** Do their Google ads / services all dump to homepage? (Ch. 5 Homepage Mistake)
2. **Sticky tap-to-call?** On a 390px viewport, is `tel:` reachable in <3 sec without menu hunting?
3. **Hero proof?** No slider ✅? Reviews + phone visible above fold?
4. **GBP health?** Claimed? NAP exact? 20+ reviews? 1-stars answered? Fresh job photos <7 days?
5. **Owned content?** Anything indexable on their domain, or trapped in Facebook/Instagram (Ch. 6 Trap 2)?

**Audit template (copy/paste per member, store in `/centurion/audits`):**

```
Subject: 20-min look at [Business] — 2 things I noticed [FirstName]

Hi [FirstName] — fellow [Chamber] member here. I looked at [site] on my phone
as a customer would, plus your Google listing.

What’s working: [1 genuine strength]

2 friction points I can show you in 60 seconds:
1. [Observation + screenshot] — e.g. “Services + ads land on homepage, no
   single-problem page for ‘AC repair Clearlake’ — visitors bounce in ~3s.”
   (Book Ch. 5)
2. [Observation + screenshot] — e.g. “No sticky call button on mobile; phone
   is in hamburger menu. 90%+ of your callers are on phones.”

What I’d do first: [one smallest fix — usually VSL page OR GBP rescue].
Range if we did it: [$1,500 VSL] / [$300–$500/mo factory].

Worth a 20-min walkthrough Tue or Thu? I’ll bring the fix outline and you
keep it either way. If not useful, I’ll close the loop and won’t chase.

— Joe Terry, Derivative Genius | [phone] | fellow member
P.S. Full 5-min self-check is here: [link to /book#audit]
```

Rules:
- Human viewport confirmation required before quoting any fail.
- Never claim traffic loss, revenue loss, rankings, or compliance without evidence.
- Screenshots stay private. Never publish a member’s negative audit publicly.
- `draft → internal_review → approved → sent` only. Full audit sent only after interest OR credible conversation reason. Pre-interest: send only the teaser (1 observation) + book link.

**Production cadence:** 5 audits/day × 5 days = 25/week. A 200-member chamber = 8 weeks solo. Batch: mornings research, midday calls, afternoons followup.

### 3.3 In-person + call followup engine (permission-gated)

Chamber gives you implied social permission to introduce yourself once — not to blast. After that, Book Ch. 8 permission rules apply.

**Touch sequence per member (log every touch in `/centurion` with permission basis):**

| Day | Action | Script / asset |
|---|---|---|
| 0 | In-person intro at mixer / ribbon-cutting | “What’s the one job you wish the phone rang for right now? Mind if I take a 20-min look at how that page handles on a phone and send you what I find?” — captures `granted_permission` |
| 1 | Deliver teaser (1 observation + book Ch. 5 link) | Email/text ONLY if they said yes or requested info. Otherwise call the public business line manually |
| 3 | Manual call #1 on public business line | Opener: “Hi [Name], it’s Joe with [Chamber] — I noticed [one factual observation] on mobile, took 60 seconds to screenshot. Worth 20 minutes to show you, or should I close it out?” Max 3 discovery questions, explicit next-step close |
| 7 | Value touch | Send their SERP-term lyric card (3 lines: 0–5s anchor / 5–12s benefit / 12–15s nudge) OR 45-sec Loom walking their mobile hero. No ask beyond “useful?” |
| 14 | Manual call #2 | New observation, not “bumping this up” |
| 21 | Lunch-and-learn invite / 1-on-1 audit offer | “I’m doing free 20-min audits for members this month — want one of the slots?” |
| 30 | Breakup + leave-behind | “Closing your file — here’s the self-audit link if you ever want a second look. Who do you send referrals to for [category]? Happy to send folks your way.” |

Outcomes to log: `no_answer, voicemail, gatekeeper, decision_maker_reached, audit_requested, meeting_booked, follow_up_requested, not_interested, do_not_contact, disqualified`. `do_not_contact` → keyed-hash suppression everywhere immediately.

**Weekly chamber operating rhythm:**
- Mon: 2-hr audit batch (10 audits drafted)
- Tue–Thu: mixers + call blocks (10am–12pm, 2–4pm local only) + 20-min audit deliveries
- Fri: pipeline review in `/centurion/reports` — qualified convos/hr, discovery rate, proposals, revenue, loss reasons. No vanity counts.

### 3.4 Offer ladder — what you’re encouraging them into

Never pitch all at once. Sell the smallest responsible fix:

1. **Free 20-min audit** (trust wedge)
2. **Option A — VSL Sprint $1,500:** one problem, one 45–60s video, one sticky call button. Risk-reversal headline, proof strip, FAQ schema. Built in 2–3 weeks.
3. **Option B — Growth Factory $300/mo Core / $500/mo Growth + ad spend:** weekly owner-voice podcast (3-min phone memo → transcript blog on THEIR domain → RSS to Apple/Spotify/YouTube) + GBP maintenance + SERP jingle included. Owner replies “YES” by SMS; we do the rest (Book Ch. 10 AI Factory).
4. **Expansion only when ready:** $2k–$5k site rebuild, portals, automations.

Close language: “Most members start with the $1,500 page so wasted clicks stop bouncing, then keep the $300/$500 factory running so Google and AI assistants cite you every week. Which problem should we fix first — [their #1 money job]?”

**Phase A exit criteria:** every member has a disposition in `/centurion`; ≥30% had a real conversation; ≥10 retainers + pipeline ≥$50k weighted; one lunch-and-learn delivered; dated continue/revise/stop logged.

---

## 4. PHASE B — Own the city (Months 4–9)

Goal: 100+ retainers in your home city. You’ve proven the chamber; now cover the whole market.

1. **Expand vertical by vertical, not all at once.** Repeat the DT-18 loop: 1 vertical × ~5 zip clusters at a time. Priority order: HVAC → plumbing → roofing → electrical → pest → tree → restoration → remodel → dental → med spa → legal. High-ticket emergency/quote businesses first.
2. **Stack chambers + partners.** Join / partner with the other 2–5 chambers, BNI chapters, trade associations in the city. Offer the same lunch-and-learn + free member audits. Every talk = 15–30 permissioned audits requested.
3. **Turn clients into borrowed traffic.** Each retainer client gets: “Who are your 3 best referral partners? I’ll audit them free and tell them you sent me.” Log referrer in `/centurion`.
4. **Launch the AI Factory line.** By 30+ retainers, fulfillment must be systematized: Gemini scripts → SMS YES → ElevenLabs owner-voice (+Spanish) → Suno 15-sec jingle → publish + syndicate → 5-min monthly Zoom. One operator handles 50–80 retainers with this line. Track cost per episode, publish SLA, GBP reply SLA.
5. **Hire #1:** a part-time audit producer (research + drafts) + keep founder on calls. Founder stays on calls until 100 retainers — “makes the call” is the job.

City scoreboard: doors audited, audits accepted, discovery held, proposals (sprint vs retainer), MRR added, churn, CAC payback (<3 months on $500/mo).

---

## 5. PHASE C → E — City-by-city replication to $150M

### Playbook per new city (copy-paste, 90 days each)

1. **Scout (Week 1):** pick city with 150+ SMBs in 2–3 emergency verticals + an active chamber. Hire or transfer one founder-type operator.
2. **Embed (Weeks 2–3):** operator joins chamber, delivers lunch-and-learn, imports directory to a new `/centurion` campaign `chamber-[city]-[year]`.
3. **Blitz (Weeks 4–10):** 5 audits/day, same touch sequence as §3.3. Weekly report to HQ: convos/hr, discovery, proposals, MRR.
4. **Anchor (Weeks 11–12):** close first 10–15 retainers, recruit 2 local referral partners, hand fulfillment to central factory.
5. **Graduate:** city is “owned” at 100+ retainers + self-sustaining referrals. Operator stays or opens next city.

### Scaling math

| Stage | Cities active | Retainers per city | Total retainers | ARR (~$463/mo blended) |
|---|---|---|---|---|
| Home city owned | 1 | 100 | 100 | $0.55M |
| Regional cluster | 5 | 100 | 500 | $2.8M |
| Operator network | 30 | 150 | 4,500 | $25M |
| Factory network | 150 | 150 | 22,500 | $125M |
| $150M | ~270 | ~100–150 | ~27,000 | **$150M** |

### What scales vs. what doesn’t

- **Scales:** audit production (templates + `/centurion/audit-tools` + VSL Demo Assembler), content factory (voice → transcript → RSS), GBP ops checklists, jingle lyric formula, lunch-and-learn deck, reports.
- **Never scales without permission:** external sends, calls, texts. No cold sequences, no auto-blasts, no AI-voice cold calls — ever. Internal surfacing/drafting/escalation can get smarter; sending stays human-approved.
- **Team at $150M (rough):** ~40 city operators (each owns 500–800 accounts with junior help), ~30 factory producers/editors, ~15 success/QA, ~10 sales engineers/closers for expansion sites, ~10 ops/eng/compliance. Gross margin target 60–70% on retainers because AI factory replaces studio costs.

### Moat

Every city compounds: transcripts + reviews + GBP photos + jingles + YouTube pre-roll history make each client harder to displace and each new audit sharper (proof from real towns, never promises — Book Ch. 7).

---

## 6. Weekly founder cadence (starting tomorrow)

- **Daily (90 min):** call block from `/centurion/queue` — due-first, overdue first. Log outcomes immediately.
- **Weekly:** publish 1 brain-to-tongue post on your own domain (eat your own cooking — Book Ch. 9); post 1 GBP photo/update; ask 3 happy members for reviews.
- **Monthly:** re-run the 5-min self-audit on derivativegenius.com (`doc/pass-the-audit-workbook.md`); review funnel by vertical/city/opener; kill the worst opener, double the best.

---

## 7. Guardrails (non-negotiable)

1. One vertical × one geography per campaign until dispositioned.
2. One specific, viewport-confirmed observation before any call.
3. Manual calls on public business lines; no auto-dialing, no prerecorded/AI cold voice, no cold auto-text.
4. External send only on `requested_info | granted_permission | established_conversation`, with send-time suppression re-check + human approval + full logging.
5. Opt-out ends pursuit everywhere, immediately, permanently.
6. No invented ROI/traffic/ranking claims. Cite Abilene, Nashville, Perth, Avon Park as *their* results under *their* conditions.
7. Prospect PII never in the repo, screenshots, analytics, or public pages.
8. Measure revenue (MRR, proposals, closes, churn), not list size.

---

## 8. First 14 days — do this now

- [ ] Day 1: Join chamber, get directory, create `/centurion` campaign, import members
- [ ] Day 2: Audit 5 highest-visibility members (roof/HVAC/plumbing first), draft teasers
- [ ] Day 3: Attend first event, collect 10 permissions for “20-min look”
- [ ] Days 4–10: 5 audits/day + call blocks; book 5 audit walkthroughs
- [ ] Day 11: Deliver lunch-and-learn pitch to chamber director (“5-Minute Self-Audit”)
- [ ] Days 12–14: First 2 proposals (1 VSL + 1 retainer); log everything; Friday funnel review

Success in 14 days = 60+ members imported, 25+ audits drafted, 10+ conversations, 3+ discoveries, 1+ proposal. Repeat until Phase A exits, then clone the city.

---

## Mission references

- [The Book: Local Internet Presence (living doc)](https://www.derivativegenius.com/book)
- [Lessons of Local Internet Presence](./lessons-of-localinternetpresence.md)
- [The First Priority — DT-18 manual](./the-first-priority.md)
- [Current Development Targets](./current-development-targets.md)
- [Website Prospecting System Plan](./Website-Prospecting-System-Plan.md)
- [Pass-the-Audit Workbook](./pass-the-audit-workbook.md)
- [Repository Overview](../README.md)
- [Eve docs](https://eve.dev/docs) + `agents/<name>/AGENTS.md` (bounded authoring loop)
- [ICP Ninja](https://icp.ninja/) + [Ninja + AI guide](https://medium.com/dfinity/enhancing-icp-dapp-development-using-icp-ninja-ai-11d5dad408ef)

*Prior charter v1.3 doctrine (§1–§16: reality before scale, audits earn / followup compounds, anti-agency rule, owned-web-first) is preserved in git history and reaffirmed in §7 above. v2.0 added the chamber→city execution engine. v3.x adds the build engine: our own Eve agent fleet first (§9), ICP canisters + ICP-hosted agents as authorized revenue-path sidecars (§10).*

---

## 9. How the game plan gets built: our Eve agent fleet

The chamber→city playbook in §3–§5 does not scale on founder hours alone (5 audits/day = 8 weeks per 200-member chamber). It scales when **Eve agents we own do the mechanical work** and humans keep judgment, calls, and approvals.

Rule: agents prepare, draft, and surface. Humans approve and send. Same permission doctrine as §7.

### 9.1 Starting inventory (already in repo)

| Agent | Path | Job today | Doctrine |
|---|---|---|---|
| `audit-agent` | `agents/audit-agent/` | Read-only website auditor. Answers "next safe, valuable fix?" Max 3 evidence-cited findings, plain language. Tools: `check_hero_waste`, `check_mobile_call_cta`, `check_owned_content`, `score_audit_evidence`. Lib: `safe_fetch` (SSRF-safe), `model` (Muse Spark pinned, 128k window placeholder). | Never edits sites/GBP/ads/DB. Never sends, publishes, or enriches. Refuses with citation if asked. |
| `optio-centuriae` | `agents/optio-centuriae/` | Centurion's second-in-command. Receives Joe's intent, tasks `audit-agent`, owns due-first queue surfacing. Chain: Joe → Optio → specialists. | No external send without permission basis + suppression re-check + human approval. |

Both are Eve projects: an agent is a directory of files under `agent/` (`agent.ts`, `instructions.md`, `tools/`, `lib/`, `channels/`, `skills/`, `subagents/`, `schedules/`). Eve compiles and runs it. Dev via `eve dev` TUI, deploy via `eve deploy` to Vercel.

### 9.2 Target fleet — one agent per bottleneck in §3–§5

Build only when the manual pilot names a measured bottleneck (DT-18 automation gate). Order:

1. **audit-agent (harden)** — 20-min chamber audit in <2 min draft. Input: URL + observation notes. Output: ≤3 findings + screenshots refs + fix + range. Human viewport-confirms before quoting.
2. **followup-drafter (next)** — read-only draft of next touch from call notes + audit findings. Never sends itself. Writes `requested_info | granted_permission | established_conversation` basis onto the draft.
3. **vsl-assembler** — assembles book Ch. 5 five-part demo from `/centurion` prospect record (headline, 45–60s script, proof strip, FAQ-schema draft, sticky `tel:`). DEMO-watermarked, private, show-live-only until DT-20 permission path lands.
4. **content-factory** — Ch. 10 line: Gemini script → SMS YES tracker → ElevenLabs owner-voice draft ref → transcript blog draft + RSS item + GBP post draft. All drafts, human publishes.
5. **gbp-rescue + jingle-writer** — NAP/reply/photo checklists; SERP-term lyric card (0–5s anchor / 5–12s benefit / 12–15s nudge). No synthesis keys in Slice 1.
6. **city-cloner** — per-city campaign scaffolder: imports chamber CSV, dedups, seeds queue, clones lunch-and-learn deck. One command per new city (§5).

No cold-sequence, cold-text, cold-call, AI-voice-call, or bulk-blast agents. Ever. Any such proposal needs a new dated decision after DT-18 produces qualified conversations + 1 proposal.

### 9.3 Agent management infrastructure (what we must build)

Repo policy is **Next.js + Neon as system of record, plus EX-2026-09-08-01 (§10.1): Motoko/Rust ICP canisters authorized on the revenue path.** Python/Django/FastAPI/Flask/Celery/Vue/Firebase ban from `doc/migration-audit.md` and `AGENTS.md` remains in full force — this exception adds ICP only, reintroduces nothing removed.

```
agents/
  audit-agent/               # Eve app (owns its package.json, node 24.x)
    agent/
      agent.ts               # defineAgent({ model, modelContextWindowTokens })
      instructions.md        # identity, doctrine, 5-min audit order, guardrails
      tools/*.ts             # zod-validated read-only tools only
      lib/safe_fetch.ts      # SSRF guard: block localhost/private/link-local/metadata, timeouts, size caps, no script exec
      lib/model.ts           # pinned model, no silent swaps
      channels/ skills/ subagents/ schedules/  # added per Eve docs page only
    evals/                   # eve eval suites: pass/fail fixtures, no PII
    .eve/                    # compiled output, never hand-edit
  optio-centuriae/           # orchestrator, same layout
  <next-agent>/              # one dir per future agent above
src/app/api/centurion/       # system of record: campaigns, prospects, audits, activities, suppressions — agents read via allowlisted server actions, never direct DB from browser
drizzle/manual/              # additive migrations only (e.g. permission basis, approver, suppression-check result)
```

Management rules:
- **One agent = one folder = one `package.json` + `tsconfig`.** No cross-imports between agents except via versioned server-action APIs.
- **Model pinning:** model lives in `agent/agent.ts` + `lib/model.ts`. Change = dated decision + eval re-run.
- **Tools are zod tools** (`zod 4.x` in repo). Every tool: input schema, output schema, timeout, no secrets in logs, PII redacted.
- **Secrets server-side only.** Eve env via Vercel project env; `eve link --non-interactive --project <name>` then `eve deploy --non-interactive --yes`. Never ship keys in `agent/` or client bundles.
- **Registry first:** before building any integration (`eve registry search <query> --json` → `eve registry view <item>`), prefer `implementation: native`. Install with `eve add <item> --non-interactive`. On exit 2, run reported `next.command` (non-secret answers inline as JSON, secrets via env only).
- **Docs-bounded loop:** `ls node_modules/eve/docs` → start at `docs/README.md` → read only the routed page before authoring tools/channels/skills/subagents/schedules/deployment. No recursive `node_modules` globs.

### 9.4 Permission & safety architecture (bullet-proofing part 1)

| Layer | Control | Where enforced |
|---|---|---|
| Read-only by default | Auditor/factory tools use GET-only `safe_fetch`; no PUT/POST to prospect sites, no GBP/ad writes | `agent/tools/*.ts` + code review |
| No-send without basis | `email` / `audit_sent` activity + audit `sent` transition rejected server-side without `requested_info \| granted_permission \| established_conversation` | Zod in `src/app/api/centurion/activities/route.ts`, `audits/route.ts` (DT-20) |
| Suppression re-check at send time | Keyed-hash lookup; blocked send returns suppression error, logs attempt without raw contact values | API route + queue UI |
| Human approval | `approved → sent` records approver + timestamp; drafts never self-send; no timer/worker sends externally | `/centurion/audits` UI + API |
| PII containment | No prospect PII in repo, evals, screenshots committed, analytics, or public pages; screenshots private; contact values encrypted + hashed | `safe_fetch`, schema, export admin-only + logged |
| Roles | Every `/centurion` page + API action requires Clerk role; exports/compliance admin-only; re-auth for mass export/destruct | `src/lib/auth/roles.ts` |
| SSRF/sandbox | URL allowlist, DNS/IP private-range block, redirect-to-private block, size/time caps, no script execution | `lib/safe_fetch.ts` |

### 9.5 Verification & bullet-proofing (part 2 — ship gate)

Every agent change must pass, in order, before `eve deploy`:
1. `npx tsc --noEmit` (agent dir) — 0 errors.
2. `eve eval` — all fixtures pass, including adversarial: permissionless send rejected, suppressed send blocked, invented-numbers finding rejected, PII-leak rejected, SSRF URL rejected.
3. Root gates: `npm run lint`, `npm test` (Jest + auth-policy regression), `npm run build` (all routes compile).
4. Signed-in disposable-data walkthrough: import → qualify → audit draft → human approve → permissioned send succeeds + logs; permissionless/suppressed send fails server-side. Record dated evidence without PII.
5. Deploy: `eve link` (once) → `eve deploy --non-interactive --yes`. Verify prod: unsigned `/centurion` redirects, private APIs `401`, no paid/trial provider calls in Slice 1 paths.
6. Rollback: every deploy tags git SHA; `drizzle/manual/` migrations are additive-only; model/tool change = version bump + eval snapshot so history never silently rewrites.

### 9.6 Deployment posture — Eve-first, ICP agents later (decided 2026-09-08)

**Initial concentration: Eve.** All §9.2 agents ship as Eve apps to Vercel (`eve deploy`). This is where velocity lives: `eve dev` TUI, registry integrations, `eve eval`, one-command deploy, Vercel env + observability. No agent is blocked waiting for ICP hosting.

**Later: named candidates graduate to ICP.** Some agents will run as ICP canisters (Ninja-built, `dfx`-exported, CycleOps-funded) when they need what Eve/Vercel cannot credibly sell: tamperproof, verifiable, unstoppable execution on the revenue path.

| Tier | Agents | Host (now) | Rationale |
|---|---|---|---|
| Eve-native (stay) | `audit-agent`, `optio-centuriae`, `followup-drafter`, `vsl-assembler`, `city-cloner` | Eve → Vercel | Human-in-loop drafting, queue surfacing, Next.js/Neon-adjacent. Low value in decentralizing; high value in iteration speed. |
| Eve-first, ICP-candidate | `deai-assist` (onchain LLM), `proof-anchor` verifier, `deliverable-vault` gatekeeper, `pay-rail-pilot` settler, future `content-factory` publisher | Eve now → ICP canister on promotion | Client-verifiable receipts, unstoppable Q&A, encrypted vault gating, and settlement anchoring are the moat stories that justify ICP cost. |
| Never ICP (policy) | Anything that sends email/text/call or lifts suppressions | N/A — stays behind Next.js approval gates | §9.4 + §10.1 boundary 2: no canister sends or publishes prospect audits. |

**Promotion gate (Eve → ICP, per agent, dated amendment to §10.1 closed list required):**
1. Eve version profitable in production (used on ≥25 real chamber audits with eval parity).
2. Documented need: verifiability, tamperproofing, or unstoppability the client pays for — not novelty.
3. Ninja prototype green (live build + canister logs + AI optimize pass), `dfx build` reproduces, `canister_ids.json` versioned, CycleOps funded, cost/cycle per call measured and priced into the $300/$500 retainer.
4. Same §9.4 gates re-proven on ICP: hashed-only PII, suppression re-check upstream in Next.js, human approval before any downstream send, server-side keys only.
5. Rollback proven: prior wasm retained; Neon rebuilds state; revert to Eve version in one deploy if SLA misses twice.

Until promoted, ICP work in §10–§11 means the four data canisters (`proof-anchor`, `deai-assist` assist index, `deliverable-vault`, `pay-rail-pilot` anchors) called server-side from Eve/Next.js — not agents living on ICP.

---

## 10. ICP Ninja — accelerator + revenue-path canisters (EX-2026-09-08-01 ACTIVE)

**What it is:** [ICP Ninja](https://icp.ninja/) is DFINITY's free browser IDE for Internet Computer canisters — pick a template (Motoko/Rust backend + React frontend), edit in browser, one-click deploy to mainnet (ephemeral ~20–30 min, or Publish permanently with CycleOps top-ups), share via link, export to GitHub / download zip, with an **AI learning assistant trained on ICP docs** that explains, fixes, optimizes code (e.g. query-vs-update), plus live build logs, canister logs, and new templates (LLM chatbot / DeAI, EVM explorer, Encrypted Notes with VetKeys, BTC wallet, photo gallery).

### 10.1 Formal stack exception EX-2026-09-08-01 — the word is given

**Status:** ACTIVE. **Decided:** September 8, 2026. **Decider:** Joe Terry, Founder / human Centurion. **Supersedes:** the "no canister in production without separate decision" gate in v3.0 §10.

**Authorization:** Derivative Genius may design, deploy, and earn revenue through ICP canisters built with ICP Ninja technology (Ninja IDE + Ninja AI + `dfx`-exported repos) alongside the Next.js + Drizzle + Neon stack. The `AGENTS.md` "Node.js + Next.js only" rule is hereby amended to "Next.js + Neon as system of record, ICP canisters as authorized revenue-path sidecars per this section." The `doc/migration-audit.md` ban on Python/Django/Vue/Firebase is unchanged and remains absolute.

**Why:** the chamber→city plan needs tamperproof, verifiable, unstoppable delivery artifacts and decentralized AI that Next.js alone cannot credibly sell as a moat at $150M scale. Ninja + its AI lets one disciplined builder prototype, bullet-proof (live build, canister logs, AI fix/optimize), and ship those canisters in days instead of weeks.

**Authorized revenue-path canisters (v1 — closed list, anything else needs EX amendment):**

| Canister | Ninja template lineage | Revenue job | Reads/writes |
|---|---|---|---|
| `proof-anchor` | Encrypted Notes (VetKeys) | Tamperproof hash + timestamp for every delivered audit/VSL/jingle; client-verifiable "this audit existed on this date" | Writes: SHA-256 hashes, canister timestamps, client-safe metadata only. Never raw PII/phone/email/suppression values |
| `deai-assist` | LLM Chatbot (Ollama / onchain LLM) | Decentralized audit-draft assist + owner Q&A mock that Eve agents call during §9.2 drafting | Writes: anonymized prompts + draft outputs. No PII; all calls logged to Neon activities |
| `deliverable-vault` | FileVault / Photo Gallery | Client-facing vault for VSL assets, lyric cards, transcript PDFs; share links for audit walkthroughs | Writes: client-approved deliverables only, VetKeys-encrypted where private |
| `pay-rail-pilot` | Bitcoin Wallet / EVM Explorer (Chain Fusion) | Optional pilot: onchain invoice receipt anchors + transparent payment verification for $1,500 VSLs | Writes: invoice IDs + tx hashes only. Neon remains revenue ledger; no client funds custody without separate legal review |

**Architecture (bullet-proof by construction):**

```text
Browser / chamber member
  -> Next.js 16 (Clerk auth, /centurion UI, public proof pages)
    -> Route Handlers + server actions (Zod, role checks, suppression re-check, human approval)
      -> Drizzle + Neon (SYSTEM OF RECORD: prospects, contacts encrypted+hashed, audits, activities, opportunities, suppressions, revenue)
      -> ICP canisters via allowlisted server-side calls only (proof-anchor, deai-assist, deliverable-vault, pay-rail-pilot)
      -> Eve agents on Vercel now (audit-agent, optio-centuriae, fleet) call Next.js APIs, never canisters directly from browser; ICP-hosted agents only on §9.6 promotion
```

**Non-negotiable boundaries (violation = automatic rollback to Next.js-only):**
1. Neon stays system of record for PII, consent/permission basis, suppressions, pipeline, and revenue. ICP stores hashes + client-safe artifacts only.
2. No canister sends email/text/call or publishes a prospect audit publicly. §9.4 permission + suppression + human-approval gates apply to anything downstream of a canister output.
3. No provider keys, raw phones/emails, or suppression raw values in Ninja IDE, Ninja AI chat, canister logs, or committed `canister_ids.json` secrets. Toy data in Ninja; real data only via server-side mainnet calls.
4. Every canister: exported `dfx` repo (Ninja Download/Export committed to PR), pinned Motoko/Rust + React versions, `canister_ids.json` versioned, CycleOps auto-top-up configured before any permanent Publish, canister logs monitored.
5. Python/Django/FastAPI/Flask/Celery/Vue/Firebase remain banned. This exception covers Motoko/Rust-on-ICP only.

**Bullet-proofing with Ninja + its AI (required per canister):**
- Fork template → Ask AI (explain → fix → optimize; enforce query-vs-update, cost discipline) → live-build green → canister-log clean → ephemeral deploy click-test → share link in PR → GitHub export/zip → `dfx build` locally reproduces → `eve eval` fixtures updated with Ninja failure cases → §9.5 gates (`tsc`, `eve eval`, `lint/test/build`, disposable-data walkthrough) → Publish (coupon then CycleOps) with git SHA tag.
- Rollback: `dfx deploy --upgrade` to prior wasm; Neon rebuilds any canister state from hashes. If cost/latency/compliance misses SLA two sprints running, the affected canister reverts to Next.js-only implementation with dated note here.
- Observability: canister logs + CycleOps balance alerts wired into `/centurion/reports` alongside convos/hr, MRR, churn.

**How we use Ninja now that the exception is ACTIVE:** Ninja is both accelerator and revenue-path shipyard. Toy prototypes still start with fake data, but the four §10.1 canisters ship to mainnet and earn: hashes anchored at audit delivery, drafts assisted by `deai-assist`, deliverables served from `deliverable-vault`, receipts anchored by `pay-rail-pilot`. Next.js remains the gate (auth, suppression, approval); ICP is the verifiable backend those gates call server-side.

| Track | Use | Why it makes us faster + safer |
|---|---|---|
| A. Prototype Eve tools 10× faster | Rebuild each `agent/tools/*.ts` idea first as a Ninja template fork (React frontend mimics our queue card; toy backend mimics scoring/dedup). Iterate in browser, no local `dfx`/cycles setup. | Live build output + canister logs catch shape errors before they touch our repo. Share link = stakeholder review in minutes. |
| B. AI pair-programmer | Use Ninja AI to explain/fix/optimize the prototype ("Ask AI — fix this actor", "use query calls", "condense functions"). Then **port the pattern to TypeScript** in `agents/<name>/` **and** keep the Motoko/Rust canister for §10.1 workloads. | AI trained on ICP docs catches best-practice violations (query vs update, cost) that map 1:1 to our server-action cost discipline. Human reviews every AI diff. |
| C. Revenue-path shipyard | Ephemeral deploy per PR for click-through; permanent Publish (coupon → CycleOps) for `proof-anchor`, `deai-assist`, `deliverable-vault`, `pay-rail-pilot`. | 20-min canisters force stateless, reproducible demos — no hidden state. Permanent publishes get versioned + logged like any prod deploy. |
| D. DeAI moat | `deai-assist` (LLM-chatbot lineage) on the revenue path per §10.1 — tamperproof, verifiable draft assist, not a side experiment. | Decentralized-AI becomes a selling point (verifiable, unstoppable) inside every $300/$500 retainer. |

**Concrete workflow (per agent + per canister):**

```
1. Fork template in icp.ninja (LLM Chatbot → deai-assist; Encrypted Notes → proof-anchor; FileVault → deliverable-vault; BTC/EVM → pay-rail-pilot)
2. Prompt Ninja AI: explain → fix → optimize; keep live-build green, check canister logs
3. Share link in PR for review; click-test ephemeral deploy
4. Export: Download zip or one-click GitHub export from Ninja; commit dfx repo + pinned versions to PR
5. Port UI/tool pattern to agents/<name>/agent/tools/*.ts in TypeScript + zod AND keep canister for §10.1 writes (hashes/artifacts only, never raw PII)
6. Add eve eval fixtures from Ninja test cases (including its failure cases: PII-reject, suppression-block, SSRF-reject)
7. Pass §9.5 gates → eve deploy to Vercel + Ninja Publish to mainnet (CycleOps armed), both tagged to same git SHA
```

**Guardrails for Ninja use (under EX-2026-09-08-01):**
- No provider keys, prospect PII, or suppression raw values ever pasted into Ninja or its AI chat. Toy data in IDE; real data only via server-side mainnet calls carrying hashes + approved deliverables.
- Nothing Publishes permanently until: `dfx build` reproduces locally, `tsc` + `eve eval` + `lint/test/build` green, disposable-data walkthrough logged, CycleOps top-up set, `canister_ids.json` versioned.
- Any 5th canister beyond the §10.1 closed list needs a dated EX amendment here before it touches revenue.

---

## 11. Build roadmap — Eve fleet + Ninja canisters, mapped to revenue phases

| Phase | Build | Revenue unblock | Exit criteria |
|---|---|---|---|
| 0. Harden + `proof-anchor` (now, ~1–2 wks) | Pin `audit-agent` model window, tighten `safe_fetch` SSRF tests, 10 eval fixtures. Ship `proof-anchor` first: Ninja Encrypted-Notes fork → Publish → Next.js server action anchors audit hashes at delivery. | 5 audits/day → 25/day draft capacity + verifiable audit receipts as closer | `eve eval` + `dfx build` + `lint/test/build` green; mainnet hash verifiable; CycleOps armed |
| 1. Optio + queue + `deai-assist` (~1–2 wks, = DT-20) | Permission basis + approver + suppression-check result; send-time re-check; overdue surfacing + read-only auto-draft backed by `deai-assist` (LLM-chatbot fork). | Followup sophistication without cold automation; no commitment slips | Permissionless/suppressed sends rejected server-side; approver recorded; canister logs clean |
| 2. VSL assembler + `deliverable-vault` (~1 wk, = DT-21) | Private `/centurion/demos` route + vault-backed share links (FileVault fork), DEMO watermark, browser speech preview, lyric-card slot. | Live vault-backed demo on audit walkthroughs → closes $1,500 sprints | Demo renders 5 parts from disposable prospect; vault link gated by Clerk role; unsigned `401` |
| 3. Factory agents (~2–4 wks) | `content-factory`, `gbp-rescue`, `jingle-writer` drafts + publish checklists; cost/episode + cycles-burn + SLA dashboards in `/centurion/reports` | 1 operator handles 50–80 retainers; supports Phase B city ownership | Publish SLA + cost + cycles tracked; human publishes everything |
| 4. City-cloner + `pay-rail-pilot` (~2 wks) | Campaign scaffolder + per-city canister namespace; Chain-Fusion receipt anchors for VSL invoices (Neon remains ledger). | 90-day per-city playbook (§5) runs without eng help; onchain receipts as trust signal | New city live in <1 day, first 25 audits + first anchored receipt in week 1 |

Each phase ends with a dated continue/revise/stop note here + in `doc/current-development-targets.md`. Phases 0–4 ship agents on Eve; ICP agent hosting waits for §9.6 promotion. Deferred automation (scaled Places, mass enrichment, any auto-send) stays blocked until DT-18 shows qualified conversations + 1 proposal.

## 12. Operator cheat sheet

```bash
# Eve daily loop (per agents/<name>/AGENTS.md)
ls node_modules/eve/docs                    # find routed doc first
eve dev                                     # TUI: talk to agent locally
eve registry search "gmail|calendar|stripe" --json
eve registry view <item>                    # prefer implementation: native
eve add <item> --non-interactive            # exit 2 → run next.command (secrets via env only)

# Bullet-proof before ship (agent dir, then root)
npx tsc --noEmit && eve eval
npm run lint && npm test && npm run build

# Ship
eve link --non-interactive --project <name> # once per agent
eve deploy --non-interactive --yes

# Ninja acceleration + revenue canisters (toy data in IDE; hashes/artifacts only on mainnet)
# icp.ninja → fork template → Ask AI (explain/fix/optimize) → ephemeral Deploy →
# Share link in PR → Export (GitHub/zip, commit dfx repo) → Publish (CycleOps armed, same git SHA as eve deploy)
# dfx build must reproduce locally; canister logs + cycles wired into /centurion/reports
```
