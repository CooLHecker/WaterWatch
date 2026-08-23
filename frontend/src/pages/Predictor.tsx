import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { ForecastTimeline } from "@/components/predictor/ForecastTimeline";
import { StreetTable } from "@/components/predictor/StreetTable";
import { getStreetForecasts, getLocationRisk } from "@/data/api";
import { formatMinutes } from "@/lib/utils";
import type { StreetForecast, LocationRiskAssessment } from "@/types";

export function Predictor() {
  const [streets, setStreets] = useState<StreetForecast[] | null>(null);
  const [selected, setSelected] = useState<StreetForecast | null>(null);
  const [query, setQuery] = useState("");
  const [assessment, setAssessment] = useState<LocationRiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStreetForecasts().then((data) => {
      setStreets(data);
      setSelected(data[0] ?? null);
    });
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await getLocationRisk(query);
    setAssessment(res);
    const match = streets?.find((s) => s.name.toLowerCase() === res.location.toLowerCase());
    if (match) setSelected(match);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-2">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Flood Predictor</h1>
          <p className="text-on-surface-variant mt-2">
            Advanced 0–3 hour nowcasting and street-level risk assessment.
          </p>
        </div>
      </header>

      <Card>
        <div className="flex flex-col gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-primary">Predict Waterlogging</h2>
            <form onSubmit={handleSearch} className="relative max-w-md flex gap-2">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-on-surface placeholder:text-on-surface-variant text-sm"
                  placeholder="Enter location..."
                />
              </div>
            </form>
            <Button
              type="button"
              onClick={handleSearch}
              className="max-w-md"
              fullWidth
              icon={<Icon name="analytics" />}
              disabled={loading}
            >
              {loading ? "Running…" : "Run Prediction"}
            </Button>
          </div>

          {assessment && (
            <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/50 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                  {assessment.location}
                </div>
                <p className="text-sm text-on-surface-variant max-w-md">{assessment.note}</p>
              </div>
              <RiskBadge level={assessment.risk} />
            </div>
          )}

          {!assessment && !loading && (
            <div className="bg-surface-container-low rounded-lg p-8 text-center text-on-surface-variant border border-outline-variant/50">
              <Icon name="query_stats" className="text-4xl mb-2 opacity-50" size={36} />
              <p>Enter a location to view detailed hydrological forecast.</p>
            </div>
          )}
        </div>
      </Card>

      {selected && (
        <Card>
          <CardHeader
            title={selected.name}
            subtitle={`${selected.area} · 0–3 hour forecast`}
            icon={<RiskBadge level={selected.severity} />}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface-container-low p-3 rounded-md border border-outline-variant/50">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                Current Depth
              </div>
              <div className="font-data text-primary">{selected.currentDepthCm} cm</div>
            </div>
            <div className="bg-surface-container-low p-3 rounded-md border border-outline-variant/50">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                Peak Depth
              </div>
              <div className="font-data text-error">{selected.peakDepthCm} cm</div>
            </div>
            <div className="bg-surface-container-low p-3 rounded-md border border-outline-variant/50">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                Peak Time
              </div>
              <div className="font-data text-primary">+{selected.peakTimeMinutes} min</div>
            </div>
            <div className="bg-surface-container-low p-3 rounded-md border border-outline-variant/50">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
                Time-to-Flood
              </div>
              <div className="font-data text-primary">
                {selected.timeToFloodMinutes !== null
                  ? formatMinutes(selected.timeToFloodMinutes)
                  : "Not expected"}
              </div>
            </div>
          </div>
          <ForecastTimeline forecast={selected.forecast} peakTimeMinutes={selected.peakTimeMinutes} />
        </Card>
      )}

      <Card>
        <CardHeader title="All Tracked Streets" subtitle="Tap a row to view its forecast above." />
        {!streets ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-surface-container-low animate-pulse" />
            ))}
          </div>
        ) : (
          <StreetTable streets={streets} onSelect={setSelected} selectedId={selected?.id} />
        )}
      </Card>
    </div>
  );
}
