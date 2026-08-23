import { MapContainer, TileLayer } from "react-leaflet";
import type { ReactNode } from "react";
import { MUMBAI_CENTER } from "@/data/mockData";

interface BaseMapProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
  className?: string;
  scrollWheelZoom?: boolean;
}

export function BaseMap({
  children,
  center = MUMBAI_CENTER,
  zoom = 12,
  className,
  scrollWheelZoom = true,
}: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  );
}
