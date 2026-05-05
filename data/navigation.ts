import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Emergency Repairs", href: "/services/emergency-repairs" },
      { label: "Drain Cleaning", href: "/services/drain-cleaning" },
      { label: "Water Heaters", href: "/services/water-heaters" },
      { label: "Pipe Repair", href: "/services/pipe-repair" },
      { label: "Bathroom Fixtures", href: "/services/bathroom-fixtures" },
      { label: "Leak Detection", href: "/services/leak-detection" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
