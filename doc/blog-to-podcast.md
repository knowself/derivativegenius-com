# Implementation Plan: Automated Blog-to-Podcast Engine (Google & Free Open-Source Tools)

> **Document:** `doc/blog-to-podcast.md`  
> **Status:** Specification / Open-Source & Google Architecture  
> **Target Release:** Eve Fleet `content-factory` / Centurion Phase 2  
> **Stack:** Next.js 16 App Router (TypeScript) · Drizzle ORM · Neon PostgreSQL · Google AI Studio / Gemini API · Google Cloud TTS / F5-TTS · Vercel Blob / Google Cloud Storage  
> **Cost Target:** **$0.00 / Month** (Leveraging Google AI Studio Free Tier, Google Cloud Free Tier, and MIT-licensed Open-Source Models)  
> **Core Principle:** *"Agents prepare, draft, and surface; humans approve and send"* (with optional auto-publish toggle).

---

## 1. Executive Summary & Vision

When a blog article is published on **Derivative Genius** (`/blog/[slug]`), the system transforms the written article into a broadcast-quality **audio podcast episode** using **100% Google tools and free open-source tools**—with zero recurring subscription costs to third-party voice vendors (such as ElevenLabs).

### The Two Podcast Formats:
1. **Format 1: Solo Teardown (Joe Terry Cloned Voice)**  
   Joe Terry directly breaks down the article's core thesis, diagnostic mistakes contractors make, and the tactical fix.
2. **Format 2: The Contractor Hot Seat (Host Interviewer & Joe Terry Q&A)**  
   An AI interviewer/co-host introduces the episode, acts as the curious contractor advocate, and asks 3–5 sharp diagnostic questions derived directly from the blog sections. Joe answers with real data, proof cases, and direct response economics.

---

## 2. Architecture & Free Toolchain

```mermaid
graph TD
    A[Blog Post Published in Centurion] --> B{Trigger: Manual or Auto}
    B -->|Article Markdown| C[Google Gemini 2.5 Flash / Google AI Studio API]
    C -->|Free Tier Script Extraction| D[Structured Dialogue JSON: Host + Joe]
    D --> E{Voice Synthesis Engine}
    
    subgraph Option 1: Pure Google Stack (Cloud Free Tier)
        E -->|Host Voice| F1[Google Cloud TTS: Journey / Studio Voices]
        E -->|Joe Cloned Voice| F2[Google Cloud Custom Voice / Gemini Audio]
    end
    
    subgraph Option 2: Pure Open-Source Stack (Zero Cost)
        E -->|Host Voice| G1[Kokoro TTS: 82M MIT-licensed CPU Model]
        E -->|Joe Cloned Voice| G2[F5-TTS / CosyVoice: Zero-Shot Audio Cloning]
    end
    
    F1 --> H[Audio Stitcher: Node.js In-Memory MP3 Buffer]
    F2 --> H
    G1 --> H
    G2 --> H
    
    H --> I[Vercel Blob or Google Cloud Storage Free Tier]
    I --> J[Update content_posts in Neon DB]
    J --> K[In-line PodcastPlayer on /blog/slug]
    J --> L[/podcasts Directory]
    J --> M[/feed/podcast.xml Apple/Spotify RSS]
```

---

## 3. Technology Evaluation: Google Tools vs. Free Open-Source

To ensure 100% free operation and full ownership of your voice model, two production-ready pathways are specified below. Both fit seamlessly into the Next.js/Node.js architecture.

### Option A: The Google Cloud & Google AI Studio Stack (Recommended)
| Capability | Google Tool | Pricing / Free Tier Allocation |
|---|---|---|
| **Dialogue & Scripting** | **Google Gemini 2.5 Flash** (`@google/genai`) | **Free** (Up to 15 RPM / 1M tokens/min on Google AI Studio free tier) |
| **Interviewer Voice** | **Google Cloud TTS (Journey & Studio Voices)** | **Free** (1 Million WaveNet/Neural2 characters free every month) |
| **Joe Cloned Voice** | **Google Cloud TTS Custom Voice** OR **Gemini 2.0 Native Audio Generation** | **Free tier / Pay-as-you-go with $300 Google Cloud credit** |
| **Storage** | **Google Cloud Storage (GCS)** or **Vercel Blob** | **Free** (GCS Always Free: 5 GB-months; Vercel Blob Hobby: 1 GB) |

### Option B: The Pure Open-Source Zero-Cost Stack
| Capability | Open-Source Tool | License & Footprint |
|---|---|---|
| **Dialogue & Scripting** | **Google Gemini Flash Free Tier** or **Local Ollama/Llama-3.3** | Free API / Open weights |
| **Interviewer Voice** | **Kokoro-TTS** (82M parameter speech model) | **Apache 2.0 / MIT**; runs in milliseconds on standard CPU via ONNX / Node.js; studio-grade quality |
| **Joe Cloned Voice** | **F5-TTS** or **CosyVoice** (Zero-shot Voice Cloning) | **MIT / Open Source**; clones Joe's voice from a single 10-second reference WAV file; runs on free Google Colab, HuggingFace Inference, or Google Cloud Run |
| **Audio Stitcher** | Pure Node.js stream / MP3 frame concatenation | **MIT**; zero binary dependencies, runs on Vercel Serverless |

