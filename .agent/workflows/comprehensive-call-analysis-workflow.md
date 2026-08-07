# Comprehensive Call Analysis Workflow

**Purpose:** Perform a full forensic analysis of a production or test call using the actual VoiceGeni.us telemetry stack.

**Applies to:** Emma, Brian, Jarvis, Sarah, and any future Retell-backed agent.

**Primary outcome:** Determine exactly what happened during the call, whether the platform persisted the truth correctly, whether tools ran successfully, whether the agent hallucinated or leaked character, and what remediation is required before another release.

---

## 0. Core Principles

### Truth Hierarchy

When sources disagree, trust them in this order:

1. **Retell API**: source of truth for the call artifact itself
2. **WebhookEvent**: proof of what the platform received and returned
3. **AgentAction**: proof of what the platform attempted internally
4. **Call row in Postgres**: persisted local mirror of the analyzed call
5. **Dashboard / admin UI**: convenience layer only

### Agent Immune System Rule

If the latest Retell call does not match the latest local DB call, the platform is in **Orphaned State**. Do not trust only the local dashboard. Audit via Retell first.

### What "Complete Analysis" Means

A call is not fully analyzed until you have answered all of these:

- Did the call exist and complete in Retell?
- Did the webhook arrive and verify successfully?
- Did the call persist locally?
- Which tools were invoked?
- What did each tool receive, return, and how long did it take?
- Did any side-effects happen in the database?
- Did the agent claim success without proof?
- Did the agent leak character or policy language?
- Was latency acceptable?
- What exact remediation is required, and how will it be re-verified?

---

## 1. Preconditions

### Required Environment

Load the project environment before running any forensic commands:

```bash
set -a
source .env.local
set +a
```

If `.env.local` is incomplete, some commands may still work against local DB state, but Retell, Twilio, Calendar, and Postmark validation will be partial.

### Required Inputs

Prefer to have:

- `CALL_ID`
- approximate call time
- agent identity
- symptom being investigated

If you do not know the `CALL_ID`, start with the heartbeat step below.

---

## 2. Fast Start

### Step 2.1: Check the Latest Call and Pipeline Integrity

```bash
npx tsx scripts/check-latest-call.ts
```

Use this first when:

- you do not know the call ID
- you suspect webhook signature drift
- the dashboard looks incomplete

**Expected output:**

- latest Retell call ID
- latest local DB call ID
- explicit warning if the latest Retell call is missing from local DB

### Step 2.2: Pull the Call Directly from Retell

```bash
npx tsx scripts/retellai/get-call-details.ts <CALL_ID>
```

or

```bash
npx tsx scripts/get-call-details.ts <CALL_ID>
```

This is the canonical source for:

- transcript
- `transcript_object`
- `transcript_with_tool_calls`
- recording URLs
- public log URL
- latency metrics
- call analysis
- disconnection reason

### Step 2.3: Generate the Forensic Report

```bash
npx tsx scripts/forensic/generate-analysis-report.ts <CALL_ID>
```

**Output location:**

`docs/voice-agent-test-scripts/call.logs/`

This report correlates:

- Retell call data
- `AgentAction`
- `WebhookEvent`
- hallucination signals
- latency signals
- leakage signals

### Step 2.4: Generate the Tool Timeline Report

```bash
npx tsx scripts/analyze-last-calls.ts <CALL_ID>
```

This creates a second markdown artifact with:

- tool call / tool response sequence
- approximate latency correlation from `AgentAction`
- transcript
- summary
- call economics

### Step 2.5: Run the Hallucination Detector

```bash
npx tsx scripts/forensic/detect-hallucinations.ts <CALL_ID>
```

This is the fastest way to check whether the agent claimed success without the expected tool calls.

---

## 3. Evidence Bundle Collection

Do not begin manual diagnosis until you have all of the following.

### Evidence A: Retell Truth

```bash
npx tsx scripts/retellai/get-call-details.ts <CALL_ID> > /tmp/<CALL_ID>.retell.json
```

