import React from 'react';
import FallbackImage from '../../../components/FallbackImage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CENTURIONS_PROJECTS from '../../../data/portfolio';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = CENTURIONS_PROJECTS.find((p) => p.id === params.id);
  if (!project) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/portfolio" className="text-sm text-blue-400">← Back to portfolio</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-white">{project.title}</h1>
      <p className="mt-2 text-slate-300">{project.description}</p>
      <div className="mt-6 h-64 w-full overflow-hidden rounded-lg bg-slate-800">
        <FallbackImage src={project.image ?? `/images/portfolio/${project.id}.png`} alt={project.title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-6">
        <a href={project.url} target="_blank" className="text-blue-400 font-semibold">Visit live site</a>
      </div>
    </main>
  );
}
