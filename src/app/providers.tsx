"use client";

import React from "react";
import { Toaster } from "sonner";

// Lightweight client-side theme initializer.
// Sets the `dark` class on <html> on mount to match previous defaultTheme="dark" behavior
// Avoids importing `next-themes` which can inject <script> tags during render.
export function Providers({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    try {
      document.documentElement.classList.add("dark");
    } catch (e) {
      // ignore in non-browser env
    }
  }, []);

  return (
    <>
      {children}
      <Toaster position="top-right" theme="dark" />
    </>
  );
}
