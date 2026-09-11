# audit-agent — read-only website auditor (eve)

An [eve](https://eve.dev) agent serving Joe Terry through Optio Centuriae. It answers one question: **what is the next safe, valuable fix?** Read-only, evidence-only, at most three findings ordered by commercial leverage. Doctrine lives in `agent/instructions.md`.

- **Production:** `https://dg-audit-agent.vercel.app` (Vercel project `dg-audit-agent`, team `derivativegenius`)
- **Health:** `GET /eve/v1/health` → `{ ok: true, status: "ready" }`
- **Full inference reference:** `doc/free-llm-inference.md` (repo root)

## Model router (all inference is $0)

`agent/lib/model.ts` exports `primaryModel` — the only import the agent uses for its model. Fallback chain, first configured key wins, 429/5xx/network/`MissingSessionID` falls through to the next candidate (watch for `[model-fallback]` warnings in logs):

| Order | Env var | Default model (override) |
|---|---|---|
| 1 | `GROQ_API_KEY` | `qwen/qwen3.8-27b` (`GROQ_MODEL_ID`) |
| 2 | `CEREBRAS_API_KEY` | `gpt-oss-120b` (`CEREBRAS_MODEL_ID`) |
| 3 | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` (`OPENROUTER_MODEL_ID`, verified live 2026-09-11) |
| 4 | `OPENCODE_API_KEY` | `muse-spark-1.3-contributor-free` (`EVE_MODEL_ID`, Responses-API only, OpenCode-session-bound) |

Free-tier limits are the ceiling (Groq TPM, Cerebras daily quota, OpenRouter `:free` congestion). Defaults are volatile — if a provider retires a model id, update the one default string here **and** in `agents/optio-centuriae/agent/lib/model.ts` (the two files are intentionally identical; `diff` them after edits).

**Privacy (binding):** free tiers may train on traffic. Only public business info goes in — never client source, proprietary docs, PII, credentials, or confidential data.

## Local development

```bash
cd agents/audit-agent

# keys — one is enough to run, more give failover (git-ignored)
cat .env.local   # GROQ_API_KEY / CEREBRAS_API_KEY / OPENROUTER_API_KEY / OPENCODE_API_KEY

npx eve dev                        # interactive TUI server
npx eve dev --no-ui --port 46083   # headless server (same port the site expects)
npx eve eval                       # call-cta-smoke eval (needs a working model path)
npx eve invoke "Audit https://example.com"   # headless single turn, JSON out
npx eve info                       # discovery/debugging
npx tsc --noEmit                   # typecheck
```

The dg-web prospect audit button talks to the local server via root `AUDIT_AGENT_URL` (e.g. `http://127.0.0.1:46083` in root `.env.local`). Localhost needs no auth (`localDev()` channel).

## Deploy

```bash
npx eve deploy --project dg-audit-agent --team derivativegenius --non-interactive --yes
```

Prerequisites that have bitten before:

1. **Provider keys must exist in the Vercel project env *before* deploying.** `eve build` resolves model candidates, so a keyless build fails with `No model provider configured`. Set them once (Production):
   ```bash
   printf '%s' "$KEY" | vercel env add GROQ_API_KEY production --force -y
   # …same for CEREBRAS_API_KEY, OPENROUTER_API_KEY, OPENCODE_API_KEY
   ```
2. **Values must be byte-clean.** Whitespace or stray quotes around a value produce all-provider 401s on Vercel while the same keys work locally. After writing, assert lengths against the known-good ones before deploying.
3. **`eve deploy` pulls Vercel env into `.env.local`** (adds `VERCEL_OIDC_TOKEN`, may re-quote values — harmless, dotenv strips quotes). Local keys are kept. `.env.local` is git-ignored; never commit it.

## Production access

`agent/channels/eve.ts`:

- `vercelOidc()` — eve TUI / own deployments.
- `vercelOidc({ subjects: [vercelSubject({ teamSlug: "derivativegenius", projectName: "dg-web" })] })` — lets the dg-web production deployment call server-to-server (its route mints OIDC via `@vercel/oidc`).
- `localDev()` — open on localhost; ignored in production.
- `placeholderAuth()` — anonymous production turns get `401 Production auth is not configured`. By design.

Verify a production turn headlessly (authenticates as your Vercel user):

```bash
npx eve invoke --url https://dg-audit-agent.vercel.app "Audit https://example.com"
```

Watch live fallover in `vercel logs https://dg-audit-agent.vercel.app` (`[model-fallback] … trying next`). Agent Runs tab under the Vercel project's Observability view has full traces.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `No model provider configured` at build | No keys in Vercel env | Set the 4 keys (Production), redeploy |
| All providers 401 on Vercel, same keys work locally | Mangled env values | Re-add clean values (`--force`), redeploy |
| `402 Payment Required` (Cerebras) | Daily quota spent | Wait for reset / falls through automatically |
| `429` (Groq) | TPM/OTPM cap | Falls through automatically; retry later |
| `MissingSessionID` (Zen) | Contributor-free is OpenCode-session-bound | Headless needs Groq/Cerebras/OpenRouter, or paid `EVE_MODEL_ID=muse-spark-1.3` |
| Button saves static findings, summary says "Live agent unreachable" | Agent server down / URL wrong | Restart `eve dev` (note the port), check `AUDIT_AGENT_URL` |

## Learn more

- [eve documentation](https://eve.dev/docs) — features and authoring APIs.
- `node_modules/eve/docs` — this project's pinned doc copy (offline truth).
- [eve on GitHub](https://github.com/vercel/eve) — source and issues.
