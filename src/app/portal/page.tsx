import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Building2, FileCheck2, Handshake, Rocket } from 'lucide-react';
import { db } from '@/db';
import { audits, contacts, opportunities, projectHandoffs, proposals, prospects } from '@/db/schema';
import { requireDashboardRole } from '@/lib/auth/centurion';
import { PORTAL_ROLES } from '@/lib/auth/roles';

export const revalidate = 0;
export const metadata = {
  title: 'Client Portal | Derivative Genius',
  robots: 'noindex, nofollow',
};

// Only client-safe audit states are ever shown in the portal. Internal
// drafts and reviews stay inside the Centurion/operator consoles.
const SHARED_AUDIT_STATUSES = ['sent', 'viewed'];

export default async function PortalPage() {
  await requireDashboardRole(PORTAL_ROLES);
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? null;

  // Link the sign-in to businesses via the decision-maker contact email
  // recorded by the operator. Comparison in JS keeps casing behavior explicit.
  const matched = email
    ? (
        await db.select().from(contacts)
      ).filter((c) => c.email?.toLowerCase() === email)
    : [];
  const prospectIds = Array.from(new Set(matched.map((c) => c.prospectId)));
  const businesses =
    prospectIds.length > 0
      ? await Promise.all(
          prospectIds.map(async (id) => {
            const [prospect] = await db.select().from(prospects).where(eq(prospects.id, id));
            if (!prospect) return null;
            const sharedAudits = (await db.select().from(audits).where(eq(audits.prospectId, id))).filter((a) =>
              SHARED_AUDIT_STATUSES.includes(a.status),
            );
            const opps = await db.select().from(opportunities).where(eq(opportunities.prospectId, id));
            const oppProposals = (
              await Promise.all(opps.map((o) => db.select().from(proposals).where(eq(proposals.opportunityId, o.id))))
            ).flat();
            const handoffs = (
              await Promise.all(opps.map((o) => db.select().from(projectHandoffs).where(eq(projectHandoffs.opportunityId, o.id))))
            ).flat();
            return { prospect, sharedAudits, proposals: oppProposals, handoffs };
          }),
        )
      : [];

  const firms = businesses.filter((b): b is NonNullable<typeof b> => b !== null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2 font-bold text-lg text-emerald-400">
          <Building2 className="w-6 h-6 text-emerald-500" />
          <span>CLIENT PORTAL</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Your work with Derivative Genius</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audits shared with you, agreed scopes, and delivery status — nothing else.
          </p>
        </div>

        {firms.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">No linked business yet</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              {email
                ? `Nothing is linked to ${email} yet. Once your audit or project is shared, it appears here.`
                : 'We could not read a sign-in email. Sign in with the business email you gave us.'}
            </p>
          </div>
        ) : (
          firms.map(({ prospect, sharedAudits, proposals: firmProposals, handoffs }) => (
            <section key={prospect.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">{prospect.name}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {prospect.city || 'Unknown city'}{prospect.city || prospect.state ? ', ' : ''}{prospect.state || ''}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" /> Audits shared with you ({sharedAudits.length})
                </h3>
                {sharedAudits.length === 0 ? (
                  <p className="text-xs text-slate-500">No audits shared yet — your review is being prepared.</p>
                ) : (
                  <ul className="space-y-2">
                    {sharedAudits.map((a) => (
                      <li key={a.id} className="text-xs bg-slate-800/50 rounded-lg p-3">
                        <p className="text-slate-200 font-medium">{a.targetOutcome || 'Website audit'}</p>
                        {a.proposalRange && <p className="text-slate-400 mt-1">Suggested range: {a.proposalRange}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                  <Handshake className="w-4 h-4 text-emerald-400" /> Agreed work ({firmProposals.length})
                </h3>
                {firmProposals.length === 0 ? (
                  <p className="text-xs text-slate-500">No proposals yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {firmProposals.map((p) => (
                      <li key={p.id} className="text-xs bg-slate-800/50 rounded-lg p-3 flex items-center justify-between gap-2">
                        <span className="text-slate-200">{p.scopeSummary}</span>
                        <span className="text-emerald-400 font-semibold shrink-0">
                          ${(p.amount ?? 0).toLocaleString()} · <span className="capitalize">{p.status.replace('_', ' ')}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {handoffs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-emerald-400" /> Delivery
                  </h3>
                  <ul className="space-y-2">
                    {handoffs.map((h) => (
                      <li key={h.id} className="text-xs bg-slate-800/50 rounded-lg p-3 text-slate-200">
                        {h.scopeSummary}
                        {h.kickoffAt && <span className="text-slate-400"> · kicked off {new Date(h.kickoffAt).toLocaleDateString()}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))
        )}

        <p className="text-center text-xs text-slate-500">
          Questions? Reply to your audit thread or call us — <Link href="/" className="text-emerald-400 hover:underline">derivativegenius.com</Link>
        </p>
      </main>
    </div>
  );
}
