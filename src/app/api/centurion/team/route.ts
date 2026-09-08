import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';
import { resolveUserRole, type UserRole } from '@/lib/auth/roles';

const GRANTABLE_ROLES: readonly UserRole[] = [
  'centurion_admin',
  'prospector',
  'customer',
  'viewer',
];

const setRoleSchema = z.object({
  userId: z.string().min(1),
  // NOTE: legacy `sales_operator` metadata resolves to `prospector` on read
  // and is not grantable (role eliminated 2026-09-08).
  role: z.enum(['centurion_admin', 'prospector', 'customer', 'viewer']),
});

interface ClerkUserLike {
  id: string;
  username?: string | null;
  emailAddresses?: Array<{ emailAddress: string }>;
  publicMetadata?: Record<string, unknown>;
  createdAt?: number;
  lastSignInAt?: number | null;
}

/** GET: list Clerk users with their resolved dashboard role. Root only. */
export async function GET() {
  try {
    const actor = await requireCenturionAction('manage_team');
    const client = await clerkClient();
    const list = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });
    const users = ((list.data ?? []) as unknown as ClerkUserLike[]).map((u) => {
      const metadataRole = u.publicMetadata?.role;
      return {
        id: u.id,
        username: u.username ?? null,
        email: u.emailAddresses?.[0]?.emailAddress ?? null,
        role: resolveUserRole(typeof metadataRole === 'string' ? metadataRole : undefined),
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
        lastSignInAt: u.lastSignInAt ? new Date(u.lastSignInAt).toISOString() : null,
        isSelf: u.id === actor.userId,
      };
    });
    return NextResponse.json({ success: true, users, grantableRoles: GRANTABLE_ROLES });
  } catch (error: unknown) {
    return centurionAuthorizationResponse(error) ?? NextResponse.json({ success: false, error: 'Unable to list users' }, { status: 500 });
  }
}

/** PATCH: set a user's dashboard role. Root only, audit-logged. */
export async function PATCH(request: NextRequest) {
  try {
    const actor = await requireCenturionAction('manage_team');
    const input = setRoleSchema.parse(await request.json());
    const client = await clerkClient();
    const target = (await client.users.getUser(input.userId)) as unknown as ClerkUserLike;
    const previousRole = resolveUserRole(typeof target.publicMetadata?.role === 'string' ? (target.publicMetadata.role as string) : undefined);
    if (previousRole === input.role) {
      return NextResponse.json({ success: true, unchanged: true, role: input.role });
    }
    await client.users.updateUserMetadata(input.userId, {
      publicMetadata: { ...(target.publicMetadata ?? {}), role: input.role },
    });
    await db.insert(auditLogs).values({
      action: 'role_change',
      performedBy: actor.userId,
      targetId: input.userId,
      detailsJson: JSON.stringify({ from: previousRole, to: input.role }),
    });
    return NextResponse.json({ success: true, role: input.role, previousRole });
  } catch (error: unknown) {
    const response = centurionAuthorizationResponse(error);
    if (response) return response;
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    return NextResponse.json({ success: false, error: 'Unable to set role' }, { status: 500 });
  }
}
