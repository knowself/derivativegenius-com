import React from "react";

export function CenturionIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Centurion Console"
    >
      {/* Transverse Crest / Plume */}
      <path
        d="M3 4.5C3.5 2.5 8 2 12 2C16 2 20.5 2.5 21 4.5C21 6.5 17 7.5 12 7.5C7 7.5 3 6.5 3 4.5Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M5 4.5C8.5 3.5 15.5 3.5 19 4.5" stroke="currentColor" strokeWidth="1.2" />
      {/* Helmet Skull / Cap */}
      <path
        d="M6 7.5C6 5.5 8.5 5 12 5C15.5 5 18 5.5 18 7.5V13C18 16 15.5 18.5 12 18.5C8.5 18.5 6 16 6 13V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Brow Guard */}
      <path d="M5 9.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eye Aperture / Visor slot */}
      <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cheek Guards */}
      <path d="M7 13.5L5.5 17.5C5.2 18.3 5.8 19 6.6 19H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 13.5L18.5 17.5C18.8 18.3 18.2 19 17.4 19H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
