import { requireDashboardRole } from '@/lib/auth/centurion';
import { OPERATOR_ROLES } from '@/lib/auth/roles';
import QueuePage from '@/app/centurion/queue/page';

export const revalidate = 0;

export default async function OperatorQueuePage() {
  await requireDashboardRole(OPERATOR_ROLES);
  return <QueuePage base="/operator" />;
}
