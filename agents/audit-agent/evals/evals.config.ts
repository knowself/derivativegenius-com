import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  // Fully deterministic evals; no judge model needed.
  maxConcurrency: 1,
});
