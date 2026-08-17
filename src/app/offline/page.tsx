import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 text-amber-500">
        <WifiOff className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        You are currently offline
      </h1>

      <p className="text-sm text-neutral-400 max-w-sm mb-8 leading-relaxed">
        Application shell is cached, but live prospect data and API connections require an active internet connection to ensure security and compliance.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 font-semibold text-sm hover:bg-neutral-200 active:scale-95 transition-all shadow-lg"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Connection
      </Link>
    </main>
  );
}
