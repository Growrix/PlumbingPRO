import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<HeadingSize, string> = {
  xs: "text-base font-semibold",
  sm: "text-lg font-semibold",
  md: "text-xl font-semibold",
  lg: "text-2xl font-bold",
  xl: "text-3xl font-bold",
  "2xl": "text-4xl font-bold",
  "3xl": "text-5xl font-extrabold",
  "4xl": "text-6xl font-extrabold",
};

export function Heading({
  as: Tag = "h2",
  size = "xl",
  className,
  children,
}: HeadingProps) {
  return (
    <Tag className={cn(sizeClasses[size], "leading-tight tracking-tight", className)}>
      {children}
    </Tag>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", centered && "text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-widest",
            light ? "text-brand-300" : "text-brand-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        as="h2"
        size="2xl"
        className={cn(light ? "text-white" : "text-neutral-900")}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed",
            centered && "mx-auto",
            light ? "text-neutral-300" : "text-neutral-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
