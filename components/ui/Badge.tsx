import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "info" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-orange-50 text-orange-700 border border-orange-200",
  info: "bg-brand-50 text-brand-700 border border-brand-200",
  outline: "border border-neutral-300 text-neutral-600 bg-transparent",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
