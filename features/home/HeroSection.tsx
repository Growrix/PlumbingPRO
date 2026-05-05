"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site-config";
import { createPhoneHref } from "@/lib/utils";

const heroContent = {
  eyebrow: "Austin's #1 Rated Plumbing Service",
  headline: "Fast Plumbing Help When You Need It Most",
  subtext:
    "Licensed master plumbers available 24/7. We arrive fast, diagnose accurately, and fix it right — the first time. Upfront pricing. No surprises.",
  primaryCta: { label: "Book a Service", href: "/contact" },
  secondaryCta: { label: "View All Services", href: "/services" },
  trustMarkers: [
    "60-min Emergency Response",
    "4.9★ from 847 Reviews",
    "Satisfaction Guaranteed",
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Glow Effect */}
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 py-32 pt-40">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-400/30 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-sm font-semibold text-brand-200">{heroContent.eyebrow}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6"
          >
            {heroContent.headline}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-brand-200 leading-relaxed mb-10 max-w-2xl"
          >
            {heroContent.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 mb-12"
          >
            <Button size="xl" variant="secondary" className="shadow-lg shadow-accent-500/25">
              <Link href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</Link>
            </Button>
          </motion.div>

          {/* Trust Markers */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {heroContent.trustMarkers.map((marker) => (
              <div key={marker} className="flex items-center gap-2 text-sm text-brand-300">
                <svg className="h-4 w-4 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {marker}
              </div>
            ))}
          </motion.div>

          {/* Emergency Phone */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 backdrop-blur-sm w-fit"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 border border-red-400/30">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-brand-400 font-medium">24/7 Emergency Line</p>
              <a
                href={createPhoneHref(siteConfig.emergencyPhone)}
                className="text-base font-bold text-white hover:text-accent-300 transition-colors"
              >
                {siteConfig.emergencyPhone}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-brand-400 font-medium tracking-wider uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-6 w-4 rounded-full border border-brand-400/40 flex items-start justify-center pt-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-brand-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
