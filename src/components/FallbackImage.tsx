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
    if (!t.dataset.fallback) {
      t.dataset.fallback = '1';
      t.src = '/images/portfolio/placeholder.svg';
    }
  };

  return <img src={src} alt={alt} className={className} onError={handleError} />;
}
