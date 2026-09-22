import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  className = "h-14 sm:h-16 md:h-20 w-auto object-contain",
  width = 300,
  height = 162,
  priority = false,
}: LogoProps) {
  return (
    <span className="relative inline-flex items-center">
      {/* Light mode logo (crisp dark slate ink on transparent background) */}
      <Image
        src="/images/logo-light.png"
        alt="Derivative Genius Logo"
        width={width}
        height={height}
        priority={priority}
        className={`dark:hidden ${className}`}
      />
      {/* Dark mode logo (crisp white/silver ink on transparent background) */}
      <Image
        src="/images/logo-dark.png"
        alt="Derivative Genius Logo"
        width={width}
        height={height}
        priority={priority}
        className={`hidden dark:block ${className}`}
      />
    </span>
  );
}
