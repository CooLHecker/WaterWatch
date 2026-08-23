// Core domain types for WaterWatch Mumbai.
// These mirror the API structure described in implementaion.md (Section 23)
// so the mock layer in src/data can be swapped for real fetch calls later
// without touching component code.

export type RiskLevel = "low" | "moderate" | "high" | "extreme";

export type ForecastOffset = 0 | 30 | 60 | 90 | 120 | 150 | 180;

export interface RainfallReading {
  mm: number;
  intensity: RiskLevel;
}

export interface LocationRiskAssessment {
  location: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  rainfallMm: number;
  expectedOnsetMinutes: number;
  soilAbsorption: "Low" | "Moderate" | "High";
  drainageCapacity: "Low" | "Moderate" | "High";
  note: string;
}

export interface ForecastPoint {
  offsetMinutes: ForecastOffset;
  depthCm: number;
}

export interface StreetForecast {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  currentDepthCm: number;
  peakDepthCm: number;
  peakTimeMinutes: number;
  timeToFloodMinutes: number | null; // null = not expected to flood in window
  severity: RiskLevel;
  status: "Normal" | "Watch" | "Critical";
  forecast: ForecastPoint[];
}

export interface WardTelemetry {
  id: string;
  name: string;
  lat: number;
  lng: number;
  precipitationMmHr: number;
  intensity: RiskLevel;
}

export interface FloodAlert {
  id: string;
  severity: RiskLevel;
  title: string;
  location: string;
  lat: number;
  lng: number;
  minutesAgo: number;
}

export interface RouteOption {
  id: string;
  label: string;
  distanceKm: number;
  etaMinutes: number;
  peakFloodDepthCm: number;
  status: "Safe" | "Caution" | "Unsafe";
  path: [number, number][]; // [lat, lng] polyline
  warning?: string;
}

export interface RoutePlan {
  origin: string;
  destination: string;
  options: RouteOption[];
}

export interface DrainageEdge {
  id: string;
  from: [number, number];
  to: [number, number];
  capacityPercent: number; // 0-100, remaining effective capacity
}

export interface CriticalRoad {
  id: string;
  name: string;
  path: [number, number][];
  severity: RiskLevel;
}

export type ReportDepthCategory = "low" | "moderate" | "high" | "critical";

export interface WaterlogReport {
  id: string;
  location: string;
  lat?: number;
  lng?: number;
  depthCategory: ReportDepthCategory;
  details: string;
  submittedAt: string;
}