Extract and inspect:

- `call_status`
- `start_timestamp`
- `end_timestamp`
- `duration_ms`
- `transcript`
- `transcript_object`
- `transcript_with_tool_calls`
- `recording_url`
- `recording_multi_channel_url`
- `public_log_url`
- `call_analysis`
- `latency`
- `disconnection_reason`

### Evidence B: Webhook Trail

```bash
npx tsx scripts/check-webhook-logs.ts <CALL_ID>
```

Then also inspect recent failures globally:

```bash
npx tsx scripts/check-webhook-status.ts
npx tsx scripts/check-webhook-errors.ts
```

Look for:

- `signature_failure`
- `verification_error`
- `tool_call`
- `tool_response`
- `db_error`
- `missing_call_id`
- `idempotency_skip`
- `skills_error`
- `refinery_error`

### Evidence C: Local DB Side-Effects

```bash
npx tsx scripts/verify-call-db.ts <CALL_ID>
```

This checks whether the call produced:

- lead records
- consultation records
- webhook events

### Evidence D: Deep Persistence Inspection

```bash
npx tsx scripts/debug-call-deep.ts <CALL_ID>
```

Use this when you need to answer:

- does local `Call.metadata` contain the expected transcript structures?
- does local metadata include tool-call detail?
- do Retell and local DB disagree about tool evidence?

---

## 4. Manual Analysis Procedure

Follow these sections in order. Do not skip to prompt changes until the persistence path is proven healthy.

### 4.1 Heartbeat and Persistence

Answer these first:

1. Did Retell return the call successfully?
2. Does the local `Call` row exist?
3. Do `WebhookEvent` rows exist for the call?
4. Do `AgentAction` rows exist for the call?

#### Interpretation

- **Retell yes, local Call no**:
  pipeline failure or orphaned call
- **WebhookEvent yes, local Call no**:
  likely failure during `call_analyzed` or `call_ended` upsert
- **WebhookEvent no, Retell yes**:
  webhook delivery, signature, or endpoint problem
- **AgentAction no, WebhookEvent tool_call yes**:
  tool dispatch path received the request but internal audit trail did not persist

### 4.2 Timeline Reconstruction

Reconstruct the call in this order:

1. call starts in Retell
2. tool_call webhook arrives
3. tool executes and logs `AgentAction`
4. tool_response webhook is stored
5. call_analyzed or call_ended arrives
6. `db.call.upsert` persists the final call mirror

If you cannot place the failure on this timeline, the analysis is incomplete.

### 4.3 Tool Integrity Review

For each tool used in the call, document:

- tool name
- arguments received
- response returned
- `AgentAction.status`
- `AgentAction.durationMs`
- whether the side-effect happened

#### Good State

- `tool_call` exists
- `tool_response` exists
- `AgentAction` exists
- response `success: true`
- intended DB or third-party side-effect exists

#### Broken States

- tool call without response
- response without action
- action marked `FAILURE`
- success response with missing side-effect
- repeated calls caused by retry loop or interruption behavior

### 4.4 Hallucination Review

This is always high priority.

#### Red Flag Phrases

- "You're all set"
- "I've booked that"
- "I've logged your information"
- "Confirmed"
- "Locked in"
- "Verified"

#### Required Proof

Any success claim must be backed by:

- a matching tool call
- a successful tool result
- the expected side-effect

#### Severity

- **P0 Critical**:
  agent claims a booking, dispatch, verification, or logged outcome that never happened
- **P1 High**:
  agent partially overstates progress while underlying tool failed
- **P2 Medium**:
  ambiguous forward-leaning language without explicit false completion claim

### 4.5 Character Integrity / Linguistic Leakage

Search the transcript and report for:

- "I am an AI"
- "I'm an AI"
- "As an AI"
- "language model"
- "your AI consultant"
- product-marketing language that breaks role fidelity

Classify the failure:

- **P1 High** if it breaks character on a customer-facing production call
- **P2 Medium** if the voice remains functional but brand integrity is damaged

