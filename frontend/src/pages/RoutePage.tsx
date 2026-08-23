import { useState } from "react";
import { Polyline } from "react-leaflet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BaseMap } from "@/components/map/BaseMap";
import { RouteComparison } from "@/components/route/RouteComparison";
import { getSafeRoute } from "@/data/api";
import type { RouteOption } from "@/types";

const RISK_LIMIT_OPTIONS = [
  { id: "commuter", label: "General Commuter", desc: "Standard route, avoids high & extreme risk roads." },
  { id: "emergency", label: "Emergency Vehicle", desc: "Stricter limits — avoids anything above low risk." },
];

export function RoutePage() {
  const [origin, setOrigin] = useState("Bandra Kurla Complex");
  const [destination, setDestination] = useState("Lower Parel");
  const [profile, setProfile] = useState("commuter");
  const [options, setOptions] = useState<RouteOption[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const plan = await getSafeRoute(origin, destination);
    setOptions(plan.options);
    const safest = plan.options.find((r) => r.status === "Safe") ?? plan.options[0];
    setSelectedId(safest.id);
    setLoading(false);
  }

  const selected = options?.find((r) => r.id === selectedId);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary">Flood-Safe Routing</h1>
        <p className="text-on-surface-variant mt-2">
          Navigate avoiding high-risk zones and waterlogged streets.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Card>
          <h2 className="font-display text-xl font-bold text-primary mb-6">Plan Your Route</h2>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-secondary bg-surface" />
              <div className="absolute left-[19px] top-[28px] w-[2px] h-6 bg-outline-variant" />
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-sm"
                placeholder="Start Location"
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-error" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-sm"
                placeholder="Destination"
              />
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
                Routing Profile
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RISK_LIMIT_OPTIONS.map((opt) => (
                  <label key={opt.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="profile"
                      className="peer sr-only"
                      checked={profile === opt.id}
                      onChange={() => setProfile(opt.id)}
                    />
                    <div className="p-3 rounded-lg border border-outline-variant peer-checked:border-secondary peer-checked:bg-secondary/10 transition-all h-full">
                      <div className="text-sm font-bold text-primary">{opt.label}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" fullWidth icon={<Icon name="route" />} disabled={loading}>
              {loading ? "Calculating…" : "Calculate Safe Route"}
            </Button>
          </form>

          {options && (
            <div className="mt-6">
              <RouteComparison options={options} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          )}
        </Card>

        <Card padding={false} className="overflow-hidden relative min-h-[400px]">
          <BaseMap zoom={12}>
            {options?.map((r) => (
              <Polyline
                key={r.id}
                positions={r.path}
                pathOptions={{
                  color: r.status === "Unsafe" ? "#ef4444" : "#00d2fd",
                  weight: r.id === selectedId ? 6 : 3,
                  opacity: r.id === selectedId ? 1 : 0.5,
                  dashArray: r.status === "Unsafe" ? "6 4" : undefined,
                }}
              />
            ))}
          </BaseMap>
          {selected && (
            <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-data text-primary shadow z-[500]">
              ETA: {selected.etaMinutes} MINS · {selected.distanceKm} KM
            </div>
          )}
          {!options && (
            <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm px-6 text-center bg-surface-container/60">
              Enter a start and destination, then calculate a route to see it plotted here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
