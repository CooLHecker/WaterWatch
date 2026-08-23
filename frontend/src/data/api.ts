// Mock API layer.
//
// Each function here mirrors an endpoint from implementaion.md §23
// (e.g. GET /api/flood/forecast, POST /api/routes/safe). They currently
// resolve from local mock data with simulated latency. When a real backend
// is ready, swap the function bodies for `fetch(...)` calls — nothing in
// the component layer needs to change since it only depends on these
// function signatures and the shared types in src/types.

import {
  WARDS,
  ALERTS,
  STREETS,
  CRITICAL_ROADS,
  DRAINAGE_EDGES,
  mockLocationSearch,
  mockRoutePlan,
} from "./mockData";
import type {
  WardTelemetry,
  FloodAlert,
  StreetForecast,
  CriticalRoad,
  DrainageEdge,
  LocationRiskAssessment,
  RoutePlan,
  WaterlogReport,
} from "@/types";
import { delay } from "@/lib/utils";

// Base URL of the real backend (see backend/README.md). Unset in local
// dev unless you export it — falls back to mock data below either way.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

interface RainfallResponse {
  updatedAt: string;
  source: "live" | "cache" | "fallback";
  granuleTime: string | null;
  wards: WardTelemetry[];
}

// GET /api/rainfall/current (ward-level telemetry)
// Live once VITE_API_BASE_URL is set (see backend/README.md); falls back
// to mock data if the env var is unset, or if the request fails, so the
// dashboard never breaks because of a flaky upstream data source.
export async function getWardTelemetry(): Promise<WardTelemetry[]> {
  if (!API_BASE_URL) {
    return delay(WARDS, 400);
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/rainfall/current`);
    if (!res.ok) throw new Error(`Rainfall API returned ${res.status}`);
    const data: RainfallResponse = await res.json();
    return data.wards;
  } catch (err) {
    console.warn("Falling back to mock rainfall data:", err);
    return delay(WARDS, 400);
  }
}

// GET /api/critical-zones (recent alerts feed)
export async function getRecentAlerts(): Promise<FloodAlert[]> {
  return delay(ALERTS, 350);
}

// GET /api/roads/flooded?t=... (all tracked streets with full forecast)
export async function getStreetForecasts(): Promise<StreetForecast[]> {
  return delay(STREETS, 450);
}

// GET /api/street/{street_id}
export async function getStreetById(id: string): Promise<StreetForecast | undefined> {
  return delay(STREETS.find((s) => s.id === id), 300);
}

// GET /api/drainage/status
export async function getDrainageEdges(): Promise<DrainageEdge[]> {
  return delay(DRAINAGE_EDGES, 300);
}

export async function getCriticalRoads(): Promise<CriticalRoad[]> {
  return delay(CRITICAL_ROADS, 300);
}

// GET /api/flood/current?location=... (predictor "Will your area be waterlogged?")
export async function getLocationRisk(query: string): Promise<LocationRiskAssessment> {
  return delay(mockLocationSearch(query), 600);
}

// POST /api/routes/safe
export async function getSafeRoute(origin: string, destination: string): Promise<RoutePlan> {
  const options = mockRoutePlan(origin, destination);
  return delay({ origin, destination, options }, 700);
}

// POST /api/reports (community waterlogging report — client-side only for now)
export async function submitWaterlogReport(
  report: Omit<WaterlogReport, "id" | "submittedAt">
): Promise<WaterlogReport> {
  const full: WaterlogReport = {
    ...report,
    id: `rpt-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  return delay(full, 500);
}
