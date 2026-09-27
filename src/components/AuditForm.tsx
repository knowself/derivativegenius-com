"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Industry = "hvac" | "pest-control" | "dentists";

const LABELS: Record<Industry, string> = {
  hvac: "Heating & Cooling",
  "pest-control": "Pest Control",
  dentists: "Dentists",
};

const inputCls =
  "w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20";

export function AuditForm({ industry }: { industry: Industry }) {
  const [form, setForm] = useState({ name: "", business: "", website: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function set(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, industry }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details?.[0]?.message || data.error || "Something went wrong.");
      }
      setStatus("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-amber-400" />
        <h3 className="mt-4 text-2xl font-extrabold">You&apos;re in.</h3>
        <p className="mx-auto mt-3 max-w-md text-neutral-400">
          Joe will personally review your {LABELS[industry].toLowerCase()} business and send
          your free 5-minute audit. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Your name *
          </span>
          <input required minLength={2} maxLength={100} value={form.name} onChange={set("name")} placeholder="Jane Owner" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Business name *
          </span>
          <input required minLength={2} maxLength={100} value={form.business} onChange={set("business")} placeholder="Acme Heating & Air" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Website
          </span>
          <input value={form.website} onChange={set("website")} placeholder="acmeheating.com" inputMode="url" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Phone
          </span>
          <input value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" inputMode="tel" className={inputCls} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Email *
          </span>
          <input required type="email" maxLength={150} value={form.email} onChange={set("email")} placeholder="you@yourshop.com" className={inputCls} />
        </label>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-lg font-bold text-neutral-950 transition hover:bg-amber-300 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>Claim my free audit</>
        )}
      </button>
      <p className="mt-3 text-xs text-neutral-500">
        No spam, no cold calls. One audit, from Joe himself.
      </p>
    </form>
  );
}
