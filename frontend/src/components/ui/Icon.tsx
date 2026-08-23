import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

/** Renders a Google Material Symbols Outlined glyph by name. */
export function Icon({ name, className, filled = false, size }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined leading-none select-none", className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}`,
        fontSize: size ? `${size}px` : undefined,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