---

## 4. Episode Formats & Dialogue Design

### Mode 1: Solo Executive Briefing (3–5 min)
- **Speaker:** Joe Terry.
- **Structure:**
  1. *Hook & Problem:* Why typical contractor websites bounce 90% of traffic.
  2. *The Core Principle:* Tap-to-call, VSL proof, and owned media over walled gardens.
  3. *Action Checklist:* 3 things to audit right now.

### Mode 2: "The Contractor Briefing" Interviewer Q&A (6–10 min)
- **Host / Interviewer (e.g. Google Journey-F or Kokoro "af_bella"):** Inquisitive, articulate podcast host.
- **Expert / Guest (Joe Terry Cloned Voice):** Direct, practical, grounded in local business metrics.
- **Structure:**
  - **Show Opener (Host):**  
    *"Welcome back to the Local Presence Podcast by Derivative Genius. Today, we're dissecting Joe Terry's latest briefing: '[Article Title]'. Joe, right at the top of this article, you called out a massive mistake most service contractors make. What is going wrong on these homepages?"*
  - **Round 1 — The Diagnostic Flaw (Joe):**  
    Joe explains the mistake directly from the blog text (e.g., hero sliders with stock photos instead of a direct phone number and video).
  - **Round 2 — The Counter-Intuitive Truth (Host + Joe):**  
    Host asks: *"Why do web agencies keep selling those 5-page template sites if they don't convert?"*  
    Joe explains the economic misalignment between agencies and local operators.
  - **Round 3 — The Evidence & Math (Host + Joe):**  
    Host asks: *"In the article, you cited numbers from [Case Study Name]. Walk us through what happened when they fixed this."*  
    Joe walks through the numbers and the turnaround.
  - **Show Outro (Host):**  
    Host directs listeners to inspect their own website using the free audit tools at `derivativegenius.com` and read the full post.

---

## 5. Technical Implementation Steps

### Phase 1: Free API Setup & Environment Configuration

In `.env.local`:
```bash
# 1. Google AI Studio (Free Gemini API Key)
# Get free key from: https://aistudio.google.com/
GEMINI_API_KEY="AIzaSy..."

# 2. Google Cloud TTS (Free Tier: 1M characters/month)
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
# Or Google TTS Voice Configurations:
GOOGLE_TTS_INTERVIEWER_VOICE="en-US-Journey-F" # Highly natural conversational voice

# 3. Voice Clone Endpoint (F5-TTS on Google Cloud Run or HuggingFace Spaces)
# Zero-shot voice cloning from a 10s sample of Joe's voice
VOICE_CLONE_API_URL="https://your-open-source-clone-endpoint.run.app"
VOICE_CLONE_SAMPLE_URL="https://derivativegenius.com/audio/joe-voice-reference-10s.wav"

# 4. Storage (Vercel Blob or Google Cloud Storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

---

### Phase 2: Dialogue Extraction with Google Gemini 2.5 Flash (`src/lib/podcast/script-generator.ts`)

Leveraging Google's official `@google/genai` SDK:

```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DialogueSegment {
  speaker: 'host' | 'joe';
  text: string;
}

export interface PodcastScript {
  title: string;
  mode: 'solo' | 'interview';
  segments: DialogueSegment[];
  summary: string;
}

