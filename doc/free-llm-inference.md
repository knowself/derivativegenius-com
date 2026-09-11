# Free LLM Inference

**Organization:** Derivative Genius
**Purpose:** Single reference for how this repo gets $0 model inference — for OpenCode (dev harness), the Eve agents, and the Next.js app — and what the limits are.
**Document status:** Active reference
**Version:** 1.0
**Date:** September 8, 2026

---

## 1. Executive summary

All model inference in this repo currently costs **$0/month**:

| Surface | What powers it | Monthly cost |
|---|---|---|
| OpenCode dev sessions (coding agent) | OpenCode Zen `muse-spark-1.3-contributor-free` (Meta Muse Spark, Responses API) | $0 (promo, billing-enabled Zen account required) |
| Eve agents (`audit-agent`, `optio-centuriae`) | Fallback chain Groq → Cerebras → OpenRouter `:free` → Zen, first configured key wins | $0 (per-provider rate caps) |
| Next.js app (`src/`) | No LLM calls — deterministic audit tools only (`src/lib/audit-tools/`) | $0 by construction |

There is no paid model subscription anywhere in the loop. The trade for $0 is threefold: **rate limits** (per-minute/day caps, sized for dev and low-volume prospecting — not production traffic), **model volatility** (free catalogs and promo models rotate without notice), and **data rights** (most free tiers may train on prompts/completions — see §5). The paid escape hatches are known and cheap when needed: paid `muse-spark-1.3` (~$1.25/1M input; one audit is pennies) or Vercel AI Gateway ($5 free credit/mo, then pay-as-you-go, zero markup).

**Bottom line for leadership:** free inference covers development, evals, and pilot-scale prospecting audits today. Before any client-facing or high-volume deploy, budget either the paid Muse Spark tier or AI Gateway usage — the code already supports both without changes (see §4.4).

---

## 2. Inventory — where inference happens in this repo

### 2.1 OpenCode (the dev harness, not shipped code)

OpenCode is the terminal coding agent used to build this repo. It authenticates to **OpenCode Zen** (auth present in the dev environment: `opencode` entry in the OpenCode auth store; config at `~/.config/opencode/opencode.jsonc`). This very session runs on Zen's free tier:

- Model: `opencode/muse-spark-1.3-contributor-free` (Meta Muse Spark 1.3, agentic coding model, ~1M context).
- Endpoint: `https://opencode.ai/zen/v1/responses` — Muse Spark on Zen is **Responses-API only**; `/chat/completions` returns HTTP 500 for it.
- Price: $0 input / $0 output (limited-time feedback promo; pool rotates without notice).
- Constraint (verified 2026-09-08): the contributor-free id is **session-bound to OpenCode usage**. Headless calls (e.g. `eve invoke` from a shell without an OpenCode session) fail with `MissingSessionID`. The paid `muse-spark-1.3` id (same model) works headless.

### 2.2 Eve agents (shipped agent runtimes)

Two Eve agent projects, sharing an identical model router:

- `agents/audit-agent/` — standalone read-only website auditor (tools in `agent/tools/`, model in `agent/lib/model.ts`, wired in `agent/agent.ts`).
- `agents/optio-centuriae/` — operator command agent; mounts the audit agent locally as a subagent (`agent/subagents/audit-agent/agent.ts`) sharing the same `agent/lib/model.ts`.

Both import `primaryModel` — never a hard-coded model id — so providers swap without touching agent logic. Local credentials: both agents' `.env.local` contain all four provider keys (verified 2026-09-08).

**Production (live 2026-09-08):** `audit-agent` is deployed as Vercel project `dg-audit-agent` (team `derivativegenius`) at `https://dg-audit-agent.vercel.app`, with all four provider keys as Production secrets. Proven by headless `eve invoke --url` turn → `completed` with 3 findings; Vercel logs show the chain absorbing Groq 429 + Cerebras 402 and serving via OpenRouter. Access: `vercelOidc()` (own TUI/deployments) + OIDC subject trust for the dg-web production deployment (`vercelSubject({ teamSlug: "derivativegenius", projectName: "dg-web" })`, environment defaults to production) + `localDev()` on localhost; anonymous production turns 401 by design (`placeholderAuth()`). `optio-centuriae` is not deployed — local only. Ops runbook: `agents/audit-agent/README.md`.

### 2.3 Next.js app (no inference)

`src/` contains **zero LLM calls by default** (verified: no `ai`, `@ai-sdk/*`, Groq, or Gateway usage under `src/`). The in-app audit path (`src/lib/audit-tools/agentAudit.ts`, surfaced via `src/app/api/centurion/.../agent-audit/`) mirrors the Eve auditor's doctrine deterministically — no model, no key, no cost. Opt-in live path: when server-only `AUDIT_AGENT_URL` is set (local `eve dev` URL or deployed agent URL), that route calls the real Eve audit-agent via `eve/client` with a structured findings schema and falls back to the static checks on any failure — only public business info (name, city, industry, URL) crosses the wire. Root `.env.example` / `.env.local` accordingly contain no AI provider keys (only the optional agent URL). If the app ever needs a model directly, route it through a Route Handler with a server-only key (never `NEXT_PUBLIC_*`).

