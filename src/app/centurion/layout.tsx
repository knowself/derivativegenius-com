import React from 'react';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, Target, Users, PhoneCall, FileUp, Lock, Terminal, ClipboardCheck, Handshake, BarChart3 } from 'lucide-react';
import { requireCenturionPageAction } from '@/lib/auth/centurion';

export const metadata = {
  title: 'Centurion Operator Console | Derivative Genius',
  robots: 'noindex, nofollow',
};

export default async function CenturionLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireCenturionPageAction('read');
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/centurion" className="flex items-center gap-2 font-bold text-lg text-emerald-400">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span>CENTURION</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-3 h-3" /> {actor.role.replace('_', ' ')}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/centurion" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <LayoutDashboard className="w-4 h-4 inline mr-1.5" /> Dashboard
            </Link>
            <Link href="/centurion/campaigns" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Target className="w-4 h-4 inline mr-1.5" /> Campaigns
            </Link>
            <Link href="/centurion/prospects" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Users className="w-4 h-4 inline mr-1.5" /> Prospects
            </Link>
            <Link href="/centurion/queue" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <PhoneCall className="w-4 h-4 inline mr-1.5" /> Daily Queue
            </Link>
            <Link href="/centurion/audits" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <ClipboardCheck className="w-4 h-4 inline mr-1.5" /> Audits
            </Link>
            <Link href="/centurion/pipeline" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Handshake className="w-4 h-4 inline mr-1.5" /> Pipeline
            </Link>
            <Link href="/centurion/reports" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <BarChart3 className="w-4 h-4 inline mr-1.5" /> Reports
            </Link>
            <Link href="/centurion/import" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <FileUp className="w-4 h-4 inline mr-1.5" /> Import CSV
            </Link>
            {actor.role === 'centurion_admin' && <Link href="/centurion/compliance" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              <Lock className="w-4 h-4 inline mr-1.5" /> Compliance
            </Link>}
          </nav>

          <div className="flex items-center gap-2">
            {actor.role === 'centurion_admin' && <a
              href="/api/centurion/export"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Export CSV (Root)
            </a>}
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-900 text-xs text-slate-400">
          <Link href="/centurion" className="hover:text-emerald-400">Dashboard</Link>
          <Link href="/centurion/prospects" className="hover:text-emerald-400">Prospects</Link>
          <Link href="/centurion/queue" className="hover:text-emerald-400">Queue</Link>
          <Link href="/centurion/pipeline" className="hover:text-emerald-400">Pipeline</Link>
          <Link href="/centurion/reports" className="hover:text-emerald-400">Reports</Link>
        </div>
      </header>

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 text-center text-xs text-slate-500">
        Centurion Operator System v1.0 • Derivative Genius • authenticated, role-gated access
      </footer>
    </div>
  );
}
