# Master Meeting Plan: Local Content Marketing Partnership (9/21/2026)

> **Document Status:** Operational Blueprint & Execution Guide  
> **Meeting Date:** Monday, September 21, 2026  
> **Meeting Counterpart:** **Ted Yeatts**, Founder & Local Marketing Strategist  
> **Company:** **Local Content Marketing** ([`localcontentmarketing.com`](https://www.localcontentmarketing.com/))  
> **Headquarters:** 12820 Tar Flower Drive, Tampa, FL 33626  
> **Direct Contact:** 321-252-9197 · `Ted@LocalContentMarketing.com`  
> **Repositories Involved:**  
> 1. [`/home/knowself/dev/removiemcp/`](file:///home/knowself/dev/removiemcp/) (Removie Programmable Video Engine)  
> 2. [`/home/knowself/dev/globaldecisiongrid/`](file:///home/knowself/dev/globaldecisiongrid/) (Global Decision Grid & Local Opportunity Radar)  
> 3. [`/home/knowself/dev/dg-web/`](file:///home/knowself/dev/dg-web/) (Derivative Genius Agency Core & /centurion)  

---

## 1. Executive Intelligence Briefing: Ted Yeatts & Local Content Marketing

### 1.1 The Partner Profile
- **What Ted Does:** Ted runs a boutique agency/coaching practice in Tampa, Florida helping local service businesses "get found online and convert strangers into customers using AI & Local Content Marketing."
- **His Brand Positioning:** Anti-agency. He publicly criticizes traditional marketing companies that charge thousands for generic SEO and ineffective ads where only a fraction of spend goes to media.
- **Verified Client Portfolio:**
  - *George Mallers* (SparClean Florida - commercial cleaning, doubled business with Ted)
  - *Kortney Huff* (JAKO Insurance)
  - *Maria Garcia* (Arivale Logistics)
  - *Amy Colangelo* (Ocean Waters Spa - profits up 31%)
  - *Judit Narido* (Lazy Lemon Spa)
  - *Tom Goodlet* (Two Penny Consulting)
- **Why He Is Our Highest-Leverage Partner:**
  - Ted has the **clients, trust, and local relationships**, but as an agency founder, he faces severe fulfillment bottlenecks: producing video content is time-consuming, finding new high-ticket clients takes hours of manual prospecting, and static client websites don't convert calls into booked jobs.
  - **We are not selling *against* Ted; we are equipping Ted's agency with software infrastructure.**

---

## 2. The Tri-Repository Product Strategy for the Meeting

We will showcase a unified technology ecosystem where each repository solves one of Ted's core agency operational headaches:

```
+----------------------------------------------------------------------------------------------------+
|                                THE LCM PARTNER TECHNOLOGY STACK                                    |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ globaldecisiongrid ]           [ removiemcp ]                     [ dg-web /centurion ]         |
|  - Continuous Market Radar        - Programmatic Video Engine        - AI Digital Employee Agency  |
|  - Tampa commercial accounts      - LCM Brand Kit (#FF7A00)          - Conversion & Booking Flow   |
|  - Operational leak detection     - 9:16 Social Short for IG/TikTok  - Audit & Pipeline Tracking   |
|  - 1-click spear email hooks      - 16:9 Local Business Briefing     - High-ticket co-delivery     |
|                                                                                                    |
|  SOLVES: Finding Clients          SOLVES: Producing Content          SOLVES: Website Conversion    |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Repo-by-Repo Deliverables & 48-Hour Punch List

### 3.1 Repository 1: `removiemcp` (`/home/knowself/dev/removiemcp/`)
> **Goal:** Wow Ted by opening a browser and showing broadcast-grade videos generated in **his own brand styling** and featuring his phone number (`321-252-9197`).

* **Action Item 1: Register LCM Brand Kit**
  - **File:** `src/remotion/brand-kits/index.ts` and `src/remotion/brand-kits/lcm.ts`
  - **Palette:**
    - Primary: `#FF7A00` / `#FF6600` (Local Content Marketing Hummingbird Orange)
    - Background: `#0B0F19` (Dark Luxury Obsidian)
    - Surface: `#161F30` (Slate Blue Panel)
    - Accent: `#38BDF8` (Cyan Accent)
    - Text: `#F8FAFC` (Pure Light)
    - Logo: LCM Hummingbird Mark
    - Watermark / Footer: *"Call or Text 321-252-9197 · LocalContentMarketing.com"*
* **Action Item 2: Create Pre-Configured Demo Props**
  - **File:** `examples/lcm-tampa-briefing.json` (16:9 Decision Briefing on Tampa commercial cleaning / HVAC market)
  - **File:** `examples/lcm-tampa-reel.json` (9:16 Vertical Short for Instagram / TikTok local content)
* **Action Item 3: Pre-Render MP4 Assets**
  - Run `npm run removie -- render examples/lcm-tampa-reel.json`
  - Have local MP4 files ready to play in full resolution with zero buffering during screen share.
* **Action Item 4: Web Studio Prep**
  - Verify `http://localhost:3000/studio` loads smoothly with `@remotion/player` canvas for a live interactive demo.

---

### 3.2 Repository 2: `globaldecisiongrid` (`/home/knowself/dev/globaldecisiongrid/`)
> **Goal:** Show Ted a live decision intelligence terminal tracking real commercial accounts in his backyard (Tampa, St. Petersburg, Orlando) with actionable buying triggers.

* **Action Item 1: Seed 10 High-Fidelity Florida Accounts**
  - **File:** `src/data/universe.ts`
  - **Target Sectors:** Commercial Cleaning, HVAC, Roofing, Independent Insurance (Ted's exact client niches).
  - **Seeded Locations:** Tampa, Clearwater, St. Petersburg, Brandon, Orlando.
  - **Trigger Categories:**
    1. *Mobile Viewport Bug:* Phone click-to-call button blocked by overlapping header banner.
    2. *Hiring Growth + Operational Leak:* Business hiring 3 technicians on Indeed with no online intake system.
    3. *Review Latency:* 18-day average response lag on Google 1-star reviews.
  - **Trust Envelopes:** Freshness (<48h), 3+ verifiable sources (Google Maps, Indeed, Sunbiz Florida), 95% confidence score.
* **Action Item 2: Test 1-Click Spear Openers (`gdg spear`)**
  - Verify that clicking "Copy Spear Hook" or running `npm run gdg -- spear` generates an authentic, respectful outreach email referencing the exact observed bug.
* **Action Item 3: Apify Ingestion Pipeline Demonstration**
  - Document how Apify actors (`compass/crawler-google-places`) continuously refresh these Florida accounts for ~$0.50/1k records, demonstrating extreme unit economic advantage.

---

### 3.3 Repository 3: `dg-web` (`/home/knowself/dev/dg-web/`)
> **Goal:** Present the operator management platform and a frictionless commercial partnership agreement.

* **Action Item 1: Authenticated Walkthrough in `/centurion`**
  - Run through the disposable smoke test in `/centurion/campaigns`, `/centurion/prospects`, and `/centurion/pipeline` to ensure the system of record displays live metrics and audit tools without bugs.
* **Action Item 2: Co-Delivery AI Digital Employee Packaging**
  - Package Derivative Genius's core Next.js 16 AI features (conversational intake, semantic search, automated booking) as a white-label sprint ($1,500–$2,500) that Ted can upsell to his clients for $3,500–$5,000.
* **Action Item 3: Prepare the LCM Partnership Agreement Term Sheet**
  - Embedded directly into Section 6 of this document, ready to export as a clean proposal.

---

## 4. The Three Commercial Partnership Models to Pitch Ted

```
+----------------------------------------------------------------------------------------------------+
|                                    LCM COMMERCIAL PARTNERSHIP OPTIONS                              |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ OPTION A: RADAR WHOLESALE ]       [ OPTION B: REMOVIE ENGINE ]      [ OPTION C: FULL STACK ]    |
|  $750 / month                        $499 / month or credits           $1,500 upfront + $750/mo    |
|                                                                                                    |
|  - 50 weekly Florida leads           - White-label video generation    - Everything in A & B       |
|  - Operational leak detection        - 16:9 explainers + 9:16 reels    - Done-for-you co-delivery  |
|  - 1-click spear openers             - Zero video editing hours        - AI Digital Employee sites |
|  - 100% Meeting Guarantee            - LCM brand kit applied           - 50/50 sprint revenue split|
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### Option A: The Local Opportunity Radar License ($750/mo Retainer)
* **What Ted Gets:** Exclusive agency access to the Tampa Bay / Central Florida Opportunity Radar. 50 fresh, verified commercial accounts weekly with identified website bugs, hiring triggers, and ready-to-send spear openers.
* **The Risk Reversal:** **100% Qualified Meeting Guarantee:** If Ted’s team sends the hooks and doesn’t hold at least 2 qualified discovery meetings in the first 30 days, 100% of his retainer is refunded.
* **The Rollover Bonus:** 100% of fees paid roll over as platform credits toward any future software licensing.

### Option B: White-Label Removie Video Generation Engine ($499/mo or $1.00/render)
* **What Ted Gets:** Automated video content generation. Ted feeds a client's business name and monthly promotion into our form, and Removie generates a high-energy 9:16 vertical short (for Reels/TikTok) and a 16:9 local briefing with the client's logo, colors, and phone number in 30 seconds.
* **The Margin:** Ted charges his clients $250–$500/month for a "Weekly Video Content Pack" while his software cost is under $10/month.

### Option C: Co-Delivery AI Digital Employee Partnership ($1,500 pilot / 50% split)
* **What Ted Gets:** When a client’s website is outdated or leaking leads, Derivative Genius builds a custom Next.js 16 AI web application with 24/7 conversational booking and lead recovery. Ted sells it for $3,500–$5,000; our co-delivery wholesale sprint fee is $1,500–$2,000.

---

## 5. Minute-by-Minute 30-Minute Meeting Script & Screen Share Flow

### Minute 0–5: Rapport & Establishing the Mutual Enemy
- **Talk Track:**
  > *"Ted, I’ve been following your work at Local Content Marketing and love what you did with George at SparClean and Kortney at JAKO. What resonated with me is your anti-agency stance—cutting through the fluff of $5,000/month SEO retainers that don't produce booked jobs.  
  > Over at Derivative Genius, we come at this from the deep engineering side: building the AI infrastructure, continuous market crawlers, and automated video engines that make local content actually convert.  
  > We aren't here to sell you another coaching program or generic software. We want to show you working technology we built that can hand your agency qualified Florida clients on a silver platter and produce video content for them in seconds."*

### Minute 5–12: Demo 1 — Global Decision Grid (The Client Hunter)
- **Screen Share:** Open [`http://localhost:3000/verticals/local-opportunity-radar`](http://localhost:3000/verticals/local-opportunity-radar)
- **Action:** Filter by "Tampa Bay Area".
- **Talk Track:**
  > *"Most agencies waste 20 hours a week cold-calling random Google listings. Look at what our 5-stage refinery does.  
  > Here are 10 businesses in Tampa right now. Look at this commercial HVAC contractor: they posted 3 technician openings on Indeed this week, but when you pull up their site on an iPhone, their phone number is trapped under a broken CSS header. Customers can't call them.  
  > We don't send a 20-page audit they'll ignore. We click 'Copy Spear Hook'—and in one click, your SDR has a 3-sentence, respectful email pointing out the exact bug. That is how you get a 30% reply rate."*

### Minute 12–20: Demo 2 — Removie Video Platform (The Content Scaler)
- **Screen Share:** Open [`http://localhost:3000/studio`](http://localhost:3000/studio) in `removiemcp`
- **Action:** Switch to the "Local Content Marketing" brand kit. Play the 9:16 vertical short and 16:9 Decision Briefing.
- **Talk Track:**
  > *"Every local business owner knows they need video for Instagram, TikTok, and YouTube, but hiring an animator or editing clips costs $1,000 per video.  
  > We built Removie: programmable video as code using Remotion and React 19.  
  > Notice the hummingbird orange branding and your phone number in the lower third. We can pipe in any local market data, review milestones, or audit findings, and it outputs a broadcast-grade video in under 30 seconds. You can offer full-service video marketing to all your clients without hiring a single video editor."*

### Minute 20–25: Commercial Proposal & The Guarantee
- **Talk Track:**
  > *"Ted, we are launching our Founding Agency Design Partner Cohort. We are taking exactly 5 boutique agency partners in non-competing regions.  
  > We want Local Content Marketing as our exclusive Florida partner. For $750/month, you get 50 weekly verified commercial leads in Tampa/Orlando with ready-to-send hooks, plus white-label video generation.  
  > And we take all the risk: if you don’t hold at least 2 qualified discovery calls from our signals in your first 30 days, we wire back 100% of your money. And every dollar you pay rolls over into software usage credits."*

### Minute 25–30: Next Steps & Closing
- **Talk Track:**
  > *"What are the top three trade verticals you want to dominate in Florida first? Let's calibrate the radar to those exact zip codes, and I'll send over your first batch of 25 accounts by Wednesday."*

---

## 6. The 1-Page Founding Agency Partner Term Sheet (LCM Edition)

```text
================================================================================
           FOUNDING AGENCY PARTNER AGREEMENT: TERM SHEET
================================================================================
PARTIES:
  Provider: Derivative Genius (derivativegenius.com)
  Partner:  Local Content Marketing / Ted Yeatts (localcontentmarketing.com)
  Effective Date: September 21, 2026

1. SCOPE OF SERVICES & DELIVERABLES:
   - Territory Exclusivity: Tampa Bay & Central Florida Local Trade Radar.
   - Weekly Intelligence Feed: Minimum 50 verified commercial business accounts
     per week exhibiting high-confidence buying triggers (operational leaks,
     mobile viewport errors, hiring growth).
   - Pre-Composed Outreach Hooks: 1-click personalized spear openers for all leads.
   - Removie Video Platform Access: White-label video generation license for
     creating 9:16 vertical reels and 16:9 decision briefings for LCM clients.
   - Agency Support: Dedicated technical integration and priority feature requests.

2. COMMERCIAL TERMS:
   - Monthly Retainer: $750.00 USD / month (billed every 30 days).
   - Commitment: Month-to-month, cancelable at any time with 7 days' notice.

3. CONVERSION SAFEGUARDS & GUARANTEES:
   - 100% Qualified Meeting Guarantee: If Partner utilizes the provided signal hooks
     and does not conduct at least two (2) qualified commercial discovery meetings
     within thirty (30) days of launch, Provider will issue a full 100% refund.
   - 100% Fee Rollover: 100% of retainer fees paid may be rolled over as usage
     credits toward future annual software subscriptions or API render packages.

4. CO-DELIVERY AI DIGITAL EMPLOYEE PROJECTS (OPTIONAL ADD-ON):
   - For Partner clients requiring full custom web builds: Provider will deliver
     Next.js 16 AI-native digital employee websites with automated booking at a
     wholesale rate of $1,500–$2,000 per project (MSRP: $3,500–$5,000).

ACCEPTED & AGREED:
For Derivative Genius: _______________________ Date: _________________
For Local Content Marketing: ________________ Date: _________________
================================================================================
```

---

## 7. Immediate Execution Checklist (Sunday, September 20)

- [ ] **10:00 AM:** Implement LCM Brand Kit in `removiemcp/src/remotion/brand-kits/lcm.ts`
- [ ] **12:00 PM:** Render 9:16 and 16:9 video samples in `removiemcp` with LCM branding.
- [ ] **02:00 PM:** Seed 10 Tampa/Orlando accounts into `globaldecisiongrid/src/data/universe.ts`.
- [ ] **04:00 PM:** Run `gdg spear` to verify outreach hooks generate clean Tampa-specific text.
- [ ] **06:00 PM:** Conduct dry-run screen share test across all 3 ports (GDG :3000, Removie Studio, Centurion).
- [ ] **08:00 PM:** Review and finalize presentation notes.
