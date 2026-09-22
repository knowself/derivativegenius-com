"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!token) {
      setError("No unsubscribe token provided.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("Failed to unsubscribe. Please try again.");
      }

      setUnsubscribed(true);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {unsubscribed ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Unsubscribed</h2>
            <p className="text-sm text-slate-300">
              You have been successfully removed from the Derivative Genius newsletter list. You will not receive further broadcast emails from us.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Return to Home</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Manage Newsletter Subscription</h2>
            <p className="text-sm text-slate-300">
              Are you sure you want to unsubscribe from the Derivative Genius insights newsletter?
            </p>

            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Unsubscribing..." : "Yes, Unsubscribe Me"}
              </button>
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Never mind, keep me subscribed
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
