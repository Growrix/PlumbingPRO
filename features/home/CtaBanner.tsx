"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site-config";
import { createPhoneHref } from "@/lib/utils";

const ctaContent = {
  headline: "Ready to Get Your Plumbing Fixed?",
  subtext:
    "Don't wait for a small leak to become a big problem. Our team is standing by — call now or book online in under 2 minutes.",
  primaryCta: { label: "Book a Service Online", href: "/contact" },
  secondaryCta: "Or call us now:",
};

export function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-20">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {ctaContent.headline}
          </h2>
          <p className="text-lg text-brand-200 mb-10 leading-relaxed">
            {ctaContent.subtext}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="secondary" className="w-full sm:w-auto shadow-lg shadow-black/20">
              <Link href={ctaContent.primaryCta.href}>{ctaContent.primaryCta.label}</Link>
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-brand-300 text-sm">{ctaContent.secondaryCta}</span>
              <a
                href={createPhoneHref(siteConfig.phone)}
                className="text-white font-bold text-lg hover:text-accent-300 transition-colors"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
