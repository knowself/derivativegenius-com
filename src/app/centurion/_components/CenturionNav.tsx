'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Users, PhoneCall, FileUp, Lock, Terminal, ClipboardCheck, Handshake, BarChart3, CheckSquare, KeyRound } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/centurion', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/centurion/campaigns', label: 'Campaigns', icon: Target },
  { href: '/centurion/prospects', label: 'Prospects', icon: Users },
  { href: '/centurion/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/centurion/queue', label: 'Daily Queue', icon: PhoneCall },
  { href: '/centurion/audits', label: 'Audits', icon: ClipboardCheck },
  { href: '/centurion/audit-tools', label: 'Audit Tools', icon: Terminal },
  { href: '/centurion/pipeline', label: 'Pipeline', icon: Handshake },
  { href: '/centurion/reports', label: 'Reports', icon: BarChart3 },
  { href: '/centurion/import', label: 'Import CSV', icon: FileUp },
  { href: '/centurion/team', label: 'Team', icon: KeyRound, adminOnly: true },
  { href: '/centurion/compliance', label: 'Compliance', icon: Lock, adminOnly: true },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CenturionDesktopNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav aria-label="Centurion sections" className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              active
                ? 'text-white bg-slate-800 shadow-[inset_0_-2px_0_0_#10b981]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 inline mr-1.5 ${active ? 'text-emerald-400' : ''}`} /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CenturionMobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).slice(0, 6);

  return (
    <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-900 text-xs">
      {items.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={active ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-emerald-400'}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function CenturionNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      <nav aria-label="Centurion sections" className="hidden md:flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? 'text-white bg-slate-800 shadow-[inset_0_-2px_0_0_#10b981]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 inline mr-1.5 ${active ? 'text-emerald-400' : ''}`} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 bg-slate-900 text-xs">
        {items
          .filter((item) => !item.adminOnly)
          .slice(0, 6)
          .map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={active ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-emerald-400'}
              >
                {item.label}
              </Link>
            );
          })}
      </div>
    </>
  );
}
