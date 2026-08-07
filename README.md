# Derivative Genius

**Derivative Genius** is the premier **AI-First Web Development Agency**. We build high-speed, intelligent web applications, custom SaaS portals, and AI feature integrations by pairing cutting-edge AI technologies with full-stack engineering discipline.

---

## 💡 In Plain English: What We Build

Under the hood, the tech sounds complex, but for a business owner or client, **it’s actually very simple**. Here is what it means in plain English:

1. **AI-Native Web Application (*Your Smart Digital Employee*)**
   * **In simple terms:** Instead of a static brochure website where users just read text, your website acts like a smart digital employee that interacts with visitors in real time.

2. **Embedded LLM Inference (*24/7 Digital Assistant*)**
   * **In simple terms:** Having a 24/7 assistant sitting inside your app. When a client submits a question or uploads a document, the app instantly understands it, summarizes it, or writes a response.

3. **Smart Semantic Search (*Search by Meaning, Not Exact Words*)**
   * **In simple terms:** Like asking a human librarian *"Find me something on starting a small business"* instead of having to type the exact book title. The search bar understands what the user *means*, even if they misspell or use different words.

4. **Autonomous Workflow Features (*Digital Dominoes*)**
   * **In simple terms:** Digital dominoes. When a customer fills out a form on your site, the app automatically emails them a custom estimate, creates their client record, and alerts your team—without anyone having to copy and paste data manually.

### 🔑 Why This Matters to Clients

You don't need to manage any of the technical machinery (vectors, servers, API keys). **Derivative Genius handles all the heavy lifting behind the scenes.** The end result for our clients is simply:
- A **lightning-fast website** that looks stunning.
- A site that **saves dozens of hours** of manual work every week.
- A platform that **turns website visitors into qualified, paying clients** automatically.

---

## 🚀 Our Web Development Services

- **AI-Native Custom Web Applications**: Full-stack web apps engineered with embedded LLM inference, smart semantic search, and autonomous workflow features.
- **Intelligent Client Portals**: High-performance SaaS portals featuring real-time analytics, automated client onboarding, and role-based permissions.
- **AI Feature Integration & API Orchestration**: Seamlessly embedding AI models (OpenAI, Claude, custom fine-tuned endpoints) and automated webhooks into existing web systems.
- **Full-Stack Redesign & Modernization**: Upgrading legacy web applications to high-speed Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v3 with sub-second page load speeds.

---

## 🏗️ Architecture Overview

### Modern Hybrid Web Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 App Router                       │
│      React 19 • TypeScript • Tailwind CSS v3 • Radix UI      │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐┌──────────────────────────────┐
│  Server-Side Zod Validation ││      Nodemailer Dispatch     │
│   Intake Route (/api/contact)││   & Resilient Notifications  │
└──────────────┬───────────────┘└──────────────┬───────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Durable Firestore Lead Storage                 │
└─────────────────────────────────────────────────────────────┘
```

1. **Frontend Presentation (React 19 & Next.js 16)**
   - Single-Page & Server-Rendered App Router architecture (`src/app/`).
   - Responsive Tailwind CSS v3 styling with custom glassmorphism panels (`glass-panel`) and dark/light dynamic theme provider (`next-themes`).
   - Interactive particle canvas background (`DynamicBackground.tsx`).
   - Accessibility compliance (WCAG 2.1 AA) using Radix UI primitives (`@radix-ui/react-label`, `@radix-ui/react-slider`).

2. **API & Serverless Infrastructure**
   - Next.js Route Handlers (`src/app/api/contact/route.ts`) for secure intake and project scoping.
   - Strict server-side Zod schema validation to ensure input sanitization and abuse prevention.
   - Resilient notification dispatch using Nodemailer.

3. **Agentic Development Engine**
   - Integrated `.agent/` skill repository containing developer guidelines, testing frameworks, and architectural principles.
   - Custom CLI Dev Kit (`dg-cli`) for rapid local development and automated ngrok tunneling.

---

## 🛠️ The `dg` Dev Kit CLI

Derivative Genius includes a dedicated developer CLI (`dg`) to streamline local development, system auditing, and public tunneling.

### Available CLI Commands

| Command             | Description                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `dg dev`            | Start Next.js development server with auto-tunneling (`ngrok`) or graceful local mode.   |
| `dg dev --no-tunnel`| Start Next.js development server explicitly on localhost without attempting ngrok.     |
| `dg doctor`         | Run full system diagnosis checking environment variables, files, and CLI dependencies.  |
| `dg help`           | Display CLI usage and command reference.                                                 |

You can run `dg` commands directly in your shell terminal:

```bash
# Run system diagnostic check
dg doctor

# Start local dev server
dg dev

# Start local dev server directly on localhost:3000
dg dev --no-tunnel
```

---

## 🧪 Quality Gates & Development Commands

Derivative Genius enforces strict quality gates across linting, unit testing, and production builds.

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run automated Jest unit tests
npm test

# Run ESLint check
npm run lint

# Execute production Next.js build
npm run build
```

---

## 📁 Repository Structure

```text
dg-web/
├── bin/
│   └── dg.js                 # Executable CLI wrapper for dg command
├── scripts/
│   └── dg.ts                 # Derivative Genius Dev Kit (dg-cli) implementation
├── doc/
│   └── current-development-targets.md  # Source of truth for development targets
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Next.js 16 Root Layout & Theme Provider
│   │   ├── page.tsx          # AI-First Web Development Agency Home Page
│   │   ├── services/         # Web Development Service Offerings
│   │   ├── about/            # Agency Methodology & Engineering Standards
│   │   ├── contact/          # Client Intake & Scoping Form
│   │   └── api/
│   │       └── contact/      # Intake API Route Handler with Zod validation
│   ├── components/
│   │   ├── Header.tsx        # Main navigation header
│   │   ├── Footer.tsx        # Agency footer
│   │   ├── DynamicBackground.tsx # Interactive particle background animation
│   │   └── ui/               # Radix UI & Tailwind primitive components
│   ├── lib/
│   │   └── utils.ts          # Utility functions (clsx, tailwind-merge)
│   └── styles/
│       └── globals.css       # Global CSS directives & theme variables
├── jest.config.js            # Jest testing configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript compiler options
└── package.json              # Project manifest and scripts
```

---

## 🛡️ System Resilience Principles

1. **Data Persistence First**: Form payloads are validated and stored durably in Firestore prior to triggering external notifications.
2. **Graceful Fallback**: If third-party services (such as ngrok or mailers) are unavailable, system components degrade gracefully to local mode without failing the user session.
3. **Transparent User Feedback**: Form submissions communicate exact intake status to clients with real-time feedback using Sonner toast notifications.
