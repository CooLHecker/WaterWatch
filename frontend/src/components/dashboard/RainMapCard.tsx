import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { BaseMap } from "@/components/map/BaseMap";
import { WardRainfallLayer } from "@/components/map/MapLayers";
import { getWardTelemetry } from "@/data/api";
import type { WardTelemetry } from "@/types";

export function RainMapCard() {
  const [wards, setWards] = useState<WardTelemetry[]>([]);

  useEffect(() => {
    getWardTelemetry().then(setWards);
  }, []);

  return (
    <Card
      className="md:col-span-6 col-span-1 relative overflow-hidden min-h-[400px]"
      padding={false}
    >
      <div className="flex justify-between items-start p-6 pb-4 relative z-10">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary">Hyperlocal Rain Map</h2>
          <p className="text-sm text-on-surface-variant">Live telemetry across {wards.length || 12} wards.</p>
        </div>
        <Icon name="satellite_alt" className="text-secondary" />
      </div>
      <div className="absolute inset-0 top-[80px]">
        <BaseMap zoom={11} scrollWheelZoom={false}>
          <WardRainfallLayer wards={wards} />
        </BaseMap>
      </div>
      <div className="absolute bottom-6 left-6 z-[500] bg-surface/90 backdrop-blur-sm p-4 rounded-lg border border-outline-variant shadow-sm pointer-events-none">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-primary mb-2">
          Intensity Legend
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-low/60 border border-risk-low" /> Low
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-moderate/60 border border-risk-moderate" /> Moderate
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-high/60 border border-risk-high" /> Heavy
          </div>
        </div>
      </div>
    </Card>
  );
}
