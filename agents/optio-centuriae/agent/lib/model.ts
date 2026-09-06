import { createOpenAI } from "@ai-sdk/openai";

// Model routing for this agent. Single source: OpenCode Zen (OpenAI
// Responses-compatible) serving Muse Spark. The rest of the agent imports
// `primaryModel` — never a hard-coded model id — so providers can be swapped
// without touching agent logic (e.g. when the free promotion ends, or for the
// mandatory cross-provider fallbacks before any client-facing deploy).
//
// Requires OPENCODE_API_KEY (a separate Zen key from https://opencode.ai/zen,
// never harness credentials). See https://opencode.ai/docs/zen/.
//
// PRIVACY: muse-spark-1.3-contributor-free is free in exchange for permission
// to train future Meta models on prompts and completions. Never send client
// source code, proprietary documents, PII, credentials, or confidential
// customer data to this model. Prospect audits use public business info only.
const opencodeZen = createOpenAI({
  apiKey: process.env.OPENCODE_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

export const primaryModel = opencodeZen.responses("muse-spark-1.3-contributor-free");
