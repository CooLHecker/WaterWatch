import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container shadow-sm",
  secondary: "border-2 border-secondary text-secondary hover:bg-secondary/10 bg-transparent",
  tertiary: "bg-secondary-container/20 text-primary hover:bg-secondary-container/30",
  danger: "bg-[#ba1a1a] text-white hover:bg-[#93000a] shadow-sm",
  ghost: "text-secondary hover:bg-secondary/10 border border-secondary/30",
};

export function Button({
  variant = "primary",
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
