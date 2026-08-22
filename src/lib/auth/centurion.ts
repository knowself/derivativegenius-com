import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import {
  canPerformCenturionAction,
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

export async function requireCenturionPageAction(
  action: CenturionAction,
): Promise<CenturionActor> {
  await auth.protect();
  return requireCenturionAction(action);
}

export function centurionAuthorizationResponse(error: unknown): Response | null {
  if (!(error instanceof CenturionAuthorizationError)) return null;

  return Response.json(
    { success: false, error: error.message },
    { status: error.status },
  );
}
