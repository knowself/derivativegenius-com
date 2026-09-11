# Eve Agent Tech Stack — Executive Summary, Install Guide & Centurion User Guide

**Owner:** Joe Terry, the Centurion · **Repo:** `dg-web` · **Date:** 2026-09-11
**Scope:** Node.js + Next.js only. No Python / Django / FastAPI / Flask / Celery / Vue / Firebase (per `AGENTS.md`).
**Eve versions in this repo:** root `eve ^0.52.2` · `agents/audit-agent` + `agents/optio-centuriae` on `eve ^0.52.1` · Node `24.x`

---

## 1. Executive summary — what Eve is

**Eve (`npm: eve`, repo `vercel/eve`, docs `eve.dev/docs`, Apache-2.0, public beta as of June 2026) is Vercel's open-source, filesystem-first framework for durable backend AI agents.**

Mental model: **like Next.js for web apps, but for agents.** You author an agent as a directory of files under `agent/`. Eve discovers those files, validates them, compiles a manifest under `.eve/`, and serves the runtime as a deployable app. No custom agent loop, no manual tool registration, no bespoke durability code.

A minimal agent is two files:

```text
my-agent/
└── agent/
    ├── instructions.md   # always-on system prompt (who the agent is)
    └── agent.ts          # model + runtime config (what it runs on)
```

Add capability by adding a file — Eve wires it in:

| Path | Role | Format |
|---|---|---|
| `agent.ts` | model + runtime config | TypeScript (`defineAgent`) |
| `instructions.md` | identity, doctrine, guardrails | Markdown |
| `tools/*.ts` | what it can do; filename = tool name | TS (`defineTool` + Zod) |
| `skills/*` | what it knows; loaded on demand | Markdown |
| `subagents/*/` | specialist child agents | directory, own `agent.ts` + instructions |
| `channels/*.ts` | where it lives (HTTP, Slack, Discord, Teams, …) | TS (`defineChannel`) |
| `connections/*` | secure links to MCP / OpenAPI APIs | TS (`defineConnection`-family) |
| `schedules/*` | cron jobs the agent runs itself | TS (`defineSchedule`) |
| `sandbox/` + `workspace/` | isolated compute + seeded files | TS (`defineSandbox`) |
| `hooks/*.ts` | lifecycle / stream-event subscribers | TS (`defineHook`) |
| `evals/*.eval.ts` | scored test suites | TS (`defineEval`) |
| `lib/` | shared code imported by the above | TS |

Six production capabilities ship in the box (Vercel runs 100+ Eve agents itself, including a data analyst handling ~30k questions/month):

1. **Durable execution** — every session is a checkpointed Vercel Workflow. It survives cold starts, crashes, redeploys, and hours-long waits for a human or slow system, then resumes exactly where it stopped.
2. **Sandboxed compute** — every agent gets an isolated sandbox (shell, filesystem, file tools). Locally: Docker / microsandbox / just-bash. On Vercel: Vercel Sandbox microVMs. Agent-generated code never runs in your app runtime.
3. **Human-in-the-loop approvals** — any action can require approval (`needsApproval`). The session parks without burning compute until approved, then continues.
4. **Secure connections** — a connection file points at an MCP server or OpenAPI API. Eve brokers auth (Vercel Connect: OAuth consent + refresh); the model never sees URLs or credentials.
5. **Multi-channel delivery** — one codebase serves HTTP API, TUI, Slack, Discord, Teams, Telegram, Twilio, GitHub, Linear, cron, and custom channels. One adapter file per surface; channels can hand off to each other.
6. **Tracing + evals** — every run produces an ordered trace (model calls, tool calls, sandbox commands, timing, tokens). Standard OpenTelemetry spans export to Braintrust / Honeycomb / Datadog / Jaeger, and surface in Vercel's **Agent Runs** tab with zero setup. `eve eval` runs scored suites locally, against deploys, or as a CI deploy gate.

### Why it matters to Derivative Genius

- **Compounds.** Each specialist (audit, publisher, builder, jingle, ad-ops, care, outreach, intel) is just a directory. The Optio pattern you already run — commander agent delegating to exactly one specialist per task — is a native Eve `subagents/` construct.
- **Deploys like a Vercel project.** Same directory runs on laptop and production. `eve deploy` ≈ `vercel deploy --prod` plus sandbox-template + env handling.
- **Evidence-grade.** Tool-cited findings, structured outputs, and replayable traces are exactly what your "evidence before claims" doctrine needs.
- **Cost-controllable.** Free-inference model routing (your `agent/lib/model.ts` fallback chain) + evals-as-gates + parked-not-polling approvals = cheap to run, expensive to break.

