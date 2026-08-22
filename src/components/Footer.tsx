import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Terminal, Shield, Cpu } from "lucide-react";
import { CenturionIcon } from "@/components/CenturionIcon";


export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/DG-AAA.png"
                alt="Derivative Genius Logo"
                width={270}
                height={184}
                className="h-14 sm:h-16 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier AI-First Web Development Agency. We build intelligent, high-speed, AI-native web applications and custom software platforms.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Services & Demos</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-blue-400 transition-colors">
                  AI-Native Web Apps
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-blue-400 transition-colors">
                  Industry Solutions
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-blue-400 transition-colors">
                  Articles & Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Interactive Scope Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Derivative Genius
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Project Scoping Intake
                </Link>
              </li>
              <li>
                <Link
                  href="/centurion"
                  title="Centurion Operator Console"
                  aria-label="Centurion Operator Console"
                  className="inline-flex p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 transition-colors"
                >
                  <CenturionIcon className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200">Engineering Standard</h4>
            <div className="mt-4 flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Next.js 16 App Router & TypeScript</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zod Server-Side Schema Validation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Agentic Developer Workflows</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/60 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Derivative Genius. All rights reserved. Built with AI-first precision.
        </div>
      </div>
    </footer>
  );
}
