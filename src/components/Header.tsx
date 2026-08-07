"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "AI Web Services" },
    { href: "/solutions", label: "Solutions" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Get Scoped" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* 150% Bigger Logo */}
        <Link href="/" className="flex items-center group py-1">
          <div className="relative h-14 sm:h-16 md:h-20 w-auto flex items-center">
            <Image
              src="/images/DG-AAA.png"
              alt="Derivative Genius Logo"
              width={300}
              height={205}
              priority
              className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 lg:space-x-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm sm:text-base font-medium transition-colors hover:text-blue-400 ${
                  isActive ? "text-blue-400 font-semibold" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Build Project</span>
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pb-6 pt-3 md:hidden backdrop-blur-2xl">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-200 hover:text-blue-400 py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex justify-center rounded-xl bg-blue-600 py-3 text-center text-base font-semibold text-white shadow-lg"
            >
              Build Project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
