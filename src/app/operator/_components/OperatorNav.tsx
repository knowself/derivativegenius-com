'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PhoneCall, Users, ClipboardCheck } from 'lucide-react';

const ITEMS = [
  { href: '/operator', label: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/operator/queue', label: 'Queue', icon: PhoneCall },
  { href: '/operator/prospects', label: 'Prospects', icon: Users },
  { href: '/operator/audits', label: 'Audits', icon: ClipboardCheck },
];

export default function OperatorNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  if (mobile) {
    return (
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-900 text-xs">
        {ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }
  return (
    <nav aria-label="Operator sections" className="hidden md:flex items-center gap-1">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              active ? 'text-white bg-slate-800 shadow-[inset_0_-2px_0_0_#10b981]' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 inline mr-1.5 ${active ? 'text-emerald-400' : ''}`} /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