---

## 2. Potential uses (general + DG-specific)

**General:** support / triage copilots, data analysts over private stores, repo-aware dev agents, scheduled report/digest runners, incident responders (webhook → investigate → Slack thread), approval-gated ops agents (refund, publish, deploy), form-fill / onboarding guides via Web Chat, eval-guarded RAG assistants.

**DG Centuria (mapped to your chain of command — Joe → Optio → specialists):**

- **audit-agent (built):** read-only website auditor. Answers "what is the next safe, valuable fix?" with ≤3 tool-cited findings (homepage mistake, tap-to-call, hero waste, GBP void signals, walled garden). Tools: `check_mobile_call_cta`, `check_hero_waste`, `check_owned_content`, `score_audit_evidence`.
- **Optio Centuriae (built):** commander. Accepts objective, loads procedure, delegates to one specialist, combines results, requests approval for anything that writes/sends/publishes/spends. Ships with `subagents/audit-agent/` embedded.
- **Next specialists to add (same pattern):** publisher (drafts → approval → publish), builder (scaffold Next.js sections in sandbox → human review), jingle/ad-ops (copy variants + spend-gated), care (inbox triage + draft replies, never auto-send), outreach (suppression-checked drafts only), intel (nightly schedule → digest).
- **Schedules:** nightly intel sweep, weekly recap, GBP-signal re-check.
- **Channels:** HTTP API today; add Slack/Discord/Teams per client with `eve add <channel>`, one file each.

**Do NOT use Eve for:** bulk cold sequences, auto-enrichment, AI voice prospecting (your standing gate forbids these until you lift it with a dated decision), or anything needing Python runtimes — Eve is Node 24 + TypeScript.

---

## 3. Tech stack in detail

### 3.1 Core

| Layer | Technology | Role in Eve |
|---|---|---|
| Runtime | **Node.js 24.x** (`engines: node 24.x` in every Eve `package.json`) | Only supported runtime |
| Language | **TypeScript** (strict in scaffolds; `tsc` typecheck) | All authored behavior |
| Framework | **`eve` npm package** (CLI binary also `eve`) | Discovery, manifest compile (`.eve/`), dev TUI, build/start/deploy |
| Web runtime | **Nitro** (bundled by Eve) | Serves health, session, stream, channel, callback, schedule routes |
| Durability | **Vercel Workflows** (+ open Workflow SDK) | Checkpointed sessions; park/resume |
| Model calls | **Vercel AI Gateway** (string IDs like `openai/gpt-5.4-mini`) + **AI SDK** (`ai` package, `LanguageModel`) | Provider routing, fallbacks, streaming; OIDC auth on Vercel so no provider keys needed |
| Direct providers (DG pattern) | **`@ai-sdk/openai` + OpenAI-compatible baseURLs** | Your `agent/lib/model.ts` talks Groq / Cerebras / OpenRouter / OpenCode Zen through the OpenAI shape |
| Schemas | **Zod** (`zod` v3 root, v4 in agents) | `inputSchema`/`outputSchema` for every tool; structured delegation outputs |
| Isolation | **Vercel Sandbox** (prod) / Docker / microsandbox / just-bash (local) via swappable adapter | Per-agent sandbox + `bash` / `read_file` / `write_file` framework tools |
| Credentials | **Vercel Connect** (`@vercel/connect`) | OAuth/API-key brokering for connections; model never sees secrets |
| Observability | **Agent Runs dashboard** + **OpenTelemetry** (`agent/instrumentation.ts` optional) | Sessions, turns, tools, reasoning, timing, tokens |
| Hosting | **Vercel Functions + Fluid Compute** (default on new projects) | Long-running streaming turns |
| Auth (channels) | `vercelOidc`, `slackChannel`, `eveChannel` helpers | Route auth policies; replace `placeholderAuth()` before production browser traffic |

### 3.2 Eve CLI surface

