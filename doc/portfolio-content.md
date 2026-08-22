# Centurions Portfolio Content & Target Vertical Blueprint

> **Derivative Genius** — AI-First Web Development Agency  
> **Document:** Portfolio Vertical Strategy & Detail Page Architecture  
> **Path:** `doc/portfolio-content.md`  
> **Last Updated:** August 21, 2026  

---

## 1. Strategic Purpose of the Portfolio

The Centurions Portfolio is not merely a gallery of past web design projects. It serves as a **strategic showcase of adaptable application models** built by **Derivative Genius**. 

Each portfolio entry demonstrates a specific operational pattern—ranging from real-time technical status command centers to on-demand mobile service booking engines. By analyzing these models, prospective clients across diverse industries can visualize how Derivative Genius can eliminate operational friction, build instant trust, and automate customer acquisition for their own businesses.

---

## 2. Portfolio Model Matrix & Target Audiences

| Portfolio Project | Primary Operational Purpose | Core Target Vertical | Broader Derivative Genius Audience |
| :--- | :--- | :--- | :--- |
| **Space Janitor** | Technical Operations & System Telemetry NOC Dashboard | DevOps & Infrastructure | SaaS platforms, MSPs, Cybersecurity SOCs, Industrial IoT, Logistics cold-chain telemetry |
| **Kerry Terry** | Executive Branding, Advisory & Thought Leadership Engine | C-Suite Personal Brand | Venture capitalists, Startup founders, Keynote speakers, Fractional CTOs/CMOs, High-ticket consultants |
| **MicrogreensLA** | Hyper-Local Direct-to-Consumer E-Commerce & Subscriptions | Urban Agriculture | Specialty food/beverage subscriptions, Organic skincare, Artisanal goods, Local CSA delivery networks |
| **Mobile Tire Man** | On-Demand Mobile Field Service Booking & Dispatch | Mobile Automotive Care | Mobile mechanics, Auto detailing, Locksmiths, Mobile pet grooming, Mobile IV/healthcare dispatch, Field maintenance |

---

## 3. Deep-Dive Member Profiles & Detail Page Specifications

### 3.1 Space Janitor — Technical Operations & Telemetry Command Center

* **Live URL:** `https://www.spacejanitor.pro/`
* **Primary Purpose:** Provide mission-critical operational transparency, real-time status tracking, and incident logging for complex software systems and infrastructure.
* **Core Capabilities:**
  * Real-time component status indicators and incident disclosure workflow.
  * Service Level Agreement (SLA) uptime metrics and historical reporting.
  * Integrated developer documentation hub and public API health endpoints.
  * High-contrast NOC dark-mode theme optimized for 24/7 monitoring.
* **Broader Derivative Genius Target Audience:**
  1. **SaaS & Cloud Platforms:** Public uptime dashboards and status disclosure portals.
  2. **Managed IT & Security (MSPs/SOCs):** Client security alert portals and SLA tracking dashboards.
  3. **Industrial IoT & Automation:** Smart facility sensor telemetry, equipment status, and preventive alert dispatch.
  4. **Logistics & Supply Chain:** Warehouse automation tracking, cold-chain temperature monitoring, and fleet health dashboards.

---

### 3.2 Kerry Terry — Executive Branding & Advisory Engine

* **Live URL:** `https://www.kerryterry.com/`
* **Primary Purpose:** Project executive authority, present high-impact case studies, and convert high-ticket advisory or consultation opportunities.
* **Core Capabilities:**
  * Interactive case study showcases with quantitative impact metrics.
  * Frictionless consultation scheduling and downloadable press/media kits.
  * Publication highlight grid for articles, podcasts, keynotes, and media appearances.
  * Ultra-sleek minimalist typography and fast-loading media elements.
* **Broader Derivative Genius Target Audience:**
  1. **Founders & Venture Executives:** Personal investor relations hubs, deal flow portals, and board candidate bios.
  2. **Fractional Executives & Advisors:** Fractional CTO/CMO/CFO retainer lead capture and client testimonial showcases.
  3. **Creative Directors & Architects:** Architectural project galleries, design agency portfolios, and award showcases.
  4. **Authors, Speakers & Researchers:** Keynote booking platforms, book launch engines, and newsletter growth pages.

