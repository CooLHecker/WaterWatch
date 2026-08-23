import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BaseMap } from "@/components/map/BaseMap";
import { Polyline } from "react-leaflet";
import { getSafeRoute } from "@/data/api";
import type { RouteOption } from "@/types";

export function RoutePlannerCard() {
  const [origin, setOrigin] = useState("Bandra Kurla Complex");
  const [destination, setDestination] = useState("Lower Parel");
  const [routes, setRoutes] = useState<RouteOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleAnalyze() {
    setLoading(true);
    const plan = await getSafeRoute(origin, destination);
    setRoutes(plan.options);
    setLoading(false);
  }

  const unsafe = routes?.find((r) => r.status === "Unsafe");
  const safe = routes?.find((r) => r.status !== "Unsafe");

  return (
    <Card className="md:col-span-6 col-span-1 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-start mb-6 border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Optimal Route Planner</h2>
          <p className="text-sm text-on-surface-variant">Navigate avoiding high-risk zones.</p>
        </div>
        <button
          onClick={() => navigate("/route")}
          className="text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-semibold transition-colors border border-secondary/30 shrink-0"
        >
          <Icon name="water_drop" size={18} />
          Full Planner
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-secondary bg-surface" />
            <div className="absolute left-[19px] top-[28px] w-[2px] h-6 bg-outline-variant" />
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-sm"
              placeholder="Start Location"
            />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-error" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary transition-shadow outline-none text-sm"
              placeholder="Destination"
            />
          </div>
          <Button fullWidth icon={<Icon name="route" size={20} />} onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing…" : "Analyze Route"}
          </Button>

          {unsafe && (
            <div className="mt-4 p-3 bg-error-container/30 border border-error/30 rounded-lg flex items-start gap-3">
              <Icon name="warning" className="text-error mt-0.5" size={20} />
              <div>
                <div className="font-bold text-error text-sm">Extreme waterlogging risk</div>
                <div className="text-xs text-on-surface-variant mt-1 leading-snug">{unsafe.warning}</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-container rounded-lg border border-outline-variant overflow-hidden relative min-h-[200px]">
          <BaseMap zoom={12} scrollWheelZoom={false}>
            {unsafe && (
              <Polyline positions={unsafe.path} pathOptions={{ color: "#ef4444", weight: 3, dashArray: "6 4" }} />
            )}
            {safe && <Polyline positions={safe.path} pathOptions={{ color: "#00d2fd", weight: 5 }} />}
          </BaseMap>
          {safe && (
            <div className="absolute bottom-2 right-2 bg-surface/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-data text-primary shadow z-[500]">
              ETA: {safe.etaMinutes} MINS
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
