import React from 'react';
import FallbackImage from '../../../components/FallbackImage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CENTURIONS_PROJECTS from '../../../data/portfolio';
import Metadata from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = CENTURIONS_PROJECTS.find((p) => p.id === id);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Portfolio Synopsis | Derivative Genius`,
    description: project.synopsis?.overview || project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = CENTURIONS_PROJECTS.find((p) => p.id === id);
  if (!project) return notFound();

  const synopsis = project.synopsis;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-2 text-sm font-semibold text-blue-400 transition-colors hover:bg-slate-800 hover:text-blue-300"
        >
          <span>←</span> Back to Portfolio
        </Link>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
          Centurion Showcase
        </span>
      </div>

      {/* Hero Header */}
      <header className="mb-8 border-b border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-lg text-slate-300 max-w-3xl">{project.description}</p>

        <div className="mt-6 flex items-center gap-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-600/30"
          >
            <span>Visit Live Application</span>
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5M18 6l-7.5 7.5M6 18h12" />
            </svg>
          </a>
        </div>
      </header>

      {/* Image Preview Container */}
      <div className="relative mb-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative aspect-[16/9] w-full">
          <FallbackImage
            src={project.image ?? `/images/portfolio/${project.id}.png`}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Detailed Synopsis Section */}
      {synopsis && (
        <div className="space-y-12">
          {/* Executive Synopsis / Overview */}
          <section className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/30 p-6 sm:p-8 backdrop-blur">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Strategic Purpose & Synopsis</h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-200">{synopsis.overview}</p>

            <div className="mt-6 border-t border-slate-800/80 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Target Audience</span>
              <p className="mt-1 font-medium text-slate-300">{synopsis.targetAudience}</p>
            </div>
          </section>

          {/* Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Core Capabilities & Architectural Drivers</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {synopsis.keyCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-900/70 p-4 border border-slate-800/80">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-400">
                    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-200">{cap}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Potential Business Categories & Adaptability */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Potential Business Applications & Industries</h2>
              <p className="mt-1 text-sm text-slate-400">
                How this design model and functional architecture can be adapted across diverse business categories:
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {synopsis.potentialBusinessCategories.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-blue-500/40 hover:bg-slate-900/80"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-sm font-bold text-blue-400">
                      0{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      {item.category}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{item.useCase}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action Card */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-10">
            <h2 className="text-2xl font-bold text-white">Need a platform like {project.title} for your business?</h2>
            <p className="mt-2 text-slate-300 max-w-xl mx-auto">
              We specialize in custom engineering performant web applications tailored to your exact industry requirements.
            </p>
            <div className="mt-6">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
              >
                Schedule Architecture Consultation
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
