import type { RouteOption } from "@/types";
import { Icon } from "@/components/ui/Icon";

interface RouteComparisonProps {
  options: RouteOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const STATUS_STYLES: Record<RouteOption["status"], { text: string; bg: string; icon: string }> = {
  Safe: { text: "text-risk-low", bg: "bg-risk-low/10 border-risk-low/30", icon: "check_circle" },
  Caution: { text: "text-[#c2410c]", bg: "bg-risk-moderate/10 border-risk-moderate/30", icon: "warning" },
  Unsafe: { text: "text-error", bg: "bg-error/10 border-error/30", icon: "dangerous" },
};

export function RouteComparison({ options, selectedId, onSelect }: RouteComparisonProps) {
  return (
    <div className="space-y-3">
      {options.map((r) => {
        const style = STATUS_STYLES[r.status];
        const active = selectedId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              active ? "border-secondary ring-2 ring-secondary/30" : style.bg
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-primary text-sm">{r.label}</div>
              <span className={`flex items-center gap-1 text-xs font-bold ${style.text}`}>
                <Icon name={style.icon} size={16} />
                {r.status}
              </span>
            </div>
            <div className="flex gap-4 text-xs font-data text-on-surface-variant">
              <span>{r.distanceKm} km</span>
              <span>{r.etaMinutes} min ETA</span>
              <span>Peak depth: {r.peakFloodDepthCm} cm</span>
            </div>
            {r.warning && r.status === "Unsafe" && (
              <p className="text-xs text-error mt-2 leading-snug">{r.warning}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
