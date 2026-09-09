import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  canPerformCenturionAction,
  dashboardForRole,
  resolveUserRole,
  type CenturionAction,
  type UserRole,
} from './roles';

export class CenturionAuthorizationError extends Error {
  constructor(
    message: string,
    public readonly status: 401 | 403,
  ) {
    super(message);
    this.name = 'CenturionAuthorizationError';
  }
}

export interface CenturionActor {
  userId: string;
  role: UserRole;
}

function configuredAdminIds(): Set<string> {
  return new Set(
    (process.env.CENTURION_ADMIN_USER_IDS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export async function requireCenturionAction(
  action: CenturionAction,
): Promise<CenturionActor> {
  const { userId } = await auth();
  if (!userId) {
    throw new CenturionAuthorizationError('Authentication required', 401);
  }

  const clerkUser = await currentUser();
  const metadataRole = clerkUser?.publicMetadata?.role;
  const role = configuredAdminIds().has(userId)
    ? 'centurion_admin'
    : resolveUserRole(typeof metadataRole === 'string' ? metadataRole : undefined);

  if (!canPerformCenturionAction(role, action)) {
    throw new CenturionAuthorizationError('Insufficient Centurion privileges', 403);
  }

  return { userId, role };
}

/**
 * Display name for the signed-in user in saved records and narratives:
 * Clerk username, then primary email, then the raw user id.
 */
export async function resolveActorName(): Promise<string> {
  const { userId } = await auth();
  if (!userId) return 'unknown';
  const clerkUser = await currentUser();
  return (
    clerkUser?.username ??
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    userId
  );
}

export async function requireCenturionPageAction(
  action: CenturionAction,
): Promise<CenturionActor> {
  await auth.protect();
  return requireCenturionAction(action);
}

/**
 * Require the signed-in user to hold one of `allowed` roles.
 * Anyone else is redirected to their own dashboard (`/centurion` is
 * root-only; operators go to `/operator`, customers to `/portal`,
 * everyone else to `/no-access`). Uses the same role resolution as
 * `requireCenturionAction` (env admin IDs, then Clerk public metadata).
 */
export async function requireDashboardRole(
  allowed: readonly UserRole[],
): Promise<CenturionActor> {
  await auth.protect();
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const metadataRole = clerkUser?.publicMetadata?.role;
  const role = userId && configuredAdminIds().has(userId)
    ? 'centurion_admin'
    : resolveUserRole(typeof metadataRole === 'string' ? metadataRole : undefined);
  if (!(allowed as readonly string[]).includes(role)) {
    redirect(dashboardForRole(role));
  }
  return { userId: userId ?? 'unknown', role };
}

export function centurionAuthorizationResponse(error: unknown): Response | null {
  if (!(error instanceof CenturionAuthorizationError)) return null;

  return Response.json(
    { success: false, error: error.message },
    { status: error.status },
  );
}
