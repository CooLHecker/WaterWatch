import type { RiskLevel } from "@/types";
import { RISK_COLORS, RISK_LABELS, cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Small uppercase pill: background from the risk palette at 15% opacity,
 * text at full opacity, per DESIGN.md "Risk Badges" spec.
 */
export function RiskBadge({ level, className, size = "md" }: RiskBadgeProps) {
  const color = RISK_COLORS[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]",
        className
      )}
      style={{ backgroundColor: `${color}26`, color }}
    >
      {RISK_LABELS[level]}
    </span>
  );
}
