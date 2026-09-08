import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';
import ProspectDetailPage from '@/app/centurion/prospects/[id]/page';

export const revalidate = 0;

export default async function OperatorProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireDashboardRole(OPERATOR_ROLES);
  return <ProspectDetailPage params={params} base="/operator" />;
}
