import type { StreetForecast } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Icon } from "@/components/ui/Icon";
import { formatMinutes } from "@/lib/utils";

interface StreetTableProps {
  streets: StreetForecast[];
  onSelect: (street: StreetForecast) => void;
  selectedId?: string;
}

export function StreetTable({ streets, onSelect, selectedId }: StreetTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant border-b border-outline-variant">
              <th className="py-3 pr-4">Street</th>
              <th className="py-3 pr-4">Current</th>
              <th className="py-3 pr-4">Peak</th>
              <th className="py-3 pr-4">Time to Flood</th>
              <th className="py-3 pr-4">Severity</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {streets.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelect(s)}
                className={`border-b border-outline-variant/60 cursor-pointer transition-colors ${
                  selectedId === s.id ? "bg-secondary/5" : "hover:bg-surface-container-low"
                }`}
              >
                <td className="py-3 pr-4">
                  <div className="font-semibold text-primary">{s.name}</div>
                  <div className="text-xs text-on-surface-variant flex items-center gap-1">
                    <Icon name="location_on" size={13} />
                    {s.area}
                  </div>
                </td>
                <td className="py-3 pr-4 font-data">{s.currentDepthCm} cm</td>
                <td className="py-3 pr-4 font-data">{s.peakDepthCm} cm</td>
                <td className="py-3 pr-4 font-data">
                  {s.timeToFloodMinutes !== null ? formatMinutes(s.timeToFloodMinutes) : "—"}
                </td>
                <td className="py-3 pr-4">
                  <RiskBadge level={s.severity} size="sm" />
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={
                      s.status === "Critical"
                        ? "text-error font-semibold text-xs"
                        : s.status === "Watch"
                        ? "text-[#c2410c] font-semibold text-xs"
                        : "text-risk-low font-semibold text-xs"
                    }
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {streets.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedId === s.id
                ? "border-secondary bg-secondary/5"
                : "border-outline-variant bg-surface-container-low"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-primary text-sm">{s.name}</div>
                <div className="text-xs text-on-surface-variant">{s.area}</div>
              </div>
              <RiskBadge level={s.severity} size="sm" />
            </div>
            <div className="flex gap-4 text-xs font-data text-on-surface-variant">
              <span>Now: {s.currentDepthCm}cm</span>
              <span>Peak: {s.peakDepthCm}cm</span>
              <span>
                TTF: {s.timeToFloodMinutes !== null ? formatMinutes(s.timeToFloodMinutes) : "—"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
