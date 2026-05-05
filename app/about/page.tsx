import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site-config";
import { stats } from "@/data/trust-badges";
import { trustBadges } from "@/data/trust-badges";
import { TrustIcon } from "@/features/trust/TrustIcon";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.companyName} — ${siteConfig.yearsInBusiness} years of trusted plumbing service in Austin, TX.`,
};

const teamValues = [
  {
    title: "Honesty First",
    description:
      "We diagnose honestly and quote fairly. You&apos;ll never be upsold on services you don&apos;t need.",
  },
  {
    title: "Quality Craftsmanship",
    description:
      "We use professional-grade materials and techniques — because the right fix lasts a lifetime.",
  },
  {
    title: "Respect for Your Home",
    description:
      "We wear shoe covers, use drop cloths, and clean up completely after every job.",
  },
  {
    title: "Continuous Training",
    description:
      "Our technicians are certified and receive ongoing training on the latest plumbing technology.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-950 to-brand-800 pt-36 pb-20 text-white">
        <div className="container-wide text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Austin&apos;s Trusted Plumbers
          </h1>
          <p className="text-lg text-brand-200 max-w-2xl mx-auto leading-relaxed">
            For over {siteConfig.yearsInBusiness} years, {siteConfig.companyName} has been the plumbing company
            Austin homeowners and businesses rely on when it matters most.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-brand-600 py-10">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-brand-200 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <Section background="white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
              Our Mission
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-5 tracking-tight">
              We Treat Every Home Like Our Own
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                {siteConfig.companyName} was founded in {new Date().getFullYear() - siteConfig.yearsInBusiness} with a single goal: provide
                plumbing services that Austin families could genuinely trust. No high-pressure sales,
                no unnecessary repairs, no surprises on the bill.
              </p>
              <p>
                That commitment has never wavered. Today, our team of licensed master plumbers and
                certified technicians handles thousands of jobs each year — from routine maintenance
                to complex emergency repairs — with the same care and honesty we started with.
              </p>
              <p>
                We invest in the best tools and training so that our technicians can solve problems
                efficiently and correctly the first time. Your time and property are valuable, and we
                treat them that way.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {teamValues.map((value) => (
              <div key={value.title} className="rounded-2xl bg-neutral-50 border border-neutral-100 p-5">
                <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center mb-3">
                  <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-900 mb-1 text-sm">{value.title}</h3>
                <p
                  className="text-xs text-neutral-500 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: value.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Trust Badges */}
      <Section background="light">
        <div className="text-center mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Our Credentials
          </p>
          <h2 className="text-3xl font-extrabold text-neutral-900">
            Why Customers Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge) => (
            <div
              key={badge.id}
              className="rounded-2xl bg-white border border-neutral-200/80 shadow-sm p-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mx-auto mb-4">
                <TrustIcon name={badge.icon} className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="brand">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Work with a Team You Can Trust?
          </h2>
          <p className="text-brand-200 mb-8 leading-relaxed">
            Join thousands of Austin homeowners who have made {siteConfig.companyName} their
            go-to plumber.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary">
              <Link href="/contact">Book a Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link href="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
