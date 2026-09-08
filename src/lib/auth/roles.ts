/**
 * Role & Privilege Governance for the Derivative Genius dashboards.
 *
 * Three audiences, three dashboards:
 * - Centurion (`centurion_admin`, root) ............ /centurion
 * - Lower admins doing work for the Centurion
 *   (`prospector`: research + calls + closing) ..... /operator
 * - Customers (client businesses) ................... /portal
 * - Everyone else (`viewer`, the default) ........... /no-access
 *
 * Founder decision (2026-09-08): the former `sales_operator` role is
 * eliminated and folded into `prospector` — one operator role does
 * research, outreach, and closing. Stale `sales_operator` metadata
 * resolves to `prospector` (see `resolveUserRole`).
 */
export type UserRole = 'centurion_admin' | 'prospector' | 'customer' | 'viewer';
export type CenturionAction =
  | 'read'
  | 'manage_campaigns'
  | 'qualify'
  | 'log_outreach'
  | 'manage_audits'
  | 'manage_pipeline'
  | 'manage_compliance'
  | 'manage_team'
  | 'export';

export interface UserSession {
  userId: string;
  email?: string;
  role: UserRole;
  isCenturion: boolean;
}

/**
 * Checks if a role has Centurion root privileges.
 */
export function isCenturionRole(role: UserRole): boolean {
  return role === 'centurion_admin';
}

/**
 * Validates if the user session satisfies the required role constraint.
 */
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === 'centurion_admin') return true; // Centurion root has all permissions
  if (requiredRole === 'viewer') return true;
  if (requiredRole === 'prospector') return userRole === 'prospector';
  return false;
}

const actionRoles: Record<CenturionAction, readonly UserRole[]> = {
  read: ['centurion_admin', 'prospector', 'viewer'],
  manage_campaigns: ['centurion_admin', 'prospector'],
  qualify: ['centurion_admin', 'prospector'],
  log_outreach: ['centurion_admin', 'prospector'],
  manage_audits: ['centurion_admin', 'prospector'],
  manage_pipeline: ['centurion_admin', 'prospector'],
  manage_compliance: ['centurion_admin'],
  manage_team: ['centurion_admin'],
  export: ['centurion_admin'],
};

export function canPerformCenturionAction(
  role: UserRole,
  action: CenturionAction,
): boolean {
  return actionRoles[action].includes(role);
}

export function resolveUserRole(metadataRole?: string): UserRole {
  if (metadataRole === 'centurion_admin') return 'centurion_admin';
  if (metadataRole === 'prospector') return 'prospector';
  // Legacy mapping: eliminated role folds into prospector (2026-09-08).
  if (metadataRole === 'sales_operator') return 'prospector';
  if (metadataRole === 'customer') return 'customer';
  return 'viewer';
}

/**
 * Home dashboard for a role. Used to redirect users who land on a
 * dashboard that is not theirs (`/centurion` is root-only).
 */
export function dashboardForRole(role: UserRole): string {
  switch (role) {
    case 'centurion_admin':
      return '/centurion';
    case 'prospector':
      return '/operator';
    case 'customer':
      return '/portal';
    case 'viewer':
    default:
      return '/no-access';
  }
}

/** Roles permitted inside the operator console (`/operator`). */
export const OPERATOR_ROLES: readonly UserRole[] = ['centurion_admin', 'prospector'];

/** Roles permitted inside the customer portal (`/portal`). */
export const PORTAL_ROLES: readonly UserRole[] = ['centurion_admin', 'customer'];
