import {
  OPERATOR_ROLES,
  PORTAL_ROLES,
  canPerformCenturionAction,
  dashboardForRole,
  resolveUserRole,
} from '@/lib/auth/roles';

describe('dashboard routing (three audiences)', () => {
  it('sends root to /centurion and no one else', () => {
    expect(dashboardForRole('centurion_admin')).toBe('/centurion');
    expect(dashboardForRole('prospector')).not.toBe('/centurion');
    expect(dashboardForRole('customer')).not.toBe('/centurion');
    expect(dashboardForRole('viewer')).not.toBe('/centurion');
  });

  it('sends lower admins to /operator', () => {
    expect(dashboardForRole('prospector')).toBe('/operator');
  });

  it('sends customers to /portal and everyone else to /no-access', () => {
    expect(dashboardForRole('customer')).toBe('/portal');
    expect(dashboardForRole('viewer')).toBe('/no-access');
  });

  it('resolves the customer role from Clerk metadata', () => {
    expect(resolveUserRole('customer')).toBe('customer');
    expect(resolveUserRole(undefined)).toBe('viewer');
  });

  it('gives customers no Centurion console actions', () => {
    expect(canPerformCenturionAction('customer', 'read')).toBe(false);
    expect(canPerformCenturionAction('customer', 'log_outreach')).toBe(false);
    expect(canPerformCenturionAction('customer', 'export')).toBe(false);
  });
  it('keeps operator and portal membership consistent', () => {
    expect(OPERATOR_ROLES).toContain('prospector');
    expect(OPERATOR_ROLES).not.toContain('customer');
    expect(PORTAL_ROLES).toContain('customer');
    expect(PORTAL_ROLES).not.toContain('prospector');
  });

  it('folds the eliminated sales_operator role into prospector', () => {
    expect(resolveUserRole('sales_operator')).toBe('prospector');
    expect(canPerformCenturionAction('prospector', 'manage_pipeline')).toBe(true);
    expect(canPerformCenturionAction('prospector', 'qualify')).toBe(true);
    expect(canPerformCenturionAction('prospector', 'log_outreach')).toBe(true);
  });

  it('restricts team role grants to root', () => {
    expect(canPerformCenturionAction('centurion_admin', 'manage_team')).toBe(true);
    expect(canPerformCenturionAction('prospector', 'manage_team')).toBe(false);
    expect(canPerformCenturionAction('customer', 'manage_team')).toBe(false);
    expect(canPerformCenturionAction('viewer', 'manage_team')).toBe(false);
  });
});
