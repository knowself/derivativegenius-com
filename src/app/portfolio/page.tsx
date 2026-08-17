import React from 'react';
import { Metadata } from 'next';
import PortfolioGrid from '../../components/PortfolioGrid';

export const metadata: Metadata = {
  title: 'Centurions Portfolio — Derivative Genius',
  description: 'A curated showcase of the Centurions best web projects built by Derivative Genius.',
};

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-100">Centurions Portfolio</h1>
        <p className="mt-2 text-lg text-slate-300">
          A curated showcase of the Centurions&apos; best web projects — high-performance,
          production-proven applications that demonstrate our design, engineering,
          and AI-integration capabilities.
        </p>
      </header>

      <section>
        <PortfolioGrid />
      </section>
    </main>
  );
}
