import { requireCenturionPageAction } from '@/lib/auth/centurion';
import AuditToolsForm from './_components/AuditToolsForm';

export const revalidate = 0;
export const metadata = { title: 'Audit Tools | Centurion', robots: 'noindex, nofollow' };

export default async function AuditToolsPage() {
  await requireCenturionPageAction('read');
  return (
    <div className="space-y-5">
      <header className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white">Website Audit Tools</h1>
        <p className="text-sm text-slate-400 mt-1">
          Read-only public-page checks: tap-to-call, hero waste, owned content. Static-HTML heuristics —
          confirm fails on a rendered 390px viewport before quoting. Nothing here writes, sends, or scores a prospect.
        </p>
      </header>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <AuditToolsForm />
      </div>
    </div>
  );
}
