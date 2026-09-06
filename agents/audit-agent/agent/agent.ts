import { defineAgent } from "eve";
import { primaryModel } from "./lib/model.js";

export default defineAgent({
  model: primaryModel,
  // Unlisted model: eve cannot resolve context metadata from the AI Gateway
  // catalog, so this must be explicit. 128k is a conservative placeholder —
  // correct it when Meta publishes the Muse Spark 1.3 window. Err low: an
  // understated window only compacts early, an overstated one overflows.
  modelContextWindowTokens: 128_000,
});
