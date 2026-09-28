"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";

export function CompanionKitSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "companion_kit" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSubscribed(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center space-x-2 text-amber-400">
          <Mail className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Stay in the loop
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Get the kit by email
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-neutral-400">
          Drop your email and we&apos;ll send the companion kit straight to
          your inbox — plus occasional useful notes as the second edition
          takes shape. No spam, unsubscribe anytime.
        </p>

        {subscribed ? (
          <div className="mx-auto mt-6 flex max-w-md items-center justify-center space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>You&apos;re in — check your inbox for the kit.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mx-auto mt-6 max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="companion-kit-email" className="sr-only">
                Email address
              </label>
              <input
                id="companion-kit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="min-h-[52px] flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-amber-400 px-6 text-base font-bold text-neutral-950 transition hover:bg-amber-300 active:scale-95 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send me the kit"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <p className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-neutral-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>No spam. Unsubscribe anytime.</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
