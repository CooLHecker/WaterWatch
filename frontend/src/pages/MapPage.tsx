import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { BaseMap } from "@/components/map/BaseMap";
import {
  WardRainfallLayer,
  CriticalRoadsLayer,
  DrainageLayer,
  StreetMarkersLayer,
} from "@/components/map/MapLayers";
import { LayerControls, type LayerState } from "@/components/map/LayerControls";
import { getWardTelemetry, getCriticalRoads, getDrainageEdges, getStreetForecasts } from "@/data/api";
import type { WardTelemetry, CriticalRoad, DrainageEdge, StreetForecast } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Icon } from "@/components/ui/Icon";

export function MapPage() {
  const [layers, setLayers] = useState<LayerState>({
    rainfall: true,
    floodDepth: true,
    drainage: false,
    criticalRoads: true,
  });
  const [wards, setWards] = useState<WardTelemetry[]>([]);
  const [roads, setRoads] = useState<CriticalRoad[]>([]);
  const [edges, setEdges] = useState<DrainageEdge[]>([]);
  const [streets, setStreets] = useState<StreetForecast[]>([]);
  const [selectedStreet, setSelectedStreet] = useState<StreetForecast | null>(null);

  useEffect(() => {
    getWardTelemetry().then(setWards);
    getCriticalRoads().then(setRoads);
    getDrainageEdges().then(setEdges);
    getStreetForecasts().then(setStreets);
  }, []);

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-3rem)]">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary">Live Telemetry Map</h1>
        <p className="text-on-surface-variant mt-1">
          Real-time view of rainfall and surface water accumulation.
        </p>
      </header>
      <Card className="flex-1 relative overflow-hidden" padding={false}>
        <BaseMap zoom={12}>
          {layers.rainfall && <WardRainfallLayer wards={wards} />}
          {layers.floodDepth && (
            <StreetMarkersLayer streets={streets} onSelect={setSelectedStreet} />
          )}
          {layers.drainage && <DrainageLayer edges={edges} />}
          {layers.criticalRoads && <CriticalRoadsLayer roads={roads} />}
        </BaseMap>
        <LayerControls layers={layers} onChange={setLayers} />

        {selectedStreet && (
          <div className="absolute top-4 right-4 z-[500] bg-surface/95 backdrop-blur-md p-4 rounded-lg border border-secondary shadow-md w-64">
            <div className="flex justify-between items-start mb-2">
              <div className="font-display text-base font-bold text-primary">{selectedStreet.name}</div>
              <button onClick={() => setSelectedStreet(null)} aria-label="Close">
                <Icon name="close" className="text-on-surface-variant" size={18} />
              </button>
            </div>
            <div className="mb-2">
              <RiskBadge level={selectedStreet.severity} size="sm" />
            </div>
            <div className="bg-surface-container p-2 rounded flex justify-between items-center text-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                Current Depth
              </span>
              <span className="font-data text-primary">{selectedStreet.currentDepthCm} cm</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
