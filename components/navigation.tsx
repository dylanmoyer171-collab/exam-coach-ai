"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Diagnostic", href: "/diagnostic" },
    { label: "SAT", href: "/sat" },
    { label: "ACT", href: "/act" },
    { label: "AP Exams", href: "/ap" },
    { label: "Study Plan", href: "/study-plan" },
    { label: "Resources", href: "/resources" },
    { label: "Feedback", href: "/feedback" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white hover:text-cyan-300 transition"
        >
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 ring-1 ring-cyan-500/40 flex items-center justify-center">
            <span className="text-cyan-300 font-bold">E</span>
          </div>
          <span className="hidden sm:inline">Exam Coach AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-slate-300 hover:text-white transition"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/90">
          <div className="flex flex-col gap-2 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
