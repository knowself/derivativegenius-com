'use client';

import { useState } from 'react';

/**
 * Opens a mailto: handoff in a new window/tab via window.open instead of a
 * plain anchor navigation, so the current tab is never replaced by the mail
 * client. Returns false (popup blocked) so the caller can surface a fallback.
 */
export default function EmailRequestLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [blocked, setBlocked] = useState(false);

  const open = (event: React.MouseEvent) => {
    event.preventDefault();
    const win = window.open(href, '_blank', 'noopener');
    setBlocked(!win);
  };

  return (
    <>
      <a
        href={href}
        onClick={open}
        className="text-emerald-400 hover:underline font-medium"
      >
        {children}
      </a>
      {blocked && (
        <span className="block text-xs text-amber-400 mt-1">
          Popup blocked — allow popups for this site, or use the copy box below.
        </span>
      )}
    </>
  );
}
