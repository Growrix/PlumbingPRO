"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { getPricingLabel } from "@/lib/utils";
import { ServiceIcon } from "@/features/services/ServiceIcon";

const sectionMeta = {
  eyebrow: "What We Do",
  title: "Complete Plumbing Solutions",
  subtitle:
    "From urgent emergencies to planned upgrades, our licensed technicians handle every plumbing need with precision and care.",
};

export function ServicesPreview() {
  return (
    <Section background="light">
      <SectionHeading
        eyebrow={sectionMeta.eyebrow}
        title={sectionMeta.title}
        subtitle={sectionMeta.subtitle}
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <Link href={`/services/${service.slug}`} className="block h-full group">
              <Card hover padding="lg" className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 dark:group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <ServiceIcon name={service.icon} className="h-6 w-6" />
                  </div>
                  <Badge variant={service.pricingTier === "premium" ? "warning" : service.pricingTier === "standard" ? "info" : "success"}>
                    {getPricingLabel(service.pricingTier)}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1">
                  {service.shortDescription}
                </p>

                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{service.priceRange}</span>
                  <span className="text-sm text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950">
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    </Section>
  );
}
