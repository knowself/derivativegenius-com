# DEVELOPMENT.md

**Project:** Derivative Genius (`derivativegenius-com`)
**Purpose:** How Joe Terry and Optio Prime plan and develop this repository together.
**Status:** Draft for Joe's review — nothing here is final until he approves it.
**Last updated:** 2026-09-26

Related docs: `doc/current-development-targets.md` (engineering priorities — the source of truth for *what* we're building), `AGENTS.md` (repo conventions — the rules for *how* the code is built).

---

## 1. Who does what

- **Joe** works in VSCode with OpenCode and open-source models. He runs builds, tests, and deploys. He merges. Nothing ships without his word.
- **Optio Prime** works through GitHub: reads code, writes plans, implements on branches, opens pull requests, and reviews anything OpenCode or the local models produce before Joe trusts it.

## 2. The loop

1. **Joe describes** what he wants — a feature, a fix, a refactor. One line is fine.
2. **Optio plans** — reads the relevant code and comes back with a short plan: what changes, where, and what could break.
3. **Joe picks a lane:**
   - *Optio implements* — I build it on a feature branch and open a PR. Joe pulls it in VSCode, runs it, reviews.
   - *Spec for OpenCode* — I write a tight spec Joe feeds to his local models.
4. **Joe runs it** — build, test, click through. He reports what broke or what he doesn't like.
5. **Optio fixes** — iterate until it's right.
6. **Joe merges** — only on his explicit word.

## 3. Stack rules (from AGENTS.md — non-negotiable)

- Node.js + Next.js 16, React 19, TypeScript, Tailwind CSS.
- Clerk auth, Neon Postgres + Drizzle ORM, Zod validation.
- Deploys on Vercel only.
- Permanently banned: Python web runtimes, Vue, Firebase, ICP/Motoko/Rust-on-ICP, caffeine.ai.

## 4. UI/UX standard

- **Design system before code.** Every UI task starts with a locked design block: style, palette, typography, spacing, effects, anti-patterns. No building from vibes.
- **Mobile-first.** Thumb-zone CTAs, 44–48px touch targets, one primary action per screen, no hover-dependent UI — even on desktop builds.
- **Pre-delivery audit.** Every UI change gets checked against the visual, typography, touch, motion, navigation, accessibility, and trust checklist before Joe sees it.
- **Anti-default gate.** If it looks like every other AI-generated design, the style choice gets rethought.

## 5. Branching

- Feature branches off `main`: `optio/<short-description>`.
- One PR per change. Joe reviews and merges in his own time.
- No direct pushes to `main`. No exceptions.

## 6. Decisions log

| Date | Decision | By |
|------|----------|----|
| 2026-09-26 | Optio works via GitHub; Joe builds/tests/merges locally | Joe + Optio |
| 2026-09-26 | DEVELOPMENT.md created as the working agreement | Joe |

## 7. Open questions

- (none yet)
