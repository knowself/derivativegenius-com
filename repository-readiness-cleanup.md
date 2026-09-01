# Repository Readiness Cleanup

## Goal
Remove obsolete Python tooling and restore a reproducible Node development workflow.

## Tasks
- [x] Identify legacy Python runtime, deployment, and service-management artifacts.
- [x] Remove obsolete Python artifacts and update the deployment verifier for Next.js.
- [x] Regenerate `package-lock.json` with a supported Node runtime.
- [x] Verify clean installation, linting, type checking, tests, and production build.

## Done When
- [x] Development and deployment require Node.js only.
- [x] `npm ci`, lint, types, tests, and build pass.