export async function generatePodcastScript(
  articleTitle: string,
  articleMarkdown: string,
  mode: 'solo' | 'interview' = 'interview'
): Promise<PodcastScript> {
  const prompt = `
You are a broadcast podcast producer for "The Local Presence Podcast" by Derivative Genius.
Transform the following written blog post into an engaging, natural-sounding audio podcast script.

FORMAT: ${mode === 'interview' ? 'Two-person interview between an articulate, curious Host and Joe Terry (expert founder).' : 'Solo executive breakdown by Joe Terry.'}

RULES:
1. Write for the EAR, not the eye. Use short, punchy sentences, natural speech pauses, and conversational transitions.
2. In 'interview' mode:
   - Host asks 3 to 4 sharp questions based STRICTLY on the problems and insights answered in the article.
   - Joe Terry answers in his signature tone: direct response, practical, citing real numbers, anti-fluff.
   - Begin with a 15-second host intro introducing the episode and Joe.
   - End with a 15-second host sign-off reminding listeners to check their own score at derivativegenius.com.
3. In 'solo' mode: Joe directly addresses the listener.
4. Output strict JSON with schema:
   {
     "title": "string",
     "mode": "${mode}",
     "summary": "string",
     "segments": [
       { "speaker": "host" | "joe", "text": "spoken text" }
     ]
   }

ARTICLE TITLE: ${articleTitle}

ARTICLE CONTENT:
${articleMarkdown}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  return JSON.parse(response.text || '{}') as PodcastScript;
}
```

---

### Phase 3: Dual-Voice Audio Synthesis (Google & Open-Source)

Create `src/lib/podcast/voice-synthesizer.ts`:

1. **Host Voice (Google Cloud Journey TTS or Kokoro-TTS)**:
   - Google's `en-US-Journey-F` or `en-US-Journey-D` provides human-grade conversational intonation with zero robotic artifacting.
   - 100% free up to 1 million characters/month on Google Cloud.
2. **Joe Terry Voice Clone (F5-TTS / CosyVoice Open Source)**:
   - Provide a permanent 10-second reference audio sample of Joe's voice (`joe-voice-reference-10s.wav`).
   - Send segment text + reference sample to the open-source F5-TTS inference handler.
   - Generates matching audio with Joe's pitch, timbre, and cadence.
3. **In-Memory Audio Assembly (`src/lib/podcast/audio-stitcher.ts`)**:
   - Merge audio buffers in sequence with a 400ms silent spacer between turns.
   - Add optional 3-second acoustic intro sting.
   - Stream final audio directly to Vercel Blob (`@vercel/blob`) or Google Cloud Storage.

---

### Phase 4: Centurion Operator UI (`src/app/centurion/content/[id]/page.tsx`)

Inside the existing Centurion Content Editor:

1. **"Podcast Studio" Panel**:
   - Select Format: `[●] Interviewer & Joe Q&A` vs `[ ] Solo Joe Briefing`.
   - Button: `🎙️ Draft Podcast Script (Gemini Flash)`.
2. **Interactive Dialogue Drawer**:
   - Review each generated segment:
     - 🎙️ **Host:** *"Joe, what is the biggest mistake on HVAC homepages?"* (Editable)
     - 👤 **Joe Terry:** *"Most owners have a 5-picture slider that takes 4 seconds to load..."* (Editable)
   - Ability to add, delete, or rewrite any line before audio generation.
3. **Audio Generation & Preview**:
   - Button: `⚡ Synthesize Episode (Google & Open-Source Voice)`.
   - Audio preview player directly in the browser to listen to the dialogue before public release.
4. **Auto-Generate Option**:
   - Toggle: *"Generate & attach podcast episode automatically when publishing blog post."*

---

### Phase 5: Syndication & Reader Experience (Already Wired)

Because the system uses `schema.contentPosts`, as soon as `audioUrl` is saved:
1. **On the Post Page ([`/blog/[slug]`](file:///home/knowself/dev/dg-web/src/app/blog/%5Bslug%5D/page.tsx))**:
   - The in-line [`PodcastPlayer`](file:///home/knowself/dev/dg-web/src/components/content/PodcastPlayer.tsx) appears instantly above the article.
2. **On the Podcasts Page ([`/podcasts`](file:///home/knowself/dev/dg-web/src/app/podcasts/page.tsx))**:
   - The episode is automatically listed with episode number and full notes.
3. **On RSS Syndication ([`/feed/podcast.xml`](file:///home/knowself/dev/dg-web/src/app/feed/podcast.xml/route.ts))**:
   - The episode is broadcast to Apple Podcasts and Spotify with valid iTunes tags and enclosure links.

---

## 6. Implementation Milestones

| Step | Milestone | Tech Used | Cost |
|---|---|---|---|
| **1** | Record 10-Second Clean Reference WAV of Joe's Voice | Studio Mic / Phone | **$0.00** |
| **2** | Add Google Gemini AI Studio API key to `.env.local` | `@google/genai` | **$0.00** (Free Tier) |
| **3** | Build Script Generator (`src/lib/podcast/script-generator.ts`) | Gemini 2.5 Flash | **$0.00** |
| **4** | Setup Voice Synthesis (`src/lib/podcast/voice-synthesizer.ts`) | Google Cloud TTS + F5-TTS | **$0.00** |
| **5** | Build In-Memory Audio Stitcher (`src/lib/podcast/audio-stitcher.ts`) | Node.js Buffer Stream | **$0.00** |
| **6** | Create API Route (`/api/centurion/content/[id]/podcast`) | Next.js App Router Route Handler | **$0.00** |
| **7** | Integrate UI into Centurion Editor | React Server/Client Components | **$0.00** |
| **8** | End-to-End Test with a Sample Article | Full Pipeline Verification | **$0.00** |

---

## 7. Cost & Quota Analysis

- **Google Gemini 2.5 Flash:** 15 requests per minute, 1,500 requests per day, 1 million tokens per minute — **100% Free** on Google AI Studio.
- **Google Cloud TTS:** 1,000,000 characters per month free (equivalent to ~100 full 8-minute episodes per month) — **100% Free**.
- **F5-TTS / Kokoro Open Source:** Self-hosted on Google Cloud Run (2 million free requests/month) or run locally during build/publish — **100% Free**.
- **Total Monthly Vendor Cost: $0.00**.
