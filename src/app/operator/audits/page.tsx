import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';
import AuditsPage from '@/app/centurion/audits/page';

export const revalidate = 0;

export default async function OperatorAuditsPage() {
  await requireDashboardRole(OPERATOR_ROLES);
  return <AuditsPage base="/operator" />;
}
