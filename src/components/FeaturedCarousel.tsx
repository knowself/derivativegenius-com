"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { CENTURIONS_PROJECTS } from '../data/portfolio';
import FallbackImage from './FallbackImage';

function ensureMatchMedia() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  }
}

// Ornate Left Arrow SVG Icon
function OrnateLeftArrowIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Decorative filigree flourishes */}
      <path
        d="M26 8C23 10 21 14 21 18C21 22 23 26 26 28"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Main ornate arrow stem and chevron */}
      <path
        d="M24 18H10M10 18L17 11M10 18L17 25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ornate diamond tip accents */}
      <polygon points="8,18 10,16.5 12,18 10,19.5" fill="currentColor" />
      <polygon points="26,18 27.5,16.8 29,18 27.5,19.2" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

// Ornate Right Arrow SVG Icon
function OrnateRightArrowIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Decorative filigree flourishes */}
      <path
        d="M10 8C13 10 15 14 15 18C15 22 13 26 10 28"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Main ornate arrow stem and chevron */}
      <path
        d="M12 18H26M26 18L19 11M26 18L19 25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ornate diamond tip accents */}
      <polygon points="28,18 26,16.5 24,18 26,19.5" fill="currentColor" />
      <polygon points="10,18 8.5,16.8 7,18 8.5,19.2" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

// Triplicate slides so Embla has enough buffer to loop infinitely regardless of screen width
const DISPLAY_PROJECTS = [
  ...CENTURIONS_PROJECTS,
  ...CENTURIONS_PROJECTS,
  ...CENTURIONS_PROJECTS,
];

export function FeaturedCarousel() {
  ensureMatchMedia();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
  });

  const isHoveredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 10-second auto-rotation to the right
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (emblaApi && !isHoveredRef.current) {
        if (typeof emblaApi.canScrollNext === 'function' ? emblaApi.canScrollNext() : true) {
          emblaApi.scrollNext();
        } else if (typeof emblaApi.scrollTo === 'function') {
          emblaApi.scrollTo(0);
        }
      }
    }, 10000); // 10 seconds
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    resetTimer();

    // Re-sync on page visibility change (e.g., user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [emblaApi, resetTimer]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    if (typeof emblaApi.canScrollPrev === 'function' ? emblaApi.canScrollPrev() : true) {
      emblaApi.scrollPrev();
    } else if (typeof emblaApi.scrollTo === 'function') {
      emblaApi.scrollTo(DISPLAY_PROJECTS.length - 1);
    }
    resetTimer();
  }, [emblaApi, resetTimer]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    if (typeof emblaApi.canScrollNext === 'function' ? emblaApi.canScrollNext() : true) {
      emblaApi.scrollNext();
    } else if (typeof emblaApi.scrollTo === 'function') {
      emblaApi.scrollTo(0);
    }
    resetTimer();
  }, [emblaApi, resetTimer]);

  const handleClick = useCallback((id: string) => {
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'featured_click', project: id }),
    }).catch(() => {});
  }, []);

  return (
    <div
      className="relative mx-auto mt-6 max-w-5xl px-3 sm:px-14"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        resetTimer();
      }}
    >
      {/* Large Ornate Left Arrow Button */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous portfolio project"
        className="group/btn absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-950/85 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-cyan-300 hover:bg-slate-900 hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <div className="absolute inset-0.5 rounded-full border border-cyan-400/20 group-hover/btn:border-cyan-400/40 transition-colors pointer-events-none" />
        <OrnateLeftArrowIcon className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
      </button>

      {/* Large Ornate Right Arrow Button */}
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next portfolio project"
        className="group/btn absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-950/85 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-cyan-300 hover:bg-slate-900 hover:text-cyan-200 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <div className="absolute inset-0.5 rounded-full border border-cyan-400/20 group-hover/btn:border-cyan-400/40 transition-colors pointer-events-none" />
        <OrnateRightArrowIcon className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      </button>

      {/* Side Vignette Gradient Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-3 sm:left-14 w-12 z-20 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent hidden sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-3 sm:right-14 w-12 z-20 bg-gradient-to-l from-slate-950/80 via-slate-950/30 to-transparent hidden sm:block" />

      {/* Carousel Track */}
      <div className="embla overflow-hidden rounded-xl py-2" ref={emblaRef as any}>
        <div className="embla__container flex gap-5">
          {DISPLAY_PROJECTS.map((p, index) => (
            <div
              key={`${p.id}-${index}`}
              className="embla__slide min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] flex-shrink-0"
            >
              <Link
                href={`/portfolio/${p.id}`}
                onClick={() => handleClick(p.id)}
                className="group/card block overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/70 p-2.5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <FallbackImage
                    src={p.image ?? `/images/portfolio/${p.id}.png`}
                    alt={p.title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-30 transition-opacity" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-1">
                  <div className="font-semibold text-sm text-slate-100 group-hover/card:text-cyan-300 transition-colors truncate">
                    {p.title}
                  </div>
                  <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-full px-2 py-0.5 shrink-0 ml-2">
                    Synopsis →
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedCarousel;

