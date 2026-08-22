/**
 * Role & Privilege Governance for the Centurion Prospecting System.
 * 
 * Centurion (`centurion_admin`) is the least-common role and must be granted
 * explicitly through trusted Clerk metadata or server configuration.
 */

export type UserRole = 'centurion_admin' | 'prospector' | 'sales_operator' | 'viewer';
export type CenturionAction =
  | 'read'
  | 'manage_campaigns'
  | 'qualify'
  | 'log_outreach'
  | 'manage_audits'
  | 'manage_pipeline'
  | 'manage_compliance'
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
  if (requiredRole === 'sales_operator') return userRole === 'sales_operator' || userRole === 'prospector';
  if (requiredRole === 'prospector') return userRole === 'prospector';
  return false;
}

const actionRoles: Record<CenturionAction, readonly UserRole[]> = {
  read: ['centurion_admin', 'prospector', 'sales_operator', 'viewer'],
  manage_campaigns: ['centurion_admin', 'prospector'],
  qualify: ['centurion_admin', 'prospector'],
  log_outreach: ['centurion_admin', 'prospector', 'sales_operator'],
  manage_audits: ['centurion_admin', 'prospector', 'sales_operator'],
  manage_pipeline: ['centurion_admin', 'sales_operator'],
  manage_compliance: ['centurion_admin'],
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
  if (metadataRole === 'sales_operator') return 'sales_operator';
  return 'viewer';
}
