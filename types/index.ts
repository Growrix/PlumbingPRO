export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  pricingTier: "basic" | "standard" | "premium";
  priceRange: string;
  estimatedTime: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  service: string;
  date: string;
  avatarInitials: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  message: string;
}

export interface SiteConfig {
  companyName: string;
  tagline: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  city: string;
  licenseNumber: string;
  yearsInBusiness: number;
  rating: number;
  reviewCount: number;
}

export interface StatItem {
  value: string;
  label: string;
}
