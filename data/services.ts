import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "1",
    slug: "emergency-repairs",
    title: "Emergency Repairs",
    shortDescription:
      "24/7 rapid response for burst pipes, floods, and urgent plumbing failures.",
    description:
      "When plumbing emergencies strike, every minute counts. Our certified technicians are on call around the clock — 365 days a year — to respond to burst pipes, major leaks, sewer backups, and any urgent failure that threatens your home or business. We arrive fast, diagnose precisely, and fix it right the first time.",
    icon: "zap",
    features: [
      "24/7 availability including holidays",
      "60-minute average response time",
      "Fully stocked service vehicles",
      "Certified master plumbers on call",
      "Same-visit repairs in most cases",
      "Post-repair inspection included",
    ],
    pricingTier: "premium",
    priceRange: "$150–$500+",
    estimatedTime: "1–3 hours",
    category: "Emergency",
  },
  {
    id: "2",
    slug: "drain-cleaning",
    title: "Drain Cleaning",
    shortDescription:
      "Professional hydro-jetting and snaking to clear any clog fast.",
    description:
      "Slow drains and blockages are more than an inconvenience — they can signal deeper issues in your plumbing system. We use professional-grade hydro-jetting equipment and advanced camera inspection to clear kitchen, bathroom, and main line drains completely, not just partially.",
    icon: "droplets",
    features: [
      "Hydro-jet and snake methods",
      "Camera inspection available",
      "Kitchen and bathroom drains",
      "Main sewer line cleaning",
      "Preventive maintenance plans",
      "No-dig solutions when possible",
    ],
    pricingTier: "standard",
    priceRange: "$99–$350",
    estimatedTime: "1–2 hours",
    category: "Maintenance",
  },
  {
    id: "3",
    slug: "water-heaters",
    title: "Water Heater Services",
    shortDescription:
      "Installation, repair, and replacement for all water heater types.",
    description:
      "From traditional tank units to modern tankless systems, we handle every aspect of water heater service. Whether your unit is leaking, not heating, or simply aging out, our experts will give you an honest assessment and efficient solution — with energy-efficient upgrades available.",
    icon: "flame",
    features: [
      "Tank and tankless installation",
      "All major brands serviced",
      "Energy-efficient upgrades",
      "Same-day replacement available",
      "10-year warranty on new units",
      "Annual maintenance programs",
    ],
    pricingTier: "standard",
    priceRange: "$200–$1,800",
    estimatedTime: "2–4 hours",
    category: "Installation",
  },
  {
    id: "4",
    slug: "pipe-repair",
    title: "Pipe Repair & Replacement",
    shortDescription:
      "Trenchless and traditional pipe repair for all pipe materials.",
    description:
      "Damaged, corroded, or burst pipes can cause extensive property damage if not addressed quickly. We offer trenchless pipe lining and traditional pipe replacement using high-quality materials. Our diagnostic tools locate the problem without unnecessary excavation, saving you time and money.",
    icon: "wrench",
    features: [
      "Trenchless pipe lining",
      "Copper, PVC, and PEX repairs",
      "Full pipe replacement",
      "Leak detection technology",
      "Minimal property disruption",
      "Lifetime workmanship warranty",
    ],
    pricingTier: "premium",
    priceRange: "$300–$3,000+",
    estimatedTime: "2–8 hours",
    category: "Repair",
  },
  {
    id: "5",
    slug: "bathroom-fixtures",
    title: "Bathroom Fixtures",
    shortDescription:
      "Expert installation and repair of toilets, sinks, showers, and faucets.",
    description:
      "Upgrade your bathroom or fix persistent issues with professional fixture installation and repair. We work with all fixture brands and styles, ensuring proper installation, watertight connections, and code-compliant work. From a dripping faucet to a full bathroom renovation, we handle it all.",
    icon: "bath",
    features: [
      "Toilet installation and repair",
      "Faucet and sink services",
      "Shower and tub installation",
      "All fixture brands supported",
      "Code-compliant work guaranteed",
      "Clean-up included after every job",
    ],
    pricingTier: "basic",
    priceRange: "$75–$600",
    estimatedTime: "1–4 hours",
    category: "Installation",
  },
  {
    id: "6",
    slug: "leak-detection",
    title: "Leak Detection",
    shortDescription:
      "Advanced technology to find hidden leaks before they cause damage.",
    description:
      "Hidden leaks can waste thousands of gallons of water and cause serious structural damage before they become visible. Our non-invasive leak detection technology — including acoustic sensors and thermal imaging — pinpoints leaks behind walls, under slabs, and underground with pinpoint accuracy.",
    icon: "search",
    features: [
      "Acoustic leak detection",
      "Thermal imaging technology",
      "Slab leak specialists",
      "Underground line detection",
      "Non-invasive methods first",
      "Detailed report provided",
    ],
    pricingTier: "standard",
    priceRange: "$150–$400",
    estimatedTime: "1–3 hours",
    category: "Diagnostic",
  },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const getFeaturedServices = (count = 3): Service[] =>
  services.slice(0, count);
