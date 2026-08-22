"use client";

import React from 'react';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function FallbackImage({ src, alt, className }: Props) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const t = e.currentTarget as HTMLImageElement;
    if (!t.dataset.fallbackStep) {
      t.dataset.fallbackStep = '1';
      if (t.src.endsWith('.png')) {
        t.src = t.src.replace(/\.png$/, '.svg');
        return;
      }
    }
    if (t.dataset.fallbackStep === '1') {
      t.dataset.fallbackStep = '2';
      t.src = '/images/portfolio/placeholder.svg';
    }
  };

  return <img src={src} alt={alt} className={className} onError={handleError} />;
}
