"use client";

import React, { useState } from "react";
import { Phone, Mail, Sparkles, Send } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/drawer";
import { Haptics } from "@/lib/haptics";

export function MobileBottomBar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "AI Web Application",
  });

  const handleOpenSheet = () => {
    Haptics.confirm();
    setIsSheetOpen(true);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Haptics.success();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsSheetOpen(false);
      setFormData({ name: "", email: "", projectType: "AI Web Application" });
    }, 1800);
  };

  return (
    <>
      {/* Sticky Bottom Thumb Zone Action Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2.5 safe-area-bottom shadow-2xl">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* 1-Tap Quick Call */}
          <a
            href="tel:+18005550199"
            onClick={() => Haptics.confirm()}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 min-h-[48px] rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium active:scale-95 transition-all"
            aria-label="Call Agency"
          >
            <Phone className="h-4 w-4 text-emerald-400" />
            <span>Call</span>
          </a>

          {/* 1-Tap Quick Email */}
          <a
            href="mailto:hello@derivativegenius.com?subject=AI%20Web%20Dev%20Inquiry"
            onClick={() => Haptics.confirm()}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 min-h-[48px] rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium active:scale-95 transition-all"
            aria-label="Email Agency"
          >
            <Mail className="h-4 w-4 text-blue-400" />
            <span>Email</span>
          </a>

          {/* Primary CTA Bottom Sheet Trigger */}
          <button
            onClick={handleOpenSheet}
            className="flex-[2] inline-flex items-center justify-center space-x-2 min-h-[48px] rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Build Project</span>
          </button>
        </div>
      </div>

      {/* Quick Intake Bottom Sheet */}
      <ResponsiveDialog
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Quick AI Project Inquiry"
        description="Tell us about your web application vision. We will follow up within 24 hours."
      >
        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Inquiry Received!</h3>
            <p className="text-sm text-slate-300">
              Our AI engineering team is reviewing your project scope.
            </p>
          </div>
        ) : (
          <form onSubmit={handleQuickSubmit} className="space-y-4 pt-1" suppressHydrationWarning>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                suppressHydrationWarning
                className="w-full min-h-[48px] rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Work Email
              </label>
              <input
                type="email"
                required
                inputMode="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                suppressHydrationWarning
                className="w-full min-h-[48px] rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Project Focus
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                suppressHydrationWarning
                className="w-full min-h-[48px] rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="AI Web Application">AI Web Application</option>
                <option value="Full-Stack Web Development">Full-Stack Next.js Site</option>
                <option value="AI Workflow Integration">AI & LLM Integration</option>
                <option value="Custom Web Portal">Custom Enterprise Portal</option>
              </select>
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              className="w-full min-h-[48px] rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all mt-2"
            >
              Submit Scope Inquiry
            </button>
          </form>
        )}
      </ResponsiveDialog>
    </>
  );
}
