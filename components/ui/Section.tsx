import { cn } from "@/lib/utils";

type SectionBackground = "white" | "light" | "dark" | "brand";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: SectionBackground;
  id?: string;
}

const backgroundClasses: Record<SectionBackground, string> = {
  white: "bg-white",
  light: "bg-neutral-50",
  dark: "bg-neutral-900 text-white",
  brand: "bg-brand-900 text-white",
};

export function Section({
  children,
  className,
  background = "white",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("section-pad", backgroundClasses[background], className)}
    >
      <div className="container-wide">{children}</div>
    </section>
  );
}