| Command | Purpose |
|---|---|
| `npx eve@latest init <name>` | new agent: deps + git + dev server offer |
| `npx eve@latest init .` | add Eve to existing app (adds missing `eve`, `ai`, `zod` only) |
| `npm install eve@latest ai zod` | manual install path |
| `npm run dev` → `eve dev` | local runtime + interactive TUI/REPL |
| `eve info` | discovery results + compiled artifacts |
| `eve build` | compile `.eve/` + host output (`.output/` or `.vercel/output` on Vercel) |
| `eve start` | serve built output |
| `eve eval` | run scored eval suites locally / vs deploy / in CI |
| `eve link` / `eve deploy` | Vercel project link + prod deploy (prefer over raw `vercel` cmds) |
| `eve registry search <q> --json` / `eve registry view <item>` | find native integrations before hand-rolling |
| `eve add <item> --non-interactive` | install integration headlessly (exit 0 ok / 1 fail / 2 needs answer or prereq) |
| `eve extension init/build` | extension packages |

### 3.3 Authoring helpers (import from matching subpath)

`defineAgent` (`eve`) · `defineInstructions` (`eve/instructions`) · `defineTool`, `defineBashTool`, `defineReadFileTool`, `defineWriteFileTool`, `disableTool` (`eve/tools`) · `defineSkill`, `getSkill` (`eve/skills`) · `defineHook` (`eve/hooks`) · `defineChannel`, `POST`, `GET` (`eve/channels`) · `eveChannel`, `slackChannel`, `vercelOidc` (`eve/channels/...`) · `defineSandbox`, `vercelSandboxBackend` (`eve/sandbox`) · `defineSchedule` (`eve/schedules`) · `defineEval`, `defineEvalConfig` (`eve/evals`) · runtime: `getSession`, `getSandbox`, `getContext/requireContext/hasContext/setContext/ensureContext` (`eve/context`, `eve/sandbox`).

### 3.4 HTTP protocol (stable contracts)

- `POST /eve/v1/session` → creates durable session; returns **`continuationToken`** (channel-owned, for the next turn) in body + **`x-eve-session-id`** (runtime-owned, for streaming/inspection) header.
- `GET /eve/v1/session/:id/stream` → NDJSON lifecycle events.
- Follow-up turn → send `continuationToken`. Channel normalizes transport + auth; harness does one unit of AI work (`{session, next}`); runtime persists + streams.

### 3.5 What lives in THIS repo today

- `agents/audit-agent/` — standalone Eve app (`agent/agent.ts`, `instructions.md`, `tools/×4`, `lib/model.ts`, `lib/safe_fetch.ts`, `channels/`, `evals/`). Free-inference fallback chain: Groq → Cerebras → OpenRouter `:free` → OpenCode Zen (Muse Spark). Fails at request time (not build) if no keys set.
- `agents/optio-centuriae/` — commander Eve app with embedded `agent/subagents/audit-agent/`.
- Root `dg-web` has `eve ^0.52.2` as a dependency and `.eve/vercel-services/`; the Next.js site and the Eve agents deploy separately.
- Full framework docs ship **inside the package**: `node_modules/eve/docs/` (also at `agents/*/node_modules/eve/docs/`). Start at `docs/README.md`.

---

## 4. Install & setup — teach-any-agent playbook

### 4.1 Prerequisites

- Node 24+, npm, Git, Vercel account + `vercel` CLI (for deploys).
- One model credential: `AI_GATEWAY_API_KEY` (or `vercel link` → `VERCEL_OIDC_TOKEN`) for Gateway IDs; or provider keys (`GROQ_API_KEY`, `CEREBRAS_API_KEY`, `OPENROUTER_API_KEY`, `OPENCODE_API_KEY`) for the DG direct-provider pattern. Copy `.env.example` → `.env.local`; never commit secrets.

### 4.2 New agent (greenfield)

```bash
npx eve@latest init my-agent
cd my-agent
# add --model <gateway-id> to override default; --channel-web-nextjs for Web Chat
# init installs deps, inits git, offers to start dev server — stop it (Ctrl+C) before editing
npm run dev   # eve dev: boots runtime + TUI; /model walks through keys if missing
```

### 4.3 Add Eve to an EXISTING repo (the DG pattern — do this for new specialists)

```bash
cd /path/to/existing-app
npx eve@latest init .     # adds missing eve/ai/zod, agent/ scaffold; touches nothing else
# ensure these exist:
#   agent/instructions.md   (identity + doctrine)
#   agent/agent.ts          (model; keep scaffold default unless asked to change it)
npm run dev
```

Manual equivalent: `npm install eve@latest ai zod`, set `"engines": {"node": "24.x"}`, create `agent/instructions.md` + optional `agent/agent.ts`.

### 4.4 First tool (typed, Zod-validated)

`agent/tools/get_weather.ts` — filename becomes the tool name; no registry step:

```ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the weather for a city",
  inputSchema: z.object({ city: z.string() }),
  async execute({ city }) {
    const res = await fetch(`https://api.example.com/current?city=${city}`);
    return res.json();
  },
});
```

DG reference implementation: `agents/audit-agent/agent/tools/check_mobile_call_cta.ts` (SSRF-guarded `fetchPublicHtml`, Zod `outputSchema`, `toModelOutput` summarizer so the model cites evidence, never dumps HTML).

### 4.5 Verify (HTTP API, not just TUI)

```bash
# 1. create session
curl -s -X POST http://localhost:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"message":"Audit https://example.com for tap-to-call"}' -i
# → note continuationToken (body) + x-eve-session-id (header)

# 2. stream it (separate terminal)
curl -N http://localhost:3000/eve/v1/session/<sessionId>/stream

# 3. follow-up turn with the continuationToken from step 1
curl -s -X POST http://localhost:3000/eve/v1/session \
  -H 'content-type: application/json' \
  -d '{"continuationToken":"<token>","message":"Now check hero waste"}'
```

Then `npm run typecheck` (`tsc`) in the agent dir. Do not commit unless asked.

### 4.6 Deploy to Vercel

```bash
cd agents/<name>
eve link --non-interactive --project <name-or-id>   # or: vercel link --project <n> --yes --non-interactive (CI)
# add provider/tool/connection secrets + channel auth keys to the Vercel project env
# leave sandbox backend unset (defaults to Vercel Sandbox) or set explicitly:
#   defineSandbox({ backend: vercel() })
eve deploy --non-interactive --yes
curl https://<your-app>.vercel.app/api/health   # verify
# watch runs: Vercel dashboard → Observability → Agent Runs
```

Builds with `bootstrap()` or workspace seed files auto-create/reuse a sandbox template — a prewarm failure stops the deploy by design.

---

## 5. Briefing kit — teaching OTHER agents to use Eve

Paste this into any coding agent working in a repo (canonical upstream prompt, DG-adapted):

> Set up an Eve agent for the user. Eve is a filesystem-first TypeScript framework for durable agents, published as npm package `eve`. Read its docs: once eve is installed they are bundled at `node_modules/eve/docs` (start at `docs/README.md`); before install, read the published Introduction + Getting Started at `eve.dev/docs`. If the project has no Eve app, scaffold with `npx eve@latest init <name>`; add `--channel-web-nextjs` only for Web Chat. Init installs deps, inits git, and starts the dev server — run it in a controllable process and stop it before editing. To add Eve to an existing app run `npx eve@latest init .` (or `npm install eve@latest ai zod`). Ensure `agent/agent.ts` + `agent/instructions.md` exist, then add a first typed tool at `agent/tools/*.ts` with `defineTool` from `eve/tools`, a Zod `inputSchema`, and inline `execute`. Restart dev, exercise the HTTP API (`POST /eve/v1/session`, `GET /eve/v1/session/:id/stream`, follow-up with `continuationToken`). Verify with the project's typecheck, adapt model/provider to the project, do not commit unless asked. Node 24 + Next.js only — no Python backends.

**AGENTS.md snippet** (mirrors `agents/*/AGENTS.md` — drop into any new agent dir):

```md
# eve Agent App — this dir is an Eve agent; `agent/` is the contract.
- Content-only identity change → edit `agent/instructions.md` only; keep `agent/agent.ts` model unless asked.
- Code change → first `ls node_modules/eve/docs`, read `docs/README.md`, then ONLY the routed page. Bounded loop: locate file → imitate imports/shape → smallest complete change → one narrow check.
- External service? `eve registry search <q> --json` → `eve registry view <item>` → prefer `native`; install via `eve add <item> --non-interactive`. Exit 2 → run reported `next.command` (never pass secrets in `--answer`).
- Vercel ops via `eve link` / `eve deploy` (non-interactive flags). Validate with the task's requested check, else narrowest relevant (`tsc`, `eve build`, or one HTTP session).
```

**Rules for students:** one file = one capability; never hand-roll what the registry has natively; keep secrets in `.env.local`/Vercel env, never in prompts or tools; `toModelOutput` summarizes (no HTML/PII dumps); writes park for approval.

---

## 6. Centurion user guide — your daily ops (Joe)

### 6.1 Start / talk / stop

```bash
cd agents/optio-centuriae && npm run dev   # Optio + embedded audit subagent
cd agents/audit-agent && npm run dev       # standalone auditor
# TUI opens; ask in plain language. /model fixes credentials. Ctrl+C stops.
```

Direct order from you overrides any Optio routing — say "Centurion direct:" and the specialist obeys.

### 6.2 Command a session headlessly (scripts, CI, Next.js Route Handlers)

Same three calls as §4.5. From the Next.js site, call the deployed agent URL server-side (Route Handler + `VERCEL_OIDC_TOKEN` or stored key), never expose keys to the browser. Persist `continuationToken` per conversation (durable — survives redeploys).

### 6.3 Approve / deny (human-in-the-loop)

Approval-gated tools park the session (no compute burn). Approve in TUI, Slack buttons, or channel callback; denial returns a refusal the agent must cite. Standing rule: **specialists draft, you decide** — anything creating, updating, sending, publishing, or spending needs your explicit approval.

### 6.4 Add a specialist / skill / schedule / channel

```bash
cd agents/<parent>
mkdir -p agent/subagents/<name>   # + agent.ts, instructions.md, tools/, lib/
# or: skills → agent/skills/<name>.md · schedules → agent/schedules/<job>.ts · channels:
eve registry search slack --json && eve add slack --non-interactive
eve deploy --non-interactive --yes   # channels/schedules need deploy (deploymentRequired: true)
```

New specialists imitate `audit-agent`: `lib/model.ts` (import `primaryModel`, never hard-code IDs), `lib/safe_fetch.ts` (SSRF guards), tools with `outputSchema` + `toModelOutput`, instructions with Identity → Doctrine → Procedure → Guardrails.

### 6.5 Evals = your deploy gate

```bash
cd agents/<name>
# author in evals/*.eval.ts (defineEval), then:
npm run eval          # local  ·  eve eval --target <deployed-url>  # pre-prod
```

Wire `eve eval` into CI; a regression stops the deploy, not the client. Reference: `agents/audit-agent/evals/`.

### 6.6 Observe / debug

Vercel → Observability → **Agent Runs**: sessions → turns → tool calls → sandbox commands, with timing + tokens. Traces are OTel — optional `agent/instrumentation.ts` exports to your existing backend (Honeycomb/Datadog/…). Locally: `eve info` (what compiled), `.eve/` artifacts, `[model-fallback]` console lines (which provider served/failed).

### 6.7 Model + cost control (your free-inference stack)

Order today: **Groq (`qwen/qwen3.8-27b`) → Cerebras (`gpt-oss-120b`) → OpenRouter `:free` → Zen Muse Spark** (last-resort; headless Zen needs paid `muse-spark-1.3` id — the `-contributor-free` id is OpenCode-session-bound). Override via `GROQ_MODEL_ID` / `CEREBRAS_MODEL_ID` / `OPENROUTER_MODEL_ID` / `EVE_MODEL_ID`. Free tiers may train on prompts — **public prospect info only; never client source, docs, PII, or credentials.** Heavy analysis → pin a capable Gateway model in `agent/agent.ts` + set explicit `modelContextWindowTokens` (unlisted models can't auto-resolve it; err low — early compaction beats overflow).

### 6.8 Troubleshooting

| Symptom | Fix |
|---|---|
| "No model provider configured" | set ≥1 of `GROQ/CEREBRAS/OPENROUTER/OPENCODE_API_KEY` |
| `MissingSessionID` on Zen | expected headless for `-contributor-free`; configure Groq/Cerebras/OpenRouter or paid Zen id |
| TUI auth fail | `/model` flow, or `vercel link` for OIDC |
| `eve add` exit 2 | run its `next.command`; `eve link` first if named as prereq |
| Deploy prewarm fail | sandbox template perms — fix per `sandbox.mdx lifecycle`, redeploy |
| Channel 401s in prod | you shipped `placeholderAuth()` — set real policy + keys |
| Vague / invented findings | tighten `instructions.md` doctrine + require `outputSchema` evidence fields; add eval |

### 6.9 Quick reference card

```bash
npx eve@latest init <name> | npx eve@latest init . | npm run dev
eve info | eve build | eve start | eve eval | eve link | eve deploy
eve registry search <q> --json | eve registry view <x> | eve add <x> --non-interactive
curl POST /eve/v1/session → stream GET /eve/v1/session/:id/stream → follow-up w/ continuationToken
```

**Sources:** `node_modules/eve/docs/` (installed), `eve.dev/docs`, `github.com/vercel/eve`, `vercel.com/docs/eve`, `vercel.com/blog/introducing-eve`. Eve is beta — check `node_modules/eve/CHANGELOG.md` before upgrades.