---

### 3.3 MicrogreensLA — Direct-to-Consumer & Local Subscription Platform

* **Live URL:** `https://www.microgreensla.live/`
* **Primary Purpose:** Capture recurring local subscriptions, manage weekly harvest availability countdowns, and streamline direct-to-consumer fulfillment.
* **Core Capabilities:**
  * Recurring subscription ordering engine with flexible delivery frequency choices.
  * Harvest calendar countdowns and weekly stock availability badges.
  * ZIP code radius delivery checker for hyper-local fulfillment validation.
  * Nutritional transparency cards and product pairing guides.
* **Broader Derivative Genius Target Audience:**
  1. **Artisanal Agriculture & Hydroponics:** Specialty mushroom farms, honey purveyors, and local farm CSAs.
  2. **D2C Food & Beverage Subscriptions:** Craft coffee roasters, kombucha subscriptions, and chef-curated meal prep delivery.
  3. **Organic Skincare & Wellness:** Small-batch botanical remedies, farm-sourced skincare, and essential oil clubs.
  4. **Boutique Local Goods:** Weekly floral bouquet subscriptions, hand-poured candle clubs, and artisan bakeries.

---

### 3.4 Mobile Tire Man — On-Demand Mobile Service & Field Dispatch Platform

* **Live URL:** `https://mobiletireman.vercel.app/`
* **Primary Purpose:** Eliminate waiting rooms by connecting vehicle owners directly with mobile service technicians for driveway and workplace auto care.
* **Core Capabilities:**
  * Frictionless mobile service intake request form with instant vehicle/location validation.
  * Transparent pre-quote estimate confirmation and deposit policy communication.
  * Clear service scope definition separating driveway-friendly jobs from shop-only repairs.
  * Mobile-first responsive layout optimized for schedule-ahead and urgent service requests.
* **Broader Derivative Genius Target Audience:**
  1. **Automotive & Fleet Services:** Mobile auto detailing, windshield replacement, mobile EV charging, and fleet maintenance.
  2. **On-Demand Home Services:** Mobile pet grooming, appliance repair, locksmith dispatch, and solar panel cleaning.
  3. **Mobile Healthcare & Concierge Diagnostics:** In-home phlebotomy, mobile IV therapy, concierge vet visits, and mobile ultrasound.
  4. **Commercial Field Maintenance:** HVAC filter replacement dispatch, commercial printer repair, and facility inspection units.

---

## 4. Implementation Guidelines for Portfolio Detail Pages

All portfolio data is maintained centrally in [`src/data/portfolio.ts`](file:///home/knowself/webdev/dg-web/src/data/portfolio.ts) under the `CENTURIONS_PROJECTS` array.

Each project detail view ([`src/app/portfolio/[id]/page.tsx`](file:///home/knowself/webdev/dg-web/src/app/portfolio/%5Bid%5D/page.tsx)) dynamically renders:
1. **Hero Header**: Title, description tags, and live application link.
2. **Preview Visual**: Responsive image / fallback vector preview.
3. **Strategic Purpose & Synopsis**: Executive overview of why the platform exists and its primary target audience.
4. **Core Capabilities Grid**: Bullet points of key technical and conversion features.
5. **Potential Business Applications**: 4 dedicated cards detailing concrete industry adaptation use cases.
6. **Architecture Consultation CTA**: Call-to-action inviting prospective clients to build a similar platform tailored to their business.

---

## 5. Standard Operating Procedure for New Portfolio Entries

When adding future portfolio entries to Derivative Genius:
1. Append a new project object to `CENTURIONS_PROJECTS` in `src/data/portfolio.ts`.
2. Provide a complete `synopsis` object adhering to the `ProjectSynopsis` interface.
3. Add a placeholder vector graphic (`public/images/portfolio/{id}.svg`) or high-resolution screenshot (`public/images/portfolio/{id}.png`).
4. Update `doc/portfolio-content.md` with the new target vertical matrix mapping.
