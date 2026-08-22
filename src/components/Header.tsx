"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, Menu, UserPlus, X } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { CenturionIcon } from "@/components/CenturionIcon";


export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "AI Web Services" },
    { href: "/portfolio", label: "Centurions Portfolio" },
    { href: "/solutions", label: "Solutions" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
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

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                title="Sign in"
                aria-label="Sign in"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-transparent text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-blue-400"
              >
                <LogIn className="h-5 w-5" aria-hidden="true" />
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                title="Sign up"
                aria-label="Sign up"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-blue-400"
              >
                <UserPlus className="h-5 w-5" aria-hidden="true" />
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>

          {/* Single Icon-only link to Centurion Console */}
          <Link
            href="/centurion"
            title="Centurion Operator Console"
            aria-label="Centurion Operator Console"
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-all border border-transparent hover:border-emerald-500/20 shrink-0"
          >
            <CenturionIcon className="h-6 w-6" />
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 active:scale-95 transition-all md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pb-6 pt-3 md:hidden backdrop-blur-2xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center min-h-[48px] text-lg font-medium text-slate-200 hover:text-blue-400 active:bg-slate-900/60 px-3 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/centurion"
              onClick={() => setIsOpen(false)}
              title="Centurion Operator Console"
              aria-label="Centurion Operator Console"
              className="flex items-center min-h-[48px] px-3 text-emerald-400 hover:text-emerald-300 transition-all"
            >
              <CenturionIcon className="h-7 w-7" />
            </Link>


            <Show when="signed-out">
              <div className="flex items-center space-x-3 pt-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Sign in"
                    aria-label="Sign in"
                    className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition-colors hover:border-slate-600 hover:text-blue-400"
                  >
                    <LogIn className="h-6 w-6" aria-hidden="true" />
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Sign up"
                    aria-label="Sign up"
                    className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500"
                  >
                    <UserPlus className="h-6 w-6" aria-hidden="true" />
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center space-x-3 py-3 px-3">
                <UserButton />
                <span className="text-base font-medium text-slate-200">Account</span>
              </div>
            </Show>
          </nav>
        </div>
      )}
    </header>
  );
}
