"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "AI-Native Web Application",
    budget: "$5,000 - $15,000",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project inquiry");
      }

      setSubmitted(true);
      toast.success("Project inquiry received! We will contact you within 24 hours.");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Project Scoping & Intake</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Scope Your Web Project
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Fill out the project intake details below to receive a custom technical proposal and development timeline.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Project Inquiry Form</CardTitle>
          <CardDescription>
            All submissions are protected by server-side Zod validation and encrypted lead storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Inquiry Submitted Successfully</h3>
              <p className="text-slate-300 text-sm">
                Thank you for reaching out to Derivative Genius. Our web engineering lead will review your project scope and contact you at <span className="font-semibold text-blue-400">{formData.email}</span>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-semibold text-blue-400 hover:underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Target Service *</Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="AI-Native Web Application">AI-Native Web Application</option>
                    <option value="Intelligent Client Portal">Intelligent Client Portal</option>
                    <option value="AI Feature & API Integration">AI Feature & API Integration</option>
                    <option value="Full-Stack Web Redesign">Full-Stack Web Redesign</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Target Budget Range</Label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="flex h-11 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="< $5,000">&lt; $5,000 (Scoping & Advisory)</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000 (Standard Web App Sprint)</option>
                  <option value="$15,000 - $50,000">$15,000 - $50,000 (Enterprise AI Platform)</option>
                  <option value="$50,000+">$50,000+ (Full Custom Enterprise System)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Project Description & Requirements *</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Describe your web application goals, target audience, and key features required..."
                  value={formData.message}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Scope...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Project Scope</span>
                  </>
                )}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
