import React from "react";
import Link from "next/link";
import { Video, Music, Phone, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * DT-10 "Eat Your Own Cooking" block (DT-04 credibility pass 2026-09-26).
 *
 * Honest placeholders only: no invented video/audio files, no invented metrics.
 * Founder video slot plays the HVAC cut (public/videos/founder-video-joe-terry.mp4);
 * the card links to /free-audit so other industries can pick their page.
 * Jingle slot plays Joe's real sung earworm take (public/audio/dg-earworm-jingle-v2.mp3);
 * the full studio mix ships with the Growth Retainer.
 * Copy is visitor-facing — no internal production notes on the live page.
 */
export function EatYourOwnCooking() {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-50/90 dark:bg-slate-900/80 p-8 sm:p-12 backdrop-blur-xl space-y-10 shadow-sm">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
          Eat Your Own Dog food
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          We run our own playbook on this page.
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          One problem per page. One clear call action. No sliders, no autoplay video, no menu maze — the same standard we build for local shops.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="flex flex-col justify-between border-emerald-500/20">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Video className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-xl">60-second founder video — the HVAC cut</CardTitle>
            <CardDescription className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Joe Terry, speaking directly to HVAC owners: the Homepage Mistake, the missed-call cost, and what the free audit finds. More industries on the way.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <video controls preload="none" poster="/videos/founder-poster.jpg" src="/videos/founder-video-joe-terry.mp4" className="w-full rounded-xl border border-slate-200 dark:border-slate-800">
              Your browser can&apos;t play video — <a href="/videos/founder-video-joe-terry.mp4" className="underline">download it</a>.
            </video>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+13103799822"
                className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call (310) 379-9822</span>
              </a>
              <Link
                href="/free-audit"
                className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Not HVAC? Pick your industry</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between border-emerald-500/20">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Music className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-xl">15-second SERP-term jingle — hear ours</CardTitle>
            <CardDescription className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our own playbook, running on us. Sung by Joe himself — press play, no autoplay. The full studio mix ships with the Growth Retainer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <audio controls preload="none" src="/audio/dg-earworm-jingle-v2.mp3" className="w-full">
              Your browser can&apos;t play audio — <a href="/audio/dg-earworm-jingle-v2.mp3" className="underline">download the jingle</a>.
            </audio>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/70 p-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">The lyric card</div>
              <p className="italic leading-relaxed">
                &ldquo;Phone&apos;s not ringing? Nobody knows your name? Google buries businesses like yours — Derivative Genius makes you famous! Get found! Get called! Get growing!&rdquo;
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/70 p-4 text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">How the 15 seconds work</div>
              <ul className="space-y-1">
                <li><span className="font-semibold text-slate-900 dark:text-slate-200">0–5s anchor:</span> your top search term + your town</li>
                <li><span className="font-semibold text-slate-900 dark:text-slate-200">5–12s benefit:</span> the one problem you solve</li>
                <li><span className="font-semibold text-slate-900 dark:text-slate-200">12–15s nudge:</span> call now — your phone number</li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              <span>Want one built around your search term?</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
