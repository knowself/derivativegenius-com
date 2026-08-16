"use client";

import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { CENTURIONS_PROJECTS } from '../data/portfolio';

export function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi?.scrollNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  const handleClick = useCallback((id: string) => {
    fetch('/api/track', { method: 'POST', body: JSON.stringify({ event: 'featured_click', project: id }) }).catch(() => {});
  }, []);

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      <div className="embla overflow-hidden" ref={emblaRef as any}>
        <div className="embla__container flex gap-4">
          {CENTURIONS_PROJECTS.map((p) => (
            <div key={p.id} className="embla__slide min-w-72 w-72 flex-shrink-0">
              <a href={p.url} target="_blank" rel="noreferrer" onClick={() => handleClick(p.id)} className="block overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image ?? `/images/portfolio/${p.id}.png`} alt={p.title} className="h-44 w-full object-cover" />
                <div className="p-2 text-xs text-white">{p.title}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;