### 4.6 Latency Review

Use both sources:

- Retell `latency` metrics from the call payload
- `AgentAction.durationMs` for tool execution

#### Tool Latency Thresholds

| Range | Meaning | Action |
| --- | --- | --- |
| `<500ms` | Excellent | no action |
| `500ms-2000ms` | Acceptable | monitor |
| `>2000ms` | High latency | investigate |
| `>5000ms` | Severe user-facing risk | remediate before release |

#### Investigate High Latency With

```bash
npx tsx scripts/check-crm-config.ts
npx tsx scripts/check-calendar-config.ts
npx tsx scripts/check-twilio-config.ts
npx tsx scripts/verify-services.ts
```

### 4.7 Outcome Review

Determine what the business outcome actually was.

Possible outcomes:

- lead captured successfully
- verification completed successfully
- booking completed successfully
- dispatch completed successfully
- graceful fallback executed
- call ended without completion
- pipeline failed despite apparent successful conversation

Do not rely only on Retell `call_successful`. Validate against local side-effects and webhook evidence.

### 4.8 Financial / Release Readiness Review

If the call is part of release gating, regenerate the scorecard:

```bash
node scripts/release/generate-scorecard.mjs
node -r dotenv/config release/verify/release-check.ts beta
```

Use this to confirm:

- webhook error rate
- critical path success rate
- dead-air over 2 seconds
- leakage rate
- path success for lead capture / verification / booking

---

## 5. Diagnosis Matrix

| Symptom | Likely Cause | Confirm With | Primary Fix Area |
| --- | --- | --- | --- |
| Retell call exists, DB call missing | webhook signature failure or end-of-call persistence failure | `check-latest-call.ts`, `check-webhook-errors.ts`, `debug-call-deep.ts` | `/api/retell/webhook` |
| Tool called, no side-effect | tool implementation failed or returned soft success | `verify-call-db.ts`, forensic report, tool definition | `lib/tools/definitions/*` |
| Agent claims success, no tool evidence | hallucination / bad prompt discipline | hallucination detector, transcript, `AgentAction` | agent prompt / node instructions |
| Tool latency >2s | external dependency or DB slowness | `AgentAction.durationMs`, service checks | Calendar, Twilio, DB, outbound API |
| Repeated tool calls | interruption loop / missing guardrail | `WebhookEvent` sequence, transcript_with_tool_calls | flow logic / prompt guardrails |
| Character leakage | persona prompt drift | transcript, forensic report | prompt opening / global guardrails |
| call_successful=true but local outcome missing | analysis overstates outcome or local persistence failed | Retell payload + DB verification | analysis assumptions or persistence path |

---

## 6. Remediation Paths

### 6.1 Pipeline / Persistence Failures

Focus on:

- `app/api/retell/webhook/route.ts`
- signature configuration
- `db.call.upsert` path
- event logging during `call_analyzed` / `call_ended`

Useful checks:

```bash
npx tsx scripts/check-sig-failures.ts
npx tsx scripts/verify-webhook-config.ts
npx tsx scripts/verify-webhook-integrity.ts
npx tsx scripts/verify-webhook-prod.ts
```

### 6.2 Tool Failures

Focus on:

- tool definition schema
- tool implementation
- dependency credentials
- failover copy shown to the caller

Useful checks:

```bash
npx tsx scripts/check-crm-config.ts
npx tsx scripts/check-calendar-config.ts
npx tsx scripts/check-twilio-config.ts
npx tsx scripts/test-sms-verification-tool.ts
```

### 6.3 Hallucination / Overclaiming

Required changes:

- add or strengthen "do not claim success before confirmed tool result" instructions
- ensure fallback language is explicit when tools fail
- review any node that allows the agent to summarize successful actions before the tool response returns

### 6.4 Character Leakage

Required changes:

- remove explicit AI identity statements unless intentionally part of the product
- preserve persona and role language
- review `global_guardrails.md` alignment

---

