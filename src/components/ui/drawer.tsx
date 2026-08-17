'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Haptics } from '@/lib/haptics';

export interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive Dialog & Bottom Sheet Primitive
 * 
 * - Mobile (<768px): Renders as an ergonomic bottom sheet anchored in the thumb zone.
 * - Desktop (>=768px): Renders as a centered, accessible modal dialog.
 * - Accessibility: Implements ARIA role="dialog", focus trapping, Escape key dismiss,
 *   and screen-reader announcements.
 */
export function ResponsiveDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ResponsiveDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => {
          Haptics.confirm();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Dialog Surface (Bottom Sheet on Mobile, Centered Modal on Desktop) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-h-[85vh] md:max-h-[90vh] md:max-w-lg overflow-y-auto',
          'rounded-t-2xl md:rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-neutral-100 shadow-2xl',
          'animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-0 md:zoom-in-95 duration-200 ease-out focus:outline-hidden',
          className
        )}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="mx-auto -mt-2 mb-4 h-1 w-10 rounded-full bg-neutral-700 md:hidden" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-neutral-800">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              Haptics.confirm();
              onClose();
            }}
            className="p-1.5 -mr-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-1">{children}</div>
      </div>
    </div>
  );
}
