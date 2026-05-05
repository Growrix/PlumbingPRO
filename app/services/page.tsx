import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { services } from "@/data/services";
import { ServiceIcon } from "@/features/services/ServiceIcon";
import { getPricingLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Browse our full range of professional plumbing services. Emergency repairs, drain cleaning, water heaters, pipe repair, and more.",
};

const pageContent = {
  eyebrow: "Everything We Offer",
  title: "Professional Plumbing Services",
  subtitle:
    "From emergency response to routine maintenance, our licensed team handles every plumbing challenge with expertise and care.",
};

export default function ServicesPage() {
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-brand-950 to-brand-800 pt-36 pb-20 text-white">
        <div className="container-wide text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
            {pageContent.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {pageContent.title}
          </h1>
          <p className="text-lg text-brand-200 max-w-2xl mx-auto leading-relaxed">
            {pageContent.subtitle}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <Section background="light">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block h-full"
            >
              <Card hover padding="lg" className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <ServiceIcon name={service.icon} className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant={
                        service.pricingTier === "premium"
                          ? "warning"
                          : service.pricingTier === "standard"
                          ? "info"
                          : "success"
                      }
                    >
                      {getPricingLabel(service.pricingTier)}
                    </Badge>
                    <span className="text-xs text-neutral-400 font-medium bg-neutral-100 px-2 py-0.5 rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {service.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed flex-1 mb-5">
                  {service.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">Price Range</p>
                    <p className="text-sm font-semibold text-neutral-800">{service.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">Est. Time</p>
                    <p className="text-sm font-semibold text-neutral-800">{service.estimatedTime}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
