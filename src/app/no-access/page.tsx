import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { auth, currentUser } from '@clerk/nextjs/server';
import CopyButton from './_components/CopyButton';
import EmailRequestLink from './_components/EmailRequestLink';

export const metadata = {
  title: 'No Access | Derivative Genius',
  robots: 'noindex, nofollow',
};

export default async function NoAccessPage() {
  const { userId } = await auth();
  const clerkUser = userId ? await currentUser() : null;
  const username = clerkUser?.username ?? null;
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  // Unique identifier for this signup: username when set, otherwise the
  // sign-in email, otherwise the Clerk user ID (always present when signed in).
  const identifier = username ?? email ?? userId ?? 'unknown';
  const subject = `Role request: ${identifier}`;
  const body = `Hi Joe,\n\nPlease grant my account a role (customer or employee).\n\nUsername: ${username ?? '(none set)'}\nEmail: ${email ?? '(unknown)'}\nUser ID: ${userId ?? '(unknown)'}\n\nThanks!`;
  const mailto =
    `mailto:joe@derivativegenius.com` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
  // Plain-text fallback for machines with no mail client (where mailto: clicks silently die).
  const fallbackText = `To: joe@derivativegenius.com\nSubject: ${subject}\n\n${body}`;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">No dashboard assigned yet</h1>
        <p className="text-sm text-slate-400">
          {userId ? (
            <>
              Send email with your username by clicking here {'>>>'}{' '}
              <EmailRequestLink href={mailto}>joe@derivativegenius.com</EmailRequestLink> {'<<<'} to
              grant your role as customer or employee, then sign back in.
            </>
          ) : (
            'Sign in with your assigned account to reach your dashboard.'
          )}
        </p>
        {userId && (
          <p className="text-xs text-slate-500">
            Your username: <span className="font-mono font-semibold text-slate-300">{username ?? '(none set — your email will be used)'}</span>
          </p>
        )}
        {userId && (
          <div className="rounded-lg bg-slate-800/50 border border-slate-700/60 p-3 text-left space-y-2">
            <p className="text-xs text-slate-400">No email app opened? Copy this into any email instead:</p>
            <pre className="text-[11px] leading-relaxed text-slate-300 font-mono whitespace-pre-wrap break-words">{fallbackText}</pre>
            <CopyButton text={fallbackText} label="Copy email text" />
          </div>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          {!userId && (
            <Link href="/sign-in" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition">
              Sign in
            </Link>
          )}
          <Link href="/" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
