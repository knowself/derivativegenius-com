"use client";

import React, { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setSubscribed(true);
    setLoading(false);
    toast.success("Subscribed! No spam ever, we AI promise!");
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-blue-400">
            <Mail className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Derivative Insights Newsletter
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">Join Our Occasional Newsletter</h3>
          <p className="text-sm text-slate-300">
            Get the latest AI web development techniques, case studies, and tools delivered to your inbox.
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>No spam ever, we AI promise!</span>
          </div>
        </div>

        <div className="w-full md:w-auto min-w-[300px]" suppressHydrationWarning>
          {subscribed ? (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>You are subscribed! Thank you.</span>
            </div>
          ) : !mounted ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-10 w-full rounded-lg bg-slate-950/80 border border-slate-700 animate-pulse" />
              <div className="h-10 w-28 rounded-lg bg-blue-600/80 animate-pulse shrink-0" />
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2" suppressHydrationWarning>
              <Input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                suppressHydrationWarning
                className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="inline-flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shrink-0"
              >
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
