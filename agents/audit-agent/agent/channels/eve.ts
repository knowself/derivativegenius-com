import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc, vercelSubject } from "eve/channels/auth";

export default eveChannel({
  auth: [
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Lets the dg-web production deployment call this agent server-to-server
    // (prospect audit button). Environment defaults to "production".
    vercelOidc({
      subjects: [vercelSubject({ teamSlug: "derivativegenius", projectName: "dg-web" })],
    }),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // This placeholder will not allow browser requests in production.
    // Replace it with your app's auth provider, like Auth.js or Clerk,
    // or use none() for a public demo.
    placeholderAuth(),
  ],
});