---

## 3. Provider catalog (free tiers, September 2026)

All four integrate through the existing `@ai-sdk/openai` package via `baseURL` override (OpenAI-compatible chat completions), except Zen/Muse which uses the Responses API. Limits change often — **confirm current quotas on the provider dashboard before relying on them**.

| # | Provider | Key env var | Default model (`*_MODEL_ID` override) | Free quota (indicative) | Card? | Notes |
|---|---|---|---|---|---|---|
| 1 | Groq (LPU, fastest) | `GROQ_API_KEY` (console.groq.com) | `qwen/qwen3.8-27b` | ~30 RPM, ~14.4k req/day (small models); TPM is the real ceiling (~6k/min) | No | Primary. Best latency for interactive/voice-like flows. (`llama-3.3-70b-versatile` retired — replaced 2026-09-08.) |
| 2 | Cerebras (wafer-scale, high throughput) | `CEREBRAS_API_KEY` (cloud.cerebras.ai) | `gpt-oss-120b` | ~30K TPM, ~1M tokens/day | No | Best daily volume. Catalog is volatile (has collapsed to ~2 models without notice before) — never hard-code a Cerebras-only dependency. |
| 3 | OpenRouter (aggregator) | `OPENROUTER_API_KEY` (openrouter.ai) | `nvidia/nemotron-3-ultra-550b-a55b:free` | ~20 RPM, ~50 req/day (`:free` slots; 1k/day after one-time $10 top-up) | No | Breadth + failover across free models. Free slots congest at peak and the roster rotates weekly. (`nemotron-3-nano-omni-30b-a3b-reasoning:free` replaced 2026-09-11 — Ultra verified live: correct tool calls, $0.) Requests send `HTTP-Referer`/`X-Title` headers (already in `model.ts`). |
| 4 | OpenCode Zen (Muse Spark) | `OPENCODE_API_KEY` (opencode.ai/zen) | `muse-spark-1.3-contributor-free` (`EVE_MODEL_ID` override) | Dynamic, unpublished; promo, rotates | **Billing required** | Last resort / legacy path. Responses-only, session-bound (`MissingSessionID` headless). Previous quality leader; Nemotron 3 Ultra now leads the free chain on open agentic benchmarks. |

Not currently wired but compatible later without new architecture: Google AI Studio Gemini Flash (only free *frontier closed* model, ~1.5k req/day; needs `@ai-sdk/google`), GitHub Models, Cloudflare Workers AI, Vercel AI Gateway string ids (`"provider/model"`, needs `AI_GATEWAY_API_KEY` or Vercel OIDC).

---

## 4. Technical design

### 4.1 Fallback chain (`agent/lib/model.ts:31-200`)

```text
GROQ_API_KEY ──┐
CEREBRAS_API_KEY ├─▶ first configured key wins ─▶ 429/5xx/network/MissingSessionID ─▶ next candidate
OPENROUTER_API_KEY ┤
OPENCODE_API_KEY ──┘ (Zen/Muse, last)
```

- `buildCandidates()` (`model.ts:33-97`) constructs one `LanguageModel` per **present** key: `.chat(modelId)` against each provider's OpenAI-compatible base URL, `.responses(modelId)` for Zen. Model ids overridable via `GROQ_MODEL_ID` / `CEREBRAS_MODEL_ID` / `OPENROUTER_MODEL_ID` / `EVE_MODEL_ID`.
- `withFallbacks()` (`model.ts:115-198`) returns a lazy `dg-fallback` wrapper exposing the `LanguageModel` interface (`specificationVersion` / `provider` / `modelId` / `supportedUrls` proxied from the first candidate; `modelId` reads `groq/…=>cerebras/…=>…` for observability). `doGenerate`/`doStream` try candidates in order, `console.warn` on each fallthrough (`[model-fallback] <label> … trying next`), rethrow the last error when exhausted. `AbortError` is never swallowed.
- Laziness is deliberate: candidates resolve on **first model call**, not import — so `eve build` / `tsc` compile with no keys set, and misconfiguration surfaces at request time as `No model provider configured. Set at least one of …`.
- Context window: `agent/agent.ts` sets `modelContextWindowTokens: 128_000` explicitly for all agents, because the fallback labels are not in any gateway catalog. 128k is the conservative common denominator (Groq Llama 3.3 70B, gpt-oss-120b, and the OpenRouter default are all ≥128k).

