import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';
import ProspectsPage from '@/app/centurion/prospects/page';

export const revalidate = 0;

export default async function OperatorProspectsPage() {
  await requireDashboardRole(OPERATOR_ROLES);
  return <ProspectsPage base="/operator" showImportCta={false} />;
}
