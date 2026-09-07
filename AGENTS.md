<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack constraint (repository policy)

Node.js + Next.js only. Never propose, scaffold, or add Python, Django, FastAPI, Flask, Celery, Vue, or Firebase runtimes, backends, or dependencies. Backend work belongs in Next.js Route Handlers and server actions with Drizzle ORM + Neon PostgreSQL. (Historical removal record lives in `doc/migration-audit.md`; do not reintroduce what it removed.)
