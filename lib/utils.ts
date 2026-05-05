import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function createPhoneHref(phone: string): string {
  return `tel:+1${formatPhoneNumber(phone)}`;
}

export function getPricingColor(tier: "basic" | "standard" | "premium"): string {
  const map = {
    basic: "text-emerald-600 bg-emerald-50",
    standard: "text-brand-700 bg-brand-50",
    premium: "text-accent-600 bg-orange-50",
  };
  return map[tier];
}

export function getPricingLabel(tier: "basic" | "standard" | "premium"): string {
  const map = {
    basic: "Basic",
    standard: "Standard",
    premium: "Premium",
  };
  return map[tier];
}
