import type { TrustBadge, StatItem } from "@/types";

export const trustBadges: TrustBadge[] = [
  {
    id: "1",
    title: "Licensed & Insured",
    description: "Fully licensed master plumbers with comprehensive liability coverage.",
    icon: "shield-check",
  },
  {
    id: "2",
    title: "Satisfaction Guarantee",
    description: "We make it right — every time. 100% satisfaction or we return for free.",
    icon: "badge-check",
  },
  {
    id: "3",
    title: "Upfront Pricing",
    description: "No hidden fees. You approve the price before any work begins.",
    icon: "receipt",
  },
  {
    id: "4",
    title: "Background Checked",
    description: "Every technician is background-checked and drug tested for your peace of mind.",
    icon: "user-check",
  },
];

export const stats: StatItem[] = [
  { value: "18+", label: "Years in Business" },
  { value: "15,000+", label: "Jobs Completed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "60 min", label: "Avg. Response Time" },
];