### 4.2 Setup

Local (`eve dev` / `eve invoke` / evals) — add whichever keys you have to the agent's `.env.local` (git-ignored via `.env*`):

```bash
# agents/audit-agent/.env.local and/or agents/optio-centuriae/.env.local
GROQ_API_KEY=gsk_…
CEREBRAS_API_KEY=csk_…
OPENROUTER_API_KEY=sk-or-…
OPENCODE_API_KEY=sk-…        # already present; keep as last-resort
```

One key is enough to run headless; add more for failover volume. Optional model pins: `GROQ_MODEL_ID`, `CEREBRAS_MODEL_ID`, `OPENROUTER_MODEL_ID`, `EVE_MODEL_ID`.

Deploy (`eve deploy`) — set the same variables in the **Vercel project environment** (Eve's Vercel path authenticates the deployment via OIDC, but direct-provider models still need their own keys). Two hard lessons from the 2026-09-08 `dg-audit-agent` deploy: (1) keys must pre-exist in Vercel env — `eve build` resolves model candidates, so a keyless build fails with `No model provider configured`; (2) values must be byte-clean — whitespace or stray quotes around a value produce all-provider 401s on Vercel while the same keys work locally (assert lengths after `vercel env add … --force -y`, then redeploy; env changes need a redeploy to take effect). Note `eve deploy` pulls Vercel env into the local `.env.local` (adds `VERCEL_OIDC_TOKEN`, may re-quote values — harmless, dotenv strips quotes). No code change.

Verify: `tsc` passes in both agent projects; chain order observable via the wrapper's `modelId` (`groq/…=>cerebras/…=>openrouter/…=>zen/…`); fallthrough visible as `[model-fallback]` warnings in logs.

### 4.3 Paid escape hatches (no code change)

- **Paid Muse Spark headless:** set `EVE_MODEL_ID=muse-spark-1.3` (same model, standard terms, ~$1.25/1M input). Keep `OPENCODE_API_KEY` set; Zen serves it headless.
- **Vercel AI Gateway:** replace `model: primaryModel` with a Gateway id string (e.g. `"anthropic/claude-opus-4.8"`) in `agent/agent.ts` and provide `AI_GATEWAY_API_KEY` (or link the Vercel project for OIDC). $5 free credit/mo, then upstream list price with zero markup. Eve resolves catalog metadata automatically for Gateway ids, so `modelContextWindowTokens` can be dropped on that path.

### 4.4 Maintenance rules

1. `primaryModel` stays the single import — never hard-code a provider/model in tools, subagents, or evals.
2. Treat free model ids as volatile: if Groq/Cerebras rename or retire a default, update the one default string in **both** copies of `model.ts` (they are intentionally identical; `diff` them after edits).
3. Re-check quotas quarterly (or when `[model-fallback]` warnings spike) — free tiers shrink without notice, most recently Gemini's late-2025 reduction and Cerebras catalog collapses.
4. Stack policy (repo constraint): Node.js + Next.js only. New providers must be reachable via the Vercel AI SDK (`@ai-sdk/*`, OpenAI-compatible HTTP) — no Python routers/sidecars.

---

## 5. Privacy and compliance (read before sending data)

- **Assume free tiers train on your traffic.** Confirmed for Muse Contributor-Free (its discount is explicitly in exchange for training rights); common for other free/experiment tiers. Paid Muse Spark Standard and paid Gateway/provider tiers follow standard terms instead.
- **Agent rule (binding):** never send client source code, proprietary documents, PII, credentials, or confidential customer data to a free-tier model. Prospect audits use **public business information only** — this is stated in both copies of `model.ts:26-29` and is load-bearing for the $0 posture.
- **Channel/destination check:** before wiring a new Eve channel or sending non-public data through any provider, confirm that provider's data-processing terms, retention, and available controls (same standard Eve applies to Gateway ids and direct models).
- **Key hygiene:** all provider keys are server-only. Agent `.env.local` files are git-ignored; never prefix a key with `NEXT_PUBLIC_`, never commit one, and scope Vercel env vars to the environments that need them.

---

## 6. Cost outlook

| Stage | Recommendation | Est. cost |
|---|---|---|
| Now: dev, evals, pilot audits | Stay on $0 chain (§4.2) | $0 |
| Now: production pilot (deployed `dg-audit-agent`) | Same $0 chain on Vercel + Vercel usage (Functions/Workflow/Sandbox) | $0 inference |
| First revenue-path / client-facing runs | Paid `muse-spark-1.3` via Zen (`EVE_MODEL_ID`, §4.3) | Pennies per audit |
| High volume or multi-model needs | Vercel AI Gateway pay-as-you-go | Usage-based, zero markup |

*Limits last verified September 8, 2026 against provider docs/dashboards and the Zen catalog; re-verify before building on any specific number.*
