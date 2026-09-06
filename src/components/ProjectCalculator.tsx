"use client";

import React, { useState } from "react";
import { Cpu, Layers, Zap, Globe, Sparkles, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function ProjectCalculator() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "ai-native-ui",
    "zod-api-validation",
  ]);
  const [pageCount, setPageCount] = useState<number>(5);

  const featureOptions = [
    {
      id: "ai-native-ui",
      name: "Custom Responsive Pages",
      desc: "Designed pages that read well on phones first",
      baseWeeks: 1,
      baseCost: 2500,
    },
    {
      id: "zod-api-validation",
      name: "Safe Forms & Intake Routes",
      desc: "Validated forms that store inquiries reliably",
      baseWeeks: 1,
      baseCost: 2000,
    },
    {
      id: "llm-streaming",
      name: "On-Site Q&A Assistant",
      desc: "Answers visitors from your own documented Q&A",
      baseWeeks: 2,
      baseCost: 3500,
    },
    {
      id: "semantic-search",
      name: "Plain-Words Site Search",
      desc: "Search that understands meaning, not exact keywords",
      baseWeeks: 2,
      baseCost: 3000,
    },
    {
      id: "autonomous-workflows",
      name: "Automatic Follow-Ups",
      desc: "Quotes, records, and team alerts without copy-paste",
      baseWeeks: 2,
      baseCost: 4000,
    },
    {
      id: "client-portal",
      name: "Customer Login Area",
      desc: "Per-customer access to requests, files, and status",
      baseWeeks: 2,
      baseCost: 3500,
    },
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const calculateEstimate = () => {
    let totalCost = 1500 + pageCount * 300;
    let totalWeeks = 1 + Math.ceil(pageCount / 5);

    featureOptions.forEach((f) => {
      if (selectedFeatures.includes(f.id)) {
        totalCost += f.baseCost;
        totalWeeks += f.baseWeeks;
      }
    });

    return { totalCost, totalWeeks };
  };

  const { totalCost, totalWeeks } = calculateEstimate();

  return (
    <Card className="border-blue-500/30 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center space-x-2 text-blue-400">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Interactive Scoping Tool
          </span>
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Project Scope Estimator
        </CardTitle>
        <CardDescription className="text-slate-300">
          Pick what you need for a rough starting range. Final price and timeline are confirmed on a call, in writing, before work begins.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Page Count Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <Label className="font-semibold text-slate-200">
              Estimated Page / Route Count: <span className="text-blue-400 font-bold">{pageCount} pages</span>
            </Label>
          </div>
          <Slider
            value={[pageCount]}
            min={1}
            max={20}
            step={1}
            onValueChange={(val) => setPageCount(val[0])}
          />
        </div>

        {/* Feature Toggles Grid */}
        <div className="space-y-3">
          <Label className="font-semibold text-slate-200">What should the site include?</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featureOptions.map((feat) => {
              const isSelected = selectedFeatures.includes(feat.id);
              return (
                <div
                  key={feat.id}
                  onClick={() => toggleFeature(feat.id)}
                  className={`cursor-pointer min-h-[52px] rounded-xl border p-4 transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/10"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{feat.name}</span>
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isSelected ? "text-blue-400 opacity-100" : "text-slate-600 opacity-40"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Output Estimate Summary */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-400 uppercase font-mono">Rough Starting Range — confirmed on a call</div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1.5 text-slate-200">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-lg font-bold text-white">{totalWeeks} Weeks</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-200">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-lg font-bold text-blue-400">
                  ${totalCost.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-flex items-center justify-center space-x-2 min-h-[48px] rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 active:scale-95 transition-all shadow-md"
          >
            <span>Submit Scope</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
