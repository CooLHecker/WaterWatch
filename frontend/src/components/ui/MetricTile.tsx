import { cn } from "@/lib/utils";

interface MetricTileProps {
  label: string;
  value: string;
  tone?: "default" | "error" | "secondary";
}

export function MetricTile({ label, value, tone = "default" }: MetricTileProps) {
  return (
    <div className="bg-surface-container-low p-3 rounded-md border border-outline-variant/50">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
        {label}
      </div>
      <div
        className={cn(
          "font-data text-sm",
          tone === "error" && "text-error",
          tone === "secondary" && "text-secondary",
          tone === "default" && "text-primary"
        )}
      >
        {value}
      </div>
    </div>
  );
}

interface DataTagProps {
  children: string;
  className?: string;
}

/** Small monospace tag for sensor IDs, lat/long, rainfall volume. */
export function DataTag({ children, className }: DataTagProps) {
  return (
    <span
      className={cn(
        "font-data text-xs bg-surface-container px-2 py-1 rounded text-on-surface-variant inline-block",
        className
      )}
    >
      {children}
    </span>
  );
}
