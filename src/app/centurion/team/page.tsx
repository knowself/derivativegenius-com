import { clerkClient } from '@clerk/nextjs/server';
import { requireCenturionPageAction } from '@/lib/auth/centurion';
import { resolveUserRole } from '@/lib/auth/roles';
import TeamTable from './_components/TeamTable';

export const revalidate = 0;

export interface TeamUser {
  id: string;
  username: string | null;
  email: string | null;
  role: string;
  createdAt: string | null;
  lastSignInAt: string | null;
  isSelf: boolean;
}

export default async function TeamPage() {
  const actor = await requireCenturionPageAction('manage_team');
  const client = await clerkClient();
  const list = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
  const users: TeamUser[] = ((list.data ?? []) as unknown as Array<{
    id: string;
    username?: string | null;
    emailAddresses?: Array<{ emailAddress: string }>;
    publicMetadata?: Record<string, unknown>;
    createdAt?: number;
    lastSignInAt?: number | null;
  }>).map((u) => ({
    id: u.id,
    username: u.username ?? null,
    email: u.emailAddresses?.[0]?.emailAddress ?? null,
    role: resolveUserRole(typeof u.publicMetadata?.role === 'string' ? (u.publicMetadata.role as string) : undefined),
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    lastSignInAt: u.lastSignInAt ? new Date(u.lastSignInAt).toISOString() : null,
    isSelf: u.id === actor.userId,
  }));

  return (
    <div className="space-y-5">
      <header className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white">Team roles</h1>
        <p className="text-sm text-slate-400 mt-1">
          Grant operator and customer roles from the console. Changes apply on the user&apos;s next sign-in and are audit-logged.
        </p>
      </header>
      <TeamTable initialUsers={users} />
    </div>
  );
}
