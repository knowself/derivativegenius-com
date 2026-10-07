# The Derivative Genius Jingle Factory

How we produce unlimited 15-second custom jingles. Open-source chain, clean rights, repeatable per client.

## The product

One custom **sung** 15-second jingle per Growth Retainer client ($500/mo tier).

**The 15-second template** (every jingle follows this):
- **0–5s — the hook:** client's top search term + town ("Phone's not ringing?")
- **5–12s — the promise:** the one problem they solve ("Google buries businesses like yours")
- **12–15s — the nudge:** "call now" + phone number ("Get found! Get called! Get growing!")

## Pipeline stages

### 1. Inputs (per jingle)
Client business name, top search term, town, phone number. Lyrics written from the template above — 7 lines max, singable.

### 2. Bed production — WORKING TODAY
**Script:** `jingle/compose_bed.py`

Pure open-source synthesis (numpy + ffmpeg). No samples, no GPU, no cloud, no subscriptions. Renders in ~2 seconds.

```bash
python3 compose_bed.py --out client-slug --key C --bpm 120
```

Produces two files:
- `{slug}-bed.mp3` — instrumental backing (piano chords, bass, drums). This is what the final mix plays under the vocal.
- `{slug}-guide.mp3` — bed + synth guide melody playing the vocal line, so the singer hears exactly what to sing.

**Tweaking:** key (`--key C/G/D/A/E/F/Bb`), tempo (`--bpm`). The default composition (melody + chord maps) lives at the top of the script — edit `MEL`/`CHORDS` to write a new tune per client, or transpose per vocalist range.

**Rights:** the composition is original, synthesized from scratch. You own every note. No sample licenses, no royalty splits.

### 3. Vocal — three paths

**Path A — Joe records (working today).** Joe listens to the guide, sings 15 seconds into his phone, sends the recording. Fits the brand ("sung by Joe himself"). Cost: $0. Time: 10 minutes per client.

**Path B — open-source AI singer (the scale play, needs a GPU).** The pick: **ACE-Step 1.5** — open-source lyrics-to-song model, **MIT license** (commercially clean), runs on ~4–6 GB VRAM, and supports **LoRA voice cloning**: train it once on Joe's singing, and every client jingle comes out "sung by Joe" with no recording session. [ACE-Step 1.5 on GitHub](https://github.com/ace-step/ACE-Step-1.5)

What it needs: this machine has no GPU, so ACE-Step can't run here. Options: a cheap cloud GPU spot instance per jingle batch, or any local box with a modest GPU (Mac, AMD, NVIDIA all supported).

⚠️ **License warning:** YuE/YuE2 (the other big open-source singer) is **CC-BY-NC — non-commercial**. Do NOT use it for client jingles. ACE-Step 1.5's MIT license is the clean one. Verify the license file in the repo before deploying.

**Path C — human producer (overflow).** Fiverr brief already written: `~/workspace/your_files/derivative-genius-jingle-producer-brief.md`. Shortlist: NoAnie Music (audio branding specialists), Bryan & Ryan (vocal + instrumental, commercial rights), Ron Halperin (clearest 15-sec package).

### 4. Mix
1. Align the vocal recording to the bed (clap or count-in at the top helps).
2. Level: vocal sits on top of the bed, bed at ~-6 dB under the vocal.
3. Light compression on the vocal, normalize final mix to -1 dBFS peak.
4. Export: WAV + 192k MP3, **vocal version and instrumental version**.

### 5. Deliverables & naming
```
{client-slug}-jingle-vocal.mp3 /.wav
{client-slug}-jingle-instrumental.mp3
```
Client gets both. Instrumental doubles as background music for their videos and ads.

### 6. Unit economics
- Bed: $0 (script).
- Path A vocal: $0. Path B vocal: ~pennies of GPU time. Path C vocal: ~$100–200.
- Client pays $500/mo. The jingle is a month-one deliverable that helps retention — the math works if the client stays 3+ months.

## Status board
- [x] Bed composer script (working, tested)
- [x] Producer brief + shortlist (Path C ready)
- [x] DG pilot jingle bed + guide (delivered 2026-10-07, awaiting Joe's vocal)
- [] Open-source singer (ACE-Step 1.5) — blocked on GPU
- [] First client jingle end-to-end
