"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/Heading";
import { trustBadges } from "@/data/trust-badges";
import { TrustIcon } from "@/features/trust/TrustIcon";

const sectionMeta = {
  eyebrow: "Why Choose Us",
  title: "Built on Trust, Backed by Results",
  subtitle:
    "We don't just fix plumbing — we build lasting relationships with homeowners and businesses who deserve reliable, honest service.",
};

export function TrustSection() {
  return (
    <Section background="white">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div>
          <SectionHeading
            eyebrow={sectionMeta.eyebrow}
            title={sectionMeta.title}
            subtitle={sectionMeta.subtitle}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-3 p-4 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <TrustIcon name={badge.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">{badge.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-8 text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-brand-600/40 translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent-500/20 -translate-x-8 translate-y-8" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-accent-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">4.9 / 5.0</p>
                  <p className="text-sm text-brand-300">Based on 847 reviews</p>
                </div>
              </div>

              {[
                { label: "On-time arrival", pct: 98 },
                { label: "First-visit fix rate", pct: 94 },
                { label: "Customer satisfaction", pct: 99 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-brand-200">{item.label}</span>
                    <span className="font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-accent-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 text-sm text-brand-300">
                <p>License #{" "}<span className="text-white font-medium">TX-PLB-2024-88341</span></p>
                <p className="mt-1">Fully insured · Background checked · Drug tested</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
