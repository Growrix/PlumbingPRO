import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ className, children, hover = false, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 shadow-sm dark:shadow-neutral-900/40",
        hover &&
          "transition-all duration-300 hover:shadow-lg dark:hover:shadow-neutral-900/60 hover:-translate-y-1 cursor-pointer",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-700", className)}>
      {children}
    </div>
  );
}
