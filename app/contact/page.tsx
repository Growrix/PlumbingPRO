import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/ContactForm";
import { siteConfig } from "@/data/site-config";
import { createPhoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & Book a Service",
  description:
    "Schedule a plumbing service or get in touch with our team. Fast response, upfront pricing.",
};

const contactMethods = [
  {
    icon: "phone",
    label: "Call or Text",
    value: siteConfig.phone,
    href: siteConfig.phone,
    note: "Mon–Sat 7am–8pm",
  },
  {
    icon: "emergency",
    label: "24/7 Emergency",
    value: siteConfig.emergencyPhone,
    href: siteConfig.emergencyPhone,
    note: "Always available",
  },
  {
    icon: "email",
    label: "Email Us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    note: "Reply within 2 hours",
  },
  {
    icon: "location",
    label: "Service Area",
    value: "Greater Austin Metro",
    href: "",
    note: siteConfig.city,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-950 to-brand-800 pt-36 pb-20 text-white">
        <div className="container-wide text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Book a Service
          </h1>
          <p className="text-lg text-brand-200 max-w-xl mx-auto leading-relaxed">
            Fill out the form and a member of our team will confirm your appointment within 30 minutes.
          </p>
        </div>
      </div>

      <div className="bg-neutral-50 py-20">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Contact Information</h2>

              {contactMethods.map((method) => (
                <div
                  key={method.label}
                  className="flex items-start gap-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm p-5"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <ContactMethodIcon type={method.icon} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">{method.label}</p>
                    {method.href ? (
                      <a
                        href={method.icon === "email" ? method.href : createPhoneHref(method.href)}
                        className="text-base font-semibold text-neutral-900 hover:text-brand-600 transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-neutral-900">{method.value}</p>
                    )}
                    <p className="text-xs text-neutral-500 mt-0.5">{method.note}</p>
                  </div>
                </div>
              ))}

              {/* Guarantee box */}
              <div className="rounded-2xl bg-brand-600 p-6 text-white mt-6">
                <h3 className="font-bold mb-2">Our Promise to You</h3>
                <ul className="space-y-2 text-sm text-brand-200">
                  {[
                    "Upfront pricing before any work begins",
                    "No overtime charges on weekends",
                    "100% satisfaction guarantee",
                    "Clean worksite — we clean up after every job",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactMethodIcon({ type }: { type: string }) {
  if (type === "phone" || type === "emergency")
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    );
  if (type === "email")
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    );
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}
