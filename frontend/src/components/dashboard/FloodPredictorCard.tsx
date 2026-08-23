import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { MetricTile } from "@/components/ui/MetricTile";
import { getLocationRisk } from "@/data/api";
import { formatMinutes, RISK_COLORS } from "@/lib/utils";
import type { LocationRiskAssessment } from "@/types";

const RISK_ORDER = ["low", "moderate", "high", "extreme"] as const;

export function FloodPredictorCard() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocationRiskAssessment | null>(null);

  async function runAssessment(q: string) {
    setLoading(true);
    const res = await getLocationRisk(q);
    setResult(res);
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    runAssessment(query);
  }

  function handleUseLocation() {
    setQuery("Current Location");
    runAssessment("Current Location — Bandra Kurla Complex");
  }

  const activeIndex = result ? RISK_ORDER.indexOf(result.risk) : -1;

  return (
    <Card className="md:col-span-8 col-span-1">
      <CardHeader
        title="Will your area be waterlogged?"
        icon={<Icon name="analytics" className="text-secondary" />}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-on-surface placeholder:text-on-surface-variant text-sm"
              placeholder="Enter location... e.g. Sion, Andheri East"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-grow h-px bg-outline-variant" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
              OR
            </span>
            <div className="flex-grow h-px bg-outline-variant" />
          </div>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            icon={<Icon name="my_location" />}
            onClick={handleUseLocation}
          >
            Use My Current Location
          </Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Assessing…" : "Check Risk"}
          </Button>
        </form>

        <div className="flex-1 bg-surface rounded-lg p-5 border border-outline-variant">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-6">
              <Icon name="water_drop" className="text-4xl mb-2 opacity-40" size={36} />
              <p className="text-sm">Search a location to see its live risk assessment.</p>
            </div>
          )}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant py-6 animate-pulse-soft">
              <Icon name="progress_activity" className="text-4xl mb-2" size={32} />
              <p className="text-sm">Running hydrological assessment…</p>
            </div>
          )}
          {result && !loading && (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                  Risk Assessment · {result.location}
                </span>
                <RiskBadge level={result.risk} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricTile label="Rainfall" value={`${result.rainfallMm} mm`} />
                <MetricTile
                  label="Expected"
                  value={formatMinutes(result.expectedOnsetMinutes)}
                />
                <MetricTile label="Soil Absorption" value={result.soilAbsorption} />
                <MetricTile
                  label="Drainage Cap"
                  value={result.drainageCapacity}
                  tone={result.drainageCapacity === "Low" ? "error" : "default"}
                />
              </div>
              <p className="text-sm text-on-surface-variant bg-secondary/5 p-3 rounded border border-secondary/20 flex gap-2">
                <Icon name="info" className="text-secondary shrink-0 mt-0.5" size={18} />
                {result.note}
              </p>
              <div className="mt-6 flex h-2 rounded-full overflow-hidden">
                {RISK_ORDER.map((level, i) => (
                  <div
                    key={level}
                    className="flex-1"
                    style={{
                      backgroundColor:
                        i <= activeIndex ? RISK_COLORS[level] : "var(--color-surface-container-high)",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Extreme</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
