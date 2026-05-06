"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site-config";
import { createPhoneHref } from "@/lib/utils";

const heroContent = {
  eyebrow: "Austin's #1 Rated Plumbing Service",
  headline: "Expert Plumbing, When You Need It Most",
  subtext:
    "Licensed master plumbers on call 24/7. We arrive fast, diagnose accurately, and fix it right — the first time. Upfront pricing. Zero surprises.",
  primaryCta: { label: "Book a Service", href: "/contact" },
  secondaryCta: { label: "View Services", href: "/services" },
  trustMarkers: [
    "60-min Emergency Response",
    "4.9★ from 847 Reviews",
    "Satisfaction Guaranteed",
  ],
  stats: [
    { value: "18+", label: "Years Experience" },
    { value: "15k+", label: "Jobs Done" },
    { value: "24/7", label: "Availability" },
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 dark:from-neutral-950 dark:via-brand-950 dark:to-neutral-900">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Ambient glows */}
      <div className="absolute -top-52 -right-52 h-[700px] w-[700px] rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-52 -left-52 h-[600px] w-[600px] rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-brand-400/5 blur-3xl" aria-hidden="true" />

      {/* Main 2-column content */}
      <div className="container-wide relative z-10 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT COLUMN: Text ── */}
          <div>
            {/* Eyebrow */}
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/10 border border-white/20 px-4 py-2 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-sm font-semibold text-brand-200">{heroContent.eyebrow}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
            >
              {heroContent.headline.split(",").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <>,<br /></>
                  )}
                </span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg text-brand-200/90 leading-relaxed mb-9 max-w-lg"
            >
              {heroContent.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap gap-3 mb-10"
            >
              <Button size="xl" variant="secondary" className="shadow-xl shadow-accent-500/30 hover:scale-105 transition-transform">
                <Link href={heroContent.primaryCta.href} className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  {heroContent.primaryCta.label}
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-transform">
                <Link href={heroContent.secondaryCta.href} className="flex items-center gap-2">
                  {heroContent.secondaryCta.label}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </Button>
            </motion.div>

            {/* Trust markers */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap gap-x-6 gap-y-3 mb-10"
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

            {/* Emergency line */}
            <motion.a
              custom={5} variants={fadeUp} initial="hidden" animate="visible"
              href={createPhoneHref(siteConfig.emergencyPhone)}
              className="inline-flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 backdrop-blur-sm hover:bg-white/10 transition-colors w-fit"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 border border-red-400/30">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-400 font-medium">24/7 Emergency Line</p>
                <p className="text-base font-bold text-white">{siteConfig.emergencyPhone}</p>
              </div>
            </motion.a>
          </div>

          {/* ── RIGHT COLUMN: Visual card panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-5"
          >
            {/* Main card */}
            <div className="relative rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md p-8 overflow-hidden">
              {/* Decorative orb */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-400/20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-accent-500/15 blur-2xl" />

              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-300 mb-6">Live Performance</p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-7">
                  {heroContent.stats.map((stat) => (
                    <div key={stat.label} className="text-center rounded-2xl bg-white/10 py-4 px-2">
                      <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                      <p className="text-xs text-brand-300 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Metric bars */}
                <div className="space-y-4">
                  {[
                    { label: "On-time Arrival", pct: 98, color: "bg-accent-400" },
                    { label: "First-Visit Fix Rate", pct: 94, color: "bg-brand-400" },
                    { label: "Customer Satisfaction", pct: 99, color: "bg-emerald-400" },
                  ].map((item, i) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-brand-200">{item.label}</span>
                        <span className="font-bold text-white">{item.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <motion.div
                          className={`h-full rounded-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.8 + i * 0.15, duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two mini cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Rating card */}
              <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl font-extrabold text-white">4.9</p>
                <p className="text-xs text-brand-300 mt-0.5">847 verified reviews</p>
              </div>

              {/* Response card */}
              <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-500/20 mb-2">
                  <svg className="h-4 w-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 6.75 14.25 10.5l5.25-5.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.5H19.5V5.25" />
                  </svg>
                </div>
                <p className="text-2xl font-extrabold text-white">60 min</p>
                <p className="text-xs text-brand-300 mt-0.5">Avg. response time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-7 w-4 rounded-full border border-brand-400/40 flex items-start justify-center pt-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-brand-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
