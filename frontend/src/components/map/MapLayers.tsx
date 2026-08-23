import { CircleMarker, Polyline, Popup, Tooltip } from "react-leaflet";
import type { WardTelemetry, CriticalRoad, DrainageEdge, FloodAlert, StreetForecast } from "@/types";
import { RISK_COLORS } from "@/lib/utils";

export function WardRainfallLayer({ wards }: { wards: WardTelemetry[] }) {
  return (
    <>
      {wards.map((ward) => (
        <CircleMarker
          key={ward.id}
          center={[ward.lat, ward.lng]}
          radius={10 + ward.precipitationMmHr / 3}
          pathOptions={{
            color: RISK_COLORS[ward.intensity],
            fillColor: RISK_COLORS[ward.intensity],
            fillOpacity: 0.35,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <div className="text-xs font-semibold">{ward.name}</div>
          </Tooltip>
          <Popup>
            <div className="text-sm">
              <div className="font-bold mb-1">{ward.name}</div>
              <div>Precipitation: {ward.precipitationMmHr} mm/hr</div>
              <div className="capitalize">Intensity: {ward.intensity}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export function CriticalRoadsLayer({ roads }: { roads: CriticalRoad[] }) {
  return (
    <>
      {roads.map((road) => (
        <Polyline
          key={road.id}
          positions={road.path}
          pathOptions={{ color: RISK_COLORS[road.severity], weight: 5, opacity: 0.85 }}
        >
          <Tooltip sticky>{road.name} — flood risk</Tooltip>
        </Polyline>
      ))}
    </>
  );
}

export function DrainageLayer({ edges }: { edges: DrainageEdge[] }) {
  return (
    <>
      {edges.map((edge) => {
        const color = edge.capacityPercent < 40 ? "#ef4444" : edge.capacityPercent < 70 ? "#f59e0b" : "#00677e";
        return (
          <Polyline
            key={edge.id}
            positions={[edge.from, edge.to]}
            pathOptions={{ color, weight: 3, dashArray: "6 4", opacity: 0.8 }}
          >
            <Tooltip sticky>Drainage capacity: {edge.capacityPercent}%</Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

export function AlertMarkersLayer({ alerts }: { alerts: FloodAlert[] }) {
  return (
    <>
      {alerts.map((alert) => (
        <CircleMarker
          key={alert.id}
          center={[alert.lat, alert.lng]}
          radius={7}
          pathOptions={{
            color: RISK_COLORS[alert.severity],
            fillColor: RISK_COLORS[alert.severity],
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold mb-1">{alert.title}</div>
              <div>{alert.location}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

export function StreetMarkersLayer({
  streets,
  onSelect,
}: {
  streets: StreetForecast[];
  onSelect?: (street: StreetForecast) => void;
}) {
  return (
    <>
      {streets.map((street) => (
        <CircleMarker
          key={street.id}
          center={[street.lat, street.lng]}
          radius={8}
          eventHandlers={onSelect ? { click: () => onSelect(street) } : undefined}
          pathOptions={{
            color: RISK_COLORS[street.severity],
            fillColor: RISK_COLORS[street.severity],
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <div className="text-xs font-semibold">{street.name}</div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
