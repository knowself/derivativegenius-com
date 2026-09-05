import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Quote, Phone } from "lucide-react";

export const metadata = {
  title: "Local Internet Presence — Free Book for Local Owners | Derivative Genius",
  description:
    "The Mike Stewart playbook retold for local business owners: 5 pillars, SERP-term jingles, YouTube pre-roll arbitrage, and high-converting video pages.",
};

const toc = [
  { href: "#promise", label: "The promise" },
  { href: "#intro", label: "Introduction · Who is Mike" },
  { href: "#ch-1", label: "1 · The philosophy" },
  { href: "#ch-2", label: "2 · The 5 pillars" },
  { href: "#ch-3", label: "3 · The jingle that sticks" },
  { href: "#ch-4", label: "4 · The YouTube loophole" },
  { href: "#ch-5", label: "5 · The page that rings" },
  { href: "#ch-6", label: "6 · Two traps to avoid" },
  { href: "#ch-7", label: "7 · Proof from real towns" },
  { href: "#ch-8", label: "8 · Your next step" },
  { href: "#ch-9", label: "9 · How content gets made" },
  { href: "#ch-10", label: "10 · The AI factory" },
  { href: "#audit", label: "Appendix · 5-minute self-audit" },
  { href: "#glossary", label: "Appendix · Plain-English glossary" },
];

const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Local Internet Presence: How Local Businesses Get Found, Remembered, and Called",
  author: { "@type": "Person", name: "Mike Stewart playbook, retold for owners" },
  about: ["Local SEO", "Google Business Profile", "Video Sales Letter", "YouTube Ads", "Lead generation"],
};

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">{children}</p>
  );
}

function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl sm:p-10 space-y-4"
    >
      {children}
    </section>
  );
}

function LessonBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm leading-relaxed text-slate-200">
      {children}
    </div>
  );
}

function TrapBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-slate-200">
      {children}
    </div>
  );
}

function ProofBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-relaxed text-slate-200">
      {children}
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }} />

      <div className="mx-auto max-w-4xl rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-center text-sm leading-relaxed text-amber-200">
        <strong className="font-semibold">Draft for review with Mike Stewart — not for distribution.</strong>
        <span className="mt-0.5 block text-xs text-amber-200/80">Living document v0.2 · Full text shared here for discussion prior to any KDP expansion.</span>
      </div>

      {/* Cover */}
      <div className="mx-auto max-w-4xl text-center space-y-5">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Free book · Living doc v0.2 · For local owners</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Local Internet Presence: How Local Businesses Get Found, Remembered, and Called
        </h1>
        <p className="text-lg text-slate-300">
          The Mike Stewart playbook — 35 years of direct response, retold in plain English. No jargon. Just phone calls.
        </p>
        <p className="text-xs text-slate-500">
          Source: <em>Lessons of Local Internet Presence</em> · <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-700 underline-offset-4 transition hover:text-emerald-400">LocalInternetPresence.com</a> · Nashville, TN · Last updated 2026-09-05
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#promise"
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
          >
            <span>Start reading — 60 seconds</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#audit"
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            <span>Run the 5-minute self-audit</span>
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Phone className="h-4 w-4" />
            <span>Request a Free Website Audit</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* TOC */}
        <nav aria-label="Table of contents" className="lg:sticky lg:top-24 h-fit rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Contents</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {toc.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-slate-300 underline decoration-slate-700 decoration-dotted underline-offset-4 transition hover:text-emerald-400">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-500 leading-relaxed">
            Pre-sell for the audit: read the promise + Ch. 5, then run the audit below.
          </div>
        </nav>

        {/* Book body */}
        <main className="space-y-6 text-slate-300 leading-relaxed min-w-0">
          <Section id="promise">
            <Kicker>Start here · 60 seconds</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">If they can&apos;t find you, remember you, and call you in seconds — you don&apos;t have a presence.</h2>
            <p>Mike Stewart simplifies the whole internet to two jobs:</p>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li><strong className="text-white">Traffic:</strong> get qualified locals to find you on the device they actually use — <strong className="text-white">over 90% are on mobile phones</strong> for home services.</li>
              <li><strong className="text-white">Conversion:</strong> within <strong className="text-white">3 seconds</strong> of landing, convince them you&apos;re the trustworthy local fix for their urgent problem. If not, they bounce.</li>
            </ol>
            <LessonBox>
              <strong className="text-white">Owner takeaway:</strong> You don&apos;t need &ldquo;brand awareness.&rdquo; You need found, remembered, called. Everything in this book serves those three.
            </LessonBox>
            <p className="text-sm">Traffic comes from only three places: <strong className="text-white">paid</strong> (Google / YouTube — fastest), <strong className="text-white">organic</strong> (reviews, map, content — compounds), <strong className="text-white">borrowed</strong> (partners, networking — trust).</p>
          </Section>

          <Section id="intro">
            <Kicker>Introduction · Who this is and what this is</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Who is Mike Stewart — and what is <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-500/40 underline-offset-4 transition hover:text-emerald-300">LocalInternetPresence.com</a>?</h2>
            <h3 className="text-lg font-bold text-white">Who is Mike Stewart</h3>
            <p className="text-sm">Mike Stewart is a 35-year veteran of radio, television, music production, audio engineering, and direct marketing, based in Nashville, Tennessee. Former member of <em>The Box Tops</em>, co-producer of <em>Pac-Man Fever</em>, producer of every Waffle House jukebox record (Golden Waffle for &ldquo;Raisin Toast&rdquo;) — and one of the original pioneers of internet multimedia.</p>
            <p className="text-sm">Over 20 years ago, with copywriter Jim Edwards and direct-response legend Dan Kennedy, Mike <strong className="text-white">co-invented the Video Sales Letter (VSL)</strong> when Flash video arrived — proving plain human video with direct-response psychology beats million-dollar agency websites.</p>
            <h3 className="text-lg font-bold text-white">What is <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-500/40 underline-offset-4 transition hover:text-emerald-300">LocalInternetPresence.com</a></h3>
            <p className="text-sm">His company, <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 transition hover:text-emerald-300">LocalInternetPresence.com</a>, is not a &ldquo;brand awareness&rdquo; agency. It is a done-for-you local presence system for service businesses — plumbers, HVAC, roofers, pest control, boat rentals, shops — built on <strong className="text-white">high-intent lead capture, earworms you can&apos;t forget, and zero-friction funnels</strong>.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LessonBox><strong className="text-white">What it does:</strong> Google profile + map, your-domain content that AI quotes, one-problem video pages, 15-sec jingle + YouTube pre-rolls, in-person audits. You talk 3 minutes; it does the rest.</LessonBox>
              <LessonBox><strong className="text-white">How you buy it:</strong> flat monthly retainer (~$300 core, ~$500 with ads managed + ad spend), no $2,000 studio bill, no writing, no dashboards. You reply YES to 4 topics a month.</LessonBox>
            </div>
            <blockquote className="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-sm italic text-slate-200">
              &ldquo;Rather than posting a lot of jargon on this website that means nothing to most business owners… To GROW your business today, you must have a local internet presence. What I do for businesses, no one else is doing.&rdquo;
            </blockquote>
          </Section>

          <Section id="ch-1">
            <Kicker>Chapter 1 · The creed</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The philosophy: leads, not laurels</h2>
            <p className="text-sm">Conventional agencies sell vanity: pretty sliders, vague slogans, random social posts. Mike sells <strong className="text-white">high-intent lead capture, earworms people can&apos;t forget, and funnels with zero friction</strong> — built for plumbers, HVAC, roofers, pest control, rentals, and shops.</p>
            <blockquote className="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-sm italic text-slate-200">
              &ldquo;Rather than posting a lot of jargon on this website that means nothing to most business owners… To GROW your business today, you must have a local internet presence. What I do for businesses, no one else is doing.&rdquo;
            </blockquote>
          </Section>

          <Section id="ch-2">
            <Kicker>Chapter 2 · The map</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The 5 pillars of local dominance</h2>
            <p className="text-sm">Think of these as five legs on one stool. Miss one and you wobble.</p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="border-b border-slate-800 p-3">Pillar</th>
                    <th className="border-b border-slate-800 p-3">What you do</th>
                    <th className="border-b border-slate-800 p-3">Why it pays</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr><td className="border-b border-slate-800 p-3 font-semibold text-white">1 · Map &amp; reviews</td><td className="border-b border-slate-800 p-3">Claim Google Business Profile, fix name/address/phone, ask every happy customer for 5 stars, reply to all, post real job photos</td><td className="border-b border-slate-800 p-3">Most valuable asset you own; activity signals push you into the Map Pack</td></tr>
                  <tr><td className="border-b border-slate-800 p-3 font-semibold text-white">2 · Your website + word-spreading</td><td className="border-b border-slate-800 p-3">Publish answers on <em>your</em> domain, with transcripts; share audio to Apple/Spotify/YouTube</td><td className="border-b border-slate-800 p-3">Ranks on Google and gets quoted by AI answers; social-only posts don&apos;t</td></tr>
                  <tr><td className="border-b border-slate-800 p-3 font-semibold text-white">3 · Page + ads that match</td><td className="border-b border-slate-800 p-3">One problem = one page with video + reviews + tap-to-call; ads say the pain + &ldquo;Watch my video&rdquo;</td><td className="border-b border-slate-800 p-3">Paid clicks stop leaking; calls quadruple</td></tr>
                  <tr><td className="border-b border-slate-800 p-3 font-semibold text-white">4 · Jingle + YouTube</td><td className="border-b border-slate-800 p-3">15-second search-term song, front-loaded into skippable pre-rolls</td><td className="border-b border-slate-800 p-3">Millions hear you; Google often charges $0</td></tr>
                  <tr><td className="p-3 font-semibold text-white">5 · Handshakes</td><td className="p-3">Show up (BNI, chamber), run a 20-minute audit 1-on-1</td><td className="p-3">Owners buy from people who show the flaw, not pitch decks</td></tr>
                </tbody>
              </table>
            </div>
            <LessonBox><strong className="text-white">Pillar 1 is first for a reason:</strong> if your reviews are thin, your hours wrong, and your photos stale, ads just send people to distrust you faster.</LessonBox>
          </Section>

          <Section id="ch-3">
            <Kicker>Chapter 3 · Weapon A</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The jingle that sticks in their head</h2>
            <p className="text-sm">Every business has a 2–4 word phrase that puts them #1 — e.g. <em>&ldquo;Nashville Party Boat Rental,&rdquo; &ldquo;Pink Plumber,&rdquo; &ldquo;Mount Lawley Pest Control.&rdquo;</em> Problem: locals don&apos;t know to type it. Solution: plant it with melody.</p>
            <h3 className="text-lg font-bold text-white">The 21-time rule</h3>
            <blockquote className="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-sm italic text-slate-200">
              &ldquo;When you hear marketing information set to melody 20 times, on the 21st time you will never get it out of your subconscious for the rest of your life.&rdquo;
            </blockquote>
            <p className="text-sm">Proof: 30 years ago in Smyrna, Georgia, <em>The Pink Plumber</em> ran: <strong className="text-white">&ldquo;Google Pink, click the link, or call 404-222-PINK.&rdquo;</strong> Listeners still recite it decades later. Same mechanism as <em>800-588-2300 Empire Today</em>.</p>
            <h3 className="text-lg font-bold text-white">The 15-second recipe</h3>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li><strong className="text-white">0–5s · The anchor:</strong> sing the exact search term + who you are. Must land before &ldquo;Skip&rdquo; appears.</li>
              <li><strong className="text-white">5–12s · The benefit:</strong> plain-spoken promise in owner voice.</li>
              <li><strong className="text-white">12–15s · The nudge:</strong> &ldquo;Search [term] today!&rdquo; or phone.</li>
            </ol>
            <TrapBox><strong className="text-white">Golden rule — don&apos;t &ldquo;help&rdquo; with lyrics.</strong> Owners love slogans and rhymes that kill the earworm. Mike&apos;s line: <em>&ldquo;We write the lyrics, we pick the music, we follow the formula. If you don&apos;t like the free AI version, we&apos;ll do a $2,000 studio version however you want.&rdquo;</em> Nobody ever pays the $2,000.</TrapBox>
          </Section>

          <Section id="ch-4">
            <Kicker>Chapter 4 · Weapon B</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The YouTube loophole (legal, built into Google&apos;s billing)</h2>
            <p className="text-sm">Over half of local YouTube now plays on <strong className="text-white">living-room Smart TVs</strong>. Skippable ads force 5 seconds of watching — and Google <strong className="text-white">charges $0 if they skip before 30 seconds</strong>.</p>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/80 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="border-b border-slate-800 p-3">0–5s (mandatory, free)</th>
                    <th className="border-b border-slate-800 p-3">6–30s (skippable)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3">Jingle starts instantly. Brand + search term sung. 100% hear it.</td><td className="p-3">Problem, proof, offer. Pay only if watched to 30s or clicked.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm"><strong className="text-white">The living-room effect:</strong> kids watching <em>Bluey</em>, remote on the coffee table — nobody dives to skip. Even at 70–80% skip rates, everyone heard you.</p>
            <ProofBox><strong className="text-white">Abilene, Texas pest control:</strong> 8 million skips (free saturation) + 3 million full views on ~$200–$400/mo ad spend. Revenue tripled and quadrupled. Families hummed it daily.</ProofBox>
            <h3 className="text-lg font-bold text-white">Targeting: geography beats guesswork</h3>
            <p className="text-sm">Don&apos;t micro-filter age, interests, parental status. Draw a tight <strong className="text-white">15–20 mile radius / zip cluster</strong> and let Google&apos;s machine find buyers.</p>
          </Section>

          <Section id="ch-5">
            <Kicker>Chapter 5 · Weapon C</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The page that rings: one problem, one video, one button</h2>
            <p className="text-sm">Mike&apos;s founding discovery: <strong className="text-white">&ldquo;People will watch before they read.&rdquo;</strong> Replace bloated 20-page sites with one focused Video Sales Letter per urgent problem.</p>
            <h3 className="text-lg font-bold text-white">The 5-part page</h3>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li><strong className="text-white">Headline with risk reversal</strong> — see formula below</li>
              <li><strong className="text-white">45–60 sec video + jingle</strong> — solve the exact search, human face</li>
              <li><strong className="text-white">Proof strip</strong> — Google 5-stars / badges right under video</li>
              <li><strong className="text-white">Plain-spoken copy</strong> — agitate the pain, answer FAQs</li>
              <li><strong className="text-white">Sticky tap-to-call</strong> — always in the mobile thumb zone</li>
            </ol>
            <h3 className="text-lg font-bold text-white">The headline that has worked 15 years</h3>
            <blockquote className="border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-sm italic text-slate-200">
              &ldquo;We will give you the most thorough, amazing, unbelievable [service] guaranteed or it&apos;s free.&rdquo;
            </blockquote>
            <p className="text-sm">HVAC: <em>&ldquo;We will make your house ice cold or it&apos;s free.&rdquo;</em> Plumbing: <em>&ldquo;We will fix your leaky toilet today guaranteed or it&apos;s free.&rdquo;</em> Roofing: <em>&ldquo;Your roof will not leak, guaranteed or it&apos;s free.&rdquo;</em> Anxious homeowners just want safety. Almost nobody claims — they just call.</p>
            <h3 className="text-lg font-bold text-white">Ads that feed it: Problem → Agitate → &ldquo;Watch my video&rdquo;</h3>
            <p className="text-sm">Dan Kennedy style: <em>&ldquo;Tired of termites? Scared they&apos;re eating your home? Want them gone today? Watch my video.&rdquo;</em> Adding <strong className="text-white">&ldquo;Watch my video&rdquo;</strong> quadrupled click-through — it promises clarity, not homework.</p>
          </Section>

          <Section id="ch-6">
            <Kicker>Chapter 6 · Save your money</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Two traps that eat local budgets</h2>
            <TrapBox><strong className="text-white">Trap 1 · The award-winning website.</strong> Giant sliders, stock video, clever slogans (&ldquo;Excellence in Every Pipe&rdquo;) push your number below the fold. Result: ~90% bounce in 10 seconds. An award is often a <em>negative</em> indicator of calls. And never hide &ldquo;call&rdquo; behind a hamburger menu.</TrapBox>
            <TrapBox><strong className="text-white">Trap 2 · The social-media walled garden.</strong> Dopamine scrolling isn&apos;t emergency intent — nobody with a burst pipe opens Instagram. Worse, Facebook/Instagram hide posts from Google and AI crawlers. Posts on <em>your</em> domain compound for years; social posts evaporate.</TrapBox>
          </Section>

          <Section id="ch-7">
            <Kicker>Chapter 7 · It works in real towns</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Proof, not promises</h2>
            <div className="space-y-4">
              <ProofBox><strong className="text-white">West Texas Pest Patrol — Abilene, TX.</strong> 15-sec jingle + geo-only pre-rolls. 8M skips + 3M views. Revenue 3–4x. Kids&apos; TV did the selling.</ProofBox>
              <ProofBox><strong className="text-white">Nashville Party Boat — Nashville, TN.</strong> Season wiped out in May. Exact-match domain + 1-page VSL (&ldquo;Book Your Boat&rdquo;) + jingle + $250/mo ads. $0 → $80,000 first summer, 40 charters, sold-out weekends, #1 Map Pack.</ProofBox>
              <ProofBox><strong className="text-white">Local Nashville Honey — Nashville, TN.</strong> No shipping, just booth traffic. Local content + jingle. #1 for &ldquo;local honey near me,&rdquo; biggest months ever, $0 ad spend.</ProofBox>
              <ProofBox><strong className="text-white">Mount Lawley Pest Control — Perth, Australia (Glenn Mott, solo operator).</strong> 5-year goal: $500k/yr. Deployed problem-specific video pages + SERP jingle + Dan Kennedy agitation ads. Hit the goal in <strong className="text-white">year 2</strong> — 3 years early.</ProofBox>
              <ProofBox><strong className="text-white">Haynes Pest Control — Avon Park, FL.</strong> Full VSL + jingle + skippable pre-rolls (50% on living-room TVs). <strong className="text-white">+23% (+$172,500) in 7 months</strong>, +7 hires in 2025, 1M+ video views.</ProofBox>
              <ProofBox><strong className="text-white">Ted Yates — Tampa, FL (agency proof).</strong> No audio/coding background. After <strong className="text-white">two 1-hour Zooms</strong>, launched a full-time retainer practice purely via BNI/chamber 1-on-1 audits — signing monthly clients and hosting podcasts for local groups. Proves the playbook transfers.</ProofBox>
            </div>
          </Section>

          <Section id="ch-8">
            <Kicker>Chapter 8 · What to do Monday</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Your next step: a 20-minute audit</h2>
            <p className="text-sm">Small owners &ldquo;don&apos;t know what they don&apos;t know&rdquo; — and get spammed by faceless agencies. The fix is a short, in-person diagnostic:</p>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li>Google your money term — are you in the Map Pack?</li>
              <li>Open your site on your phone — can you call in one tap without scrolling or menus?</li>
              <li>Count reviews — under 20, unanswered 1-stars, no owner replies?</li>
              <li>Search your blog — zero indexed answers on your own domain?</li>
            </ol>
            <div className="rounded-xl bg-emerald-600 p-5 text-sm font-medium text-white">
              If you failed 2 or more: get the audit. Bring one problem (&ldquo;termites,&rdquo; &ldquo;leaky roof,&rdquo; &ldquo;slow season&rdquo;). Leave with one page, one video outline, and one jingle lyric to test.{" "}
              <a href="#audit" className="font-bold underline underline-offset-4">Run the 5-minute self-audit ↓</a>
            </div>
          </Section>

          <Section id="ch-9">
            <Kicker>Chapter 9 · Weapon D</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">How content gets made (without you writing)</h2>
            <p className="text-sm"><em>&ldquo;It&apos;s a shorter distance from your brain to your tongue than to your hands.&rdquo;</em> Owners freeze at keyboards but can&apos;t stop talking when asked the right technical question. So never start with &ldquo;write a blog.&rdquo; Start with talk, then transcribe.</p>
            <h3 className="text-lg font-bold text-white">The 5-step extraction</h3>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li><strong className="text-white">Name 50 problems you solve.</strong> Not &ldquo;we kill bugs&rdquo; — list them: subterranean termites, drywood termites, bedbugs, German roaches, brown recluse, roof rats…</li>
              <li><strong className="text-white">Pick one diagnostic question:</strong> <em>&ldquo;What are subterranean termites, and why are they dangerous to a foundation?&rdquo;</em></li>
              <li><strong className="text-white">Record 3 minutes.</strong> Phone voice memo is fine — explain it like to a neighbor.</li>
              <li><strong className="text-white">Transcribe to your domain.</strong> Full text = blog post + FAQ schema. Audio stays embedded.</li>
              <li><strong className="text-white">Syndicate the audio.</strong> One RSS feed → Apple, Spotify, Amazon, YouTube = free authoritative backlinks.</li>
            </ol>
            <LessonBox><strong className="text-white">50-problems worksheet (15 min):</strong> draw 5 columns × 10 rows. Columns: Pests / Complaints / Seasons / Prices asked / Jobs you love. Fill 50 cells. Circle the 4 most-asked — that&apos;s this month&apos;s content.</LessonBox>
            <LessonBox><strong className="text-white">Recorder checklist:</strong> quiet truck/office · phone 6 inches away · 3 min max · state name + town + problem first · end with &ldquo;Search [SERP term] or tap to call.&rdquo;</LessonBox>
            <LessonBox><strong className="text-white">Transcript template:</strong> Title = customer question (&ldquo;How much… in [Town]?&rdquo;) · 150-word answer · 3 bullets · FAQ (3 Qs) · Call box. Publish weekly — compounds in Google + AI answers.</LessonBox>
          </Section>

          <Section id="ch-10">
            <Kicker>Chapter 10 · Owner terms</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">The AI factory: you approve, we produce</h2>
            <p className="text-sm">What used to cost $2,000+ in studio time now runs monthly: scripts drafted for your town, voiced in your cloned voice incl. Spanish, 15-sec jingle, published + syndicated with full transcripts. Core ~$300/mo, full growth with ads management ~$500/mo + ad spend. Your heavy lifting: reply YES.</p>
            <h3 className="text-lg font-bold text-white">SMS approval flow</h3>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li><strong className="text-white">1st of month:</strong> you get text with 4 topics (&ldquo;Reply YES to approve&rdquo;).</li>
              <li><strong className="text-white">You reply YES.</strong> We draft, voice, mix jingle intro/outro.</li>
              <li><strong className="text-white">Weekly:</strong> 1 post + episode goes live on your site, then Apple/Spotify/YouTube.</li>
              <li><strong className="text-white">End of month:</strong> 5-min Zoom: calls, rankings, next 4 topics.</li>
            </ol>
            <LessonBox><strong className="text-white">Sample month:</strong> Wk1 Donelson weeds + jingle refresh · Wk2 slab-leak cost FAQ · Wk3 termite swarm explainer (Spanish dub) · Wk4 &ldquo;ice-cold or it&apos;s free&rdquo; offer page. Each = blog + podcast + review push + GBP photo.</LessonBox>
            <TrapBox><strong className="text-white">What you never do:</strong> write, edit audio, log into dashboards, pick music. If you want custom studio lyrics, that&apos;s the $2,000 option — nobody takes it because the free AI version rings the phone.</TrapBox>
          </Section>

          <Section id="audit">
            <Kicker>Appendix A · Tear-out</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">5-minute self-audit</h2>
            <ol className="list-decimal space-y-2 pl-6 text-sm">
              <li>Does your Google Ad (or search result) go to your homepage instead of one problem page?</li>
              <li>On mobile, is there a sticky tap-to-call button with no menu hunting?</li>
              <li>Does your hero waste the screen on sliders while hiding reviews + phone?</li>
              <li>GBP: &lt;20 reviews, unanswered 1-stars, zero owner replies, no fresh photos?</li>
              <li>All content trapped on Facebook/Instagram, zero articles/podcasts on your domain?</li>
            </ol>
            <p className="text-sm">Score: 0 fails = defend the lead · 1–2 = fix this month · 3+ = you need the full playbook.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Failed 2 or more? Get the free audit</span>
              </Link>
              <a href="tel:+13103799822" className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-950/60 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                <Phone className="h-4 w-4" />
                <span>Call Joe Terry: (310) 379-9822</span>
              </a>
            </div>
          </Section>

          <Section id="glossary">
            <Kicker>Appendix B · No jargon</Kicker>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Plain-English glossary</h2>
            <p className="text-sm">Every jargon word in this book, in one place — each with the chapter where it pays off. If a term confuses you anywhere above, come back here.</p>
            <dl className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">1-on-1 audit <a href="#ch-8" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 8</a></dt>
                <dd className="mt-1 text-sm">A 20-minute in-person diagnostic of a business&apos;s map listing, mobile site, reviews, and content. Owners buy from people who show the flaw, not pitch decks.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Borrowed traffic <a href="#promise" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Promise</a></dt>
                <dd className="mt-1 text-sm">Customers who find you through partners and networking trust — BNI, chamber, referrals. Slowest to build, highest trust per lead.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Bounce <a href="#ch-6" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 6</a></dt>
                <dd className="mt-1 text-sm">A visitor leaving your page within seconds without calling. Bloated agency sites bounce ~90% of paid clicks in about 10 seconds.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Direct response <a href="#ch-1" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 1</a></dt>
                <dd className="mt-1 text-sm">Marketing measured by one thing: did the phone ring? Opposite of &ldquo;brand awareness&rdquo; — pretty ads nobody can trace to a sale.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Earworm (SERP-term jingle) <a href="#ch-3" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 3</a></dt>
                <dd className="mt-1 text-sm">A 15-second song built on your exact search term. Heard ~20 times, it lodges in memory permanently — e.g. &ldquo;Google Pink, click the link, or call 404-222-PINK.&rdquo;</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">GBP (Google Business Profile) <a href="#ch-2" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 2</a></dt>
                <dd className="mt-1 text-sm">Your free Google listing — hours, photos, reviews, map pin. The most valuable asset you own; keep it accurate and active.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">GEO (Generative Engine Optimization) <a href="#ch-2" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 2</a></dt>
                <dd className="mt-1 text-sm">Writing answers on your own domain so Google AI and ChatGPT quote you. Same work as SEO, aimed at AI answers instead of blue links.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">High-intent lead <a href="#ch-1" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 1</a></dt>
                <dd className="mt-1 text-sm">Someone with an urgent problem searching right now — burst pipe, dead AC, termite swarm. Worth 10x a casual browser.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Living-room effect <a href="#ch-4" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 4</a></dt>
                <dd className="mt-1 text-sm">Over half of local YouTube plays on Smart TVs, where nobody dives for the remote to skip. Your free 5 seconds land in the whole room.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Map Pack <a href="#ch-2" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 2</a></dt>
                <dd className="mt-1 text-sm">The top-3 map box in Google results. Most local calls go to these three businesses — reviews and activity decide who gets in.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">NAP <a href="#ch-2" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 2</a></dt>
                <dd className="mt-1 text-sm">Name, Address, Phone. Must match character-for-character everywhere online, or Google trusts you less.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Pre-roll arbitrage <a href="#ch-4" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 4</a></dt>
                <dd className="mt-1 text-sm">Google charges $0 when viewers skip before 30 seconds — so millions hear your 5-second jingle free. Legal, built into Google&apos;s billing.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Retainer <a href="#ch-10" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 10</a></dt>
                <dd className="mt-1 text-sm">Flat monthly fee for done-for-you presence: ~$300 core, ~$500 with ads managed (plus ad spend). No writing or dashboards — you reply YES to 4 topics a month.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Risk reversal <a href="#ch-5" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 5</a></dt>
                <dd className="mt-1 text-sm">A guarantee so strong the risk flips to you: &ldquo;ice cold or it&apos;s free.&rdquo; Anxious homeowners just want safety — almost nobody claims, they just call.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">RSS syndication <a href="#ch-9" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 9</a></dt>
                <dd className="mt-1 text-sm">One audio feed that publishes your 3-minute answer to Apple, Spotify, Amazon, and YouTube at once — each a free authoritative backlink to your site.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">SERP term <a href="#ch-3" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 3</a></dt>
                <dd className="mt-1 text-sm">The 2–4 words customers type that should put you #1 — e.g. &ldquo;Nashville Party Boat Rental.&rdquo; Every jingle, page, and ad starts here.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Skippable pre-roll <a href="#ch-4" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 4</a></dt>
                <dd className="mt-1 text-sm">A YouTube ad viewers can skip after 5 seconds. Front-load the jingle into those 5 seconds and even skippers heard you.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Sticky tap-to-call <a href="#ch-5" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 5</a></dt>
                <dd className="mt-1 text-sm">A call button pinned in the mobile thumb zone on every page. One tap, no menu hunting — over 90% of your callers are on phones.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Transcript <a href="#ch-9" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 9</a></dt>
                <dd className="mt-1 text-sm">The written text of your 3-minute voice memo, published on your domain as a blog post with FAQ markup. Ranks on Google and gets quoted by AI.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">VSL (Video Sales Letter) <a href="#ch-5" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 5</a></dt>
                <dd className="mt-1 text-sm">One page, one urgent problem, one 45–60 second video, one call button. People watch before they read — replace the 20-page brochure site.</dd>
              </div>
              <div className="p-4">
                <dt className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">Walled garden <a href="#ch-6" className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 transition hover:bg-slate-700">Ch. 6</a></dt>
                <dd className="mt-1 text-sm">Facebook and Instagram, which hide your posts from Google and AI crawlers. Content there evaporates; content on your domain compounds for years.</dd>
              </div>
            </dl>
          </Section>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center text-xs text-slate-500">
            v0.2 living doc · retold from <em>Lessons of Local Internet Presence</em> · Mike Stewart / <a href="https://localinternetpresence.com" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-700 underline-offset-4 transition hover:text-emerald-400">LocalInternetPresence.com</a>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="inline-flex items-center space-x-1.5 text-slate-400 transition hover:text-blue-400">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back home</span>
              </Link>
              <span className="text-slate-700">·</span>
              <Link href="/contact" className="inline-flex items-center space-x-1.5 font-semibold text-emerald-400 transition hover:text-emerald-300">
                <Quote className="h-3.5 w-3.5" />
                <span>Read Ch. 5, then request the audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center space-x-1.5 text-slate-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Print: File → Print → Save as PDF</span>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
