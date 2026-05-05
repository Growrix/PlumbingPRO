import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { services, getServiceBySlug } from "@/data/services";
import { ServiceIcon } from "@/features/services/ServiceIcon";
import { getPricingLabel, getPricingColor } from "@/lib/utils";
import { siteConfig } from "@/data/site-config";
import { createPhoneHref } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const relatedServices = services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-950 to-brand-800 pt-36 pb-20 text-white">
        <div className="container-wide">
          <div className="flex items-center gap-2 mb-6 text-sm text-brand-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white">{service.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <ServiceIcon name={service.icon} className="h-7 w-7 text-white" />
                </div>
                <Badge
                  variant={service.pricingTier === "premium" ? "warning" : service.pricingTier === "standard" ? "info" : "success"}
                >
                  {getPricingLabel(service.pricingTier)} Service
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {service.title}
              </h1>
              <p className="text-lg text-brand-200 leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="shadow-lg shadow-accent-500/25">
                  <Link href="/contact">Book This Service</Link>
                </Button>
                <a
                  href={createPhoneHref(siteConfig.phone)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white text-base font-semibold hover:bg-white/10 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-brand-300 mb-1">Price Range</p>
                  <p className="text-lg font-bold text-white">{service.priceRange}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-brand-300 mb-1">Est. Duration</p>
                  <p className="text-lg font-bold text-white">{service.estimatedTime}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-semibold text-brand-200 mb-3">What&apos;s Included:</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white">
                      <svg className="h-4 w-4 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <Section background="light">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 mb-2">More Services</p>
          <h2 className="text-2xl font-bold text-neutral-900">Other Services We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {relatedServices.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`} className="group block">
              <Card hover padding="md" className="h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">{s.title}</h3>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.shortDescription}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-brand-600 text-brand-600 hover:bg-brand-50">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