## 7. Re-Verification Procedure

After any fix, run a fresh test call and repeat the analysis.

### Minimum Re-Verification Commands

```bash
npx tsx scripts/check-latest-call.ts
npx tsx scripts/forensic/generate-analysis-report.ts <NEW_CALL_ID>
npx tsx scripts/analyze-last-calls.ts <NEW_CALL_ID>
npx tsx scripts/forensic/detect-hallucinations.ts <NEW_CALL_ID>
npx tsx scripts/verify-call-db.ts <NEW_CALL_ID>
npx tsx scripts/check-webhook-logs.ts <NEW_CALL_ID>
```

### Pass Criteria

All of the following must be true:

- latest Retell call is present locally or the cause is explicitly understood
- no signature or verification failure for the test call
- all expected tools have both webhook and action evidence
- expected side-effects exist in DB or downstream system
- no hallucination detected
- no unacceptable character leakage
- no critical latency event on the primary path

---

## 8. Artifact Requirements

Every serious call investigation should leave behind artifacts.

### Required Outputs

- generated forensic report in `docs/voice-agent-test-scripts/call.logs/`
- generated tool timeline report in `docs/voice-agent-test-scripts/call.logs/`
- remediation note in `docs/remediation-plans/`

### Remediation File Naming

`docs/remediation-plans/remediation-plan-YYYY-MM-DD-<brief-slug>.md`

### Minimum Remediation Template

```markdown
# Remediation Plan: <Issue Name>

**Date:** YYYY-MM-DD
**Severity:** P0 / P1 / P2
**Affected Agent:** <Agent Name>
**Call ID:** <CALL_ID>

## Issue Summary
<What failed>

## Evidence
- Retell:
- Webhook:
- AgentAction:
- DB side-effects:

## Root Cause
<Precise technical cause>

## Fix
<What changed>

## Verification
<Fresh call ID and results>

## Prevention
<What prevents recurrence>
```

---

## 9. Known Current Gaps

This workflow is designed around the current state of the repo, including its imperfections.

- The dashboard call detail page is useful but not complete forensic truth.
- The admin call debugger is still a POC and should not be treated as the canonical audit surface.
- Some local analytics and release-gate metrics may underread nested metadata if the webhook stores the full payload under `metadata.call`.
- When in doubt, always fall back to direct Retell retrieval plus `WebhookEvent` and `AgentAction`.

---

## 10. Quick Command Pack

```bash
# Load env
set -a && source .env.local && set +a

# Heartbeat
npx tsx scripts/check-latest-call.ts

# Retell truth
npx tsx scripts/retellai/get-call-details.ts <CALL_ID>

# Webhook trail
npx tsx scripts/check-webhook-status.ts
npx tsx scripts/check-webhook-errors.ts
npx tsx scripts/check-webhook-logs.ts <CALL_ID>

# Local DB proof
npx tsx scripts/verify-call-db.ts <CALL_ID>
npx tsx scripts/debug-call-deep.ts <CALL_ID>

# Forensic analysis
npx tsx scripts/forensic/generate-analysis-report.ts <CALL_ID>
npx tsx scripts/analyze-last-calls.ts <CALL_ID>
npx tsx scripts/forensic/detect-hallucinations.ts <CALL_ID>

# Dependency checks
npx tsx scripts/check-crm-config.ts
npx tsx scripts/check-calendar-config.ts
npx tsx scripts/check-twilio-config.ts
npx tsx scripts/verify-services.ts

# Release view
node scripts/release/generate-scorecard.mjs
node -r dotenv/config release/verify/release-check.ts beta
```

---

## 11. Definition of Done

A call analysis is complete only when:

- the call's truth source has been pulled from Retell
- local persistence has been validated
- tool behavior has been correlated across webhook, action, and side-effects
- hallucination and leakage checks have been completed
- latency has been assessed
- a root cause has been identified or the unknown is explicitly documented
- remediation and re-verification steps are written down

Anything less is partial debugging, not comprehensive call analysis.
