import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  padding?: boolean;
}

export function Card({ children, className, lift = true, padding = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1",
        lift && "hover-lift",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  divider?: boolean;
}

export function CardHeader({ title, subtitle, icon, className, divider = true }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-start gap-4",
        divider && "border-b border-outline-variant pb-4 mb-6",
        className
      )}
    >
      <div>
        <h2 className="font-display font-semibold text-primary text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>}
      </div>
      {icon}
    </div>
  );
}
