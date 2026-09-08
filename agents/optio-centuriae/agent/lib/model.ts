import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

// Free-inference routing for this agent. Order: Groq -> Cerebras ->
// OpenRouter :free -> OpenCode Zen (Muse Spark). First configured provider
// wins; on retryable failure (429/5xx/network/MissingSessionID) the call
// falls through to the next candidate. The rest of the agent imports
// `primaryModel` — never a hard-coded model id.
//
// Free keys (no credit card, permanent free tiers with per-minute/day caps):
//   GROQ_API_KEY        https://console.groq.com       (fast LPU inference)
//   GROQ_MODEL_ID       override, default "qwen/qwen3.8-27b"
//   CEREBRAS_API_KEY    https://cloud.cerebras.ai      (~1M tokens/day)
//   CEREBRAS_MODEL_ID   override, default "gpt-oss-120b"
//   OPENROUTER_API_KEY  https://openrouter.ai          (aggregator :free slots)
//   OPENROUTER_MODEL_ID override, default "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
//   OPENCODE_API_KEY    https://opencode.ai/zen        (Zen gateway, billing required)
//   EVE_MODEL_ID        Zen model override, default "muse-spark-1.3-contributor-free"
//
// NOTE (2026-09-08, verified): `muse-spark-1.3-contributor-free` is
// session-bound to OpenCode usage — headless `eve invoke` gets
// `MissingSessionID`. It stays as last-resort legacy path only; headless
// runs should configure at least one of GROQ/CEREBRAS/OPENROUTER. Outside
// OpenCode the paid `muse-spark-1.3` id works headless (same model).
//
// PRIVACY: free tiers commonly train on prompts/completions (Muse
// Contributor-Free does; check each provider). Never send client source
// code, proprietary documents, PII, credentials, or confidential customer
// data to them. Prospect audits use public business info only.

type Candidate = { label: string; model: LanguageModel };

function buildCandidates(): Candidate[] {
  const candidates: Candidate[] = [];

  if (process.env.GROQ_API_KEY) {
    const groq = createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    candidates.push({
      label: `groq/${process.env.GROQ_MODEL_ID ?? "qwen/qwen3.8-27b"}`,
      model: groq.chat(
        process.env.GROQ_MODEL_ID ?? "qwen/qwen3.8-27b",
      ) as unknown as LanguageModel,
    });
  }

  if (process.env.CEREBRAS_API_KEY) {
    const cerebras = createOpenAI({
      apiKey: process.env.CEREBRAS_API_KEY,
      baseURL: "https://api.cerebras.ai/v1",
    });
    candidates.push({
      label: `cerebras/${process.env.CEREBRAS_MODEL_ID ?? "gpt-oss-120b"}`,
      model: cerebras.chat(
        process.env.CEREBRAS_MODEL_ID ?? "gpt-oss-120b",
      ) as unknown as LanguageModel,
    });
  }

  if (process.env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": "https://derivativegenius.com",
        "X-Title": "dg-web eve agents",
      },
    });
    candidates.push({
      label: `openrouter/${process.env.OPENROUTER_MODEL_ID ?? "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"}`,
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL_ID ??
          "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      ) as unknown as LanguageModel,
    });
  }

  if (process.env.OPENCODE_API_KEY) {
    const opencodeZen = createOpenAI({
      apiKey: process.env.OPENCODE_API_KEY,
      baseURL: "https://opencode.ai/zen/v1",
    });
    const zenModelId =
      process.env.EVE_MODEL_ID ?? "muse-spark-1.3-contributor-free";
    candidates.push({
      label: `zen/${zenModelId}`,
      // Muse Spark on Zen is Responses-API only (/chat/completions 500s).
      model: opencodeZen.responses(
        zenModelId,
      ) as unknown as LanguageModel,
    });
  }

  return candidates;
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: unknown }).name;
  return name === "AbortError" || name === "AbortSignal";
}

function describeError(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);
  const record = error as Record<string, unknown>;
  const status =
    record.statusCode ?? record.status ?? record.code ?? "unknown";
  const message =
    typeof record.message === "string" ? record.message : String(error);
  return `${status}: ${message.slice(0, 200)}`;
}

function withFallbacks(build: () => Candidate[]): LanguageModel {
  let resolved: Candidate[] | null = null;
  const candidates = (): Candidate[] => {
    if (resolved) return resolved;
    resolved = build();
    if (resolved.length === 0) {
      throw new Error(
        "No model provider configured. Set at least one of GROQ_API_KEY, CEREBRAS_API_KEY, OPENROUTER_API_KEY, or OPENCODE_API_KEY.",
      );
    }
    return resolved;
  };
  const single = (): Candidate => {
    const list = candidates();
    if (list.length === 1) return list[0];
    // Multi-candidate wrapper shape is filled in lazily on first call
    // (specificationVersion/provider/modelId are proxied below).
    return list[0];
  };

  const proxy = {
    get specificationVersion() {
      return (
        (single().model as unknown as Record<string, unknown>)
          .specificationVersion ?? "v2"
      );
    },
    get provider() {
      return "dg-fallback";
    },
    get modelId() {
      return candidates()
        .map((c) => c.label)
        .join("=>");
    },
    get supportedUrls() {
      return (
        (single().model as unknown as Record<string, unknown>)
          .supportedUrls ?? {}
      );
    },
    async doGenerate(options: never) {
      let lastError: unknown;
      for (const candidate of candidates()) {
        try {
          return await (
            candidate.model as unknown as {
              doGenerate: (o: never) => Promise<never>;
            }
          ).doGenerate(options);
        } catch (error) {
          if (isAbortError(error)) throw error;
          lastError = error;
          console.warn(
            `[model-fallback] ${candidate.label} generate failed (${describeError(error)}), trying next`,
          );
        }
      }
      throw lastError;
    },
    async doStream(options: never) {
      let lastError: unknown;
      for (const candidate of candidates()) {
        try {
          return await (
            candidate.model as unknown as {
              doStream: (o: never) => Promise<never>;
            }
          ).doStream(options);
        } catch (error) {
          if (isAbortError(error)) throw error;
          lastError = error;
          console.warn(
            `[model-fallback] ${candidate.label} stream failed (${describeError(error)}), trying next`,
          );
        }
      }
      throw lastError;
    },
  };
  // Single-candidate fast path still goes through the same lazy wrapper so
  // `eve build` without keys compiles and fails only at request time.
  return proxy as unknown as LanguageModel;
}

export const primaryModel: LanguageModel = withFallbacks(buildCandidates);
