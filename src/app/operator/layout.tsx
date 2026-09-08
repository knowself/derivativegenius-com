import React from 'react';
import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';
import OperatorNav from './_components/OperatorNav';

export const metadata = {
  title: 'Operator Console | Derivative Genius',
  robots: 'noindex, nofollow',
};

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireDashboardRole(OPERATOR_ROLES);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/operator" className="flex items-center gap-2 font-bold text-lg text-emerald-400">
              <Wrench className="w-6 h-6 text-emerald-500" />
              <span>OPERATOR</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {actor.role.replace('_', ' ')}
            </span>
          </div>

          <OperatorNav />
        </div>

        <OperatorNav mobile />
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 text-center text-xs text-slate-500">
        Operator Console • work assigned by the Centurion • every outcome logged
      </footer>
    </div>
  );
}
