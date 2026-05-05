"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site-config";
import { navItems } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { createPhoneHref } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100"
          : "bg-transparent"
      )}
    >
      <div className="container-wide">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
            </div>
            <span
              className={cn(
                "text-lg font-bold tracking-tight transition-colors",
                isScrolled ? "text-neutral-900" : "text-white"
              )}
            >
              {siteConfig.companyName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "text-brand-600 bg-brand-50"
                    : isScrolled
                    ? "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={createPhoneHref(siteConfig.phone)}
              className={cn(
                "text-sm font-semibold transition-colors",
                isScrolled ? "text-neutral-700 hover:text-brand-600" : "text-white/90 hover:text-white"
              )}
            >
              {siteConfig.phone}
            </a>
            <Button size="md" variant="secondary" asChild>
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "text-neutral-700 hover:bg-neutral-100" : "text-white hover:bg-white/10"
            )}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-neutral-100 shadow-lg"
          >
            <div className="container-wide py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-brand-600 bg-brand-50"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
                <a
                  href={createPhoneHref(siteConfig.phone)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-50 text-sm font-semibold text-neutral-700"
                >
                  <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {siteConfig.phone}
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-colors"
                >
                  Book a Service
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
