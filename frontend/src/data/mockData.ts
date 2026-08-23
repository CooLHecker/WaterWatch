import type {
  WardTelemetry,
  FloodAlert,
  StreetForecast,
  CriticalRoad,
  DrainageEdge,
  RouteOption,
  LocationRiskAssessment,
  ForecastOffset,
} from "@/types";
import { riskFromDepthCm } from "@/lib/utils";

// Mumbai center for map defaults
export const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

export const WARDS: WardTelemetry[] = [
  { id: "w-a", name: "Ward A — Colaba", lat: 18.9067, lng: 72.8147, precipitationMmHr: 6, intensity: "low" },
  { id: "w-b", name: "Ward D — Malabar Hill", lat: 18.9548, lng: 72.7959, precipitationMmHr: 9, intensity: "low" },
  { id: "w-c", name: "Ward E — Byculla", lat: 18.9776, lng: 72.8331, precipitationMmHr: 14, intensity: "moderate" },
  { id: "w-d", name: "Ward G/N — Dadar", lat: 19.0176, lng: 72.8431, precipitationMmHr: 15, intensity: "moderate" },
  { id: "w-e", name: "Ward F/N — Sion", lat: 19.0448, lng: 72.8636, precipitationMmHr: 22, intensity: "high" },
  { id: "w-f", name: "Ward L — Kurla", lat: 19.0728, lng: 72.8826, precipitationMmHr: 19, intensity: "high" },
  { id: "w-g", name: "Ward K/E — Andheri East", lat: 19.1136, lng: 72.8697, precipitationMmHr: 24, intensity: "high" },
  { id: "w-h", name: "Ward K/W — Andheri West", lat: 19.1197, lng: 72.8464, precipitationMmHr: 11, intensity: "moderate" },
  { id: "w-i", name: "Ward P/N — Malad", lat: 19.1863, lng: 72.8489, precipitationMmHr: 8, intensity: "low" },
  { id: "w-j", name: "Ward S — Bhandup", lat: 19.1436, lng: 72.9346, precipitationMmHr: 17, intensity: "moderate" },
  { id: "w-k", name: "BKC", lat: 19.0662, lng: 72.8677, precipitationMmHr: 15, intensity: "moderate" },
  { id: "w-l", name: "Lower Parel", lat: 19.0000, lng: 72.8300, precipitationMmHr: 13, intensity: "moderate" },
];

export const ALERTS: FloodAlert[] = [
  {
    id: "al-1",
    severity: "high",
    title: "Serious waterlogging reported nearby",
    location: "Andheri East Station",
    lat: 19.1197,
    lng: 72.8697,
    minutesAgo: 4,
  },
  {
    id: "al-2",
    severity: "moderate",
    title: "Slow traffic due to water accumulation",
    location: "WEH near JVLR",
    lat: 19.1136,
    lng: 72.8697,
    minutesAgo: 15,
  },
  {
    id: "al-3",
    severity: "high",
    title: "Drain overflow at rail underpass",
    location: "Hindmata, Dadar",
    lat: 19.0176,
    lng: 72.8431,
    minutesAgo: 27,
  },
  {
    id: "al-4",
    severity: "extreme",
    title: "Vehicles stranded, road impassable",
    location: "Milan Subway",
    lat: 19.0648,
    lng: 72.8436,
    minutesAgo: 38,
  },
];

function buildForecast(peakCm: number, peakAt: ForecastOffset, currentCm: number) {
  const offsets: ForecastOffset[] = [0, 30, 60, 90, 120, 150, 180];
  const peakIndex = offsets.indexOf(peakAt);
  return offsets.map((offset, i) => {
    if (i === 0) return { offsetMinutes: offset, depthCm: currentCm };
    if (i === peakIndex) return { offsetMinutes: offset, depthCm: peakCm };
    if (i < peakIndex) {
      const ratio = i / peakIndex;
      return { offsetMinutes: offset, depthCm: Math.round(currentCm + (peakCm - currentCm) * ratio) };
    }
    const decayRatio = (i - peakIndex) / (offsets.length - 1 - peakIndex);
    return { offsetMinutes: offset, depthCm: Math.max(0, Math.round(peakCm * (1 - decayRatio * 0.7))) };
  });
}

export const STREETS: StreetForecast[] = [
  {
    id: "st-1",
    name: "Sion Road",
    area: "Sion",
    lat: 19.0448,
    lng: 72.8636,
    currentDepthCm: 4,
    peakDepthCm: 31,
    peakTimeMinutes: 120,
    timeToFloodMinutes: 45,
    severity: "extreme",
    status: "Critical",
    forecast: buildForecast(31, 120, 4),
  },
  {
    id: "st-2",
    name: "Hindmata Circle",
    area: "Dadar",
    lat: 19.0176,
    lng: 72.8431,
    currentDepthCm: 9,
    peakDepthCm: 34,
    peakTimeMinutes: 90,
    timeToFloodMinutes: 20,
    severity: "extreme",
    status: "Critical",
    forecast: buildForecast(34, 90, 9),
  },
  {
    id: "st-3",
    name: "Milan Subway",
    area: "Santacruz",
    lat: 19.0648,
    lng: 72.8436,
    currentDepthCm: 12,
    peakDepthCm: 38,
    peakTimeMinutes: 60,
    timeToFloodMinutes: 10,
    severity: "extreme",
    status: "Critical",
    forecast: buildForecast(38, 60, 12),
  },
  {
    id: "st-4",
    name: "Tulsi Pipe Road",
    area: "Lower Parel",
    lat: 19.0088,
    lng: 72.8296,
    currentDepthCm: 5,
    peakDepthCm: 22,
    peakTimeMinutes: 120,
    timeToFloodMinutes: 55,
    severity: "high",
    status: "Watch",
    forecast: buildForecast(22, 120, 5),
  },
  {
    id: "st-5",
    name: "WEH near JVLR",
    area: "Andheri East",
    lat: 19.1136,
    lng: 72.8697,
    currentDepthCm: 7,
    peakDepthCm: 18,
    peakTimeMinutes: 90,
    timeToFloodMinutes: 30,
    severity: "high",
    status: "Watch",
    forecast: buildForecast(18, 90, 7),
  },
  {
    id: "st-6",
    name: "Bandra Kurla Complex — Main Ave",
    area: "BKC",
    lat: 19.0662,
    lng: 72.8677,
    currentDepthCm: 2,
    peakDepthCm: 9,
    peakTimeMinutes: 120,
    timeToFloodMinutes: null,
    severity: "moderate",
    status: "Watch",
    forecast: buildForecast(9, 120, 2),
  },
  {
    id: "st-7",
    name: "Linking Road",
    area: "Bandra",
    lat: 19.0596,
    lng: 72.8295,
    currentDepthCm: 1,
    peakDepthCm: 4,
    peakTimeMinutes: 150,
    timeToFloodMinutes: null,
    severity: "low",
    status: "Normal",
    forecast: buildForecast(4, 150, 1),
  },
];

export const CRITICAL_ROADS: CriticalRoad[] = [
  {
    id: "cr-1",
    name: "Sion Road",
    severity: "extreme",
    path: [
      [19.043, 72.861],
      [19.045, 72.864],
      [19.047, 72.866],
    ],
  },
  {
    id: "cr-2",
    name: "Hindmata Circle",
    severity: "extreme",
    path: [
      [19.016, 72.841],
      [19.018, 72.843],
      [19.019, 72.845],
    ],
  },
  {
    id: "cr-3",
    name: "Tulsi Pipe Road",
    severity: "high",
    path: [
      [19.005, 72.827],
      [19.009, 72.83],
      [19.013, 72.833],
    ],
  },
];

export const DRAINAGE_EDGES: DrainageEdge[] = [
  { id: "d-1", from: [19.043, 72.861], to: [19.04, 72.858], capacityPercent: 35 },
  { id: "d-2", from: [19.016, 72.841], to: [19.013, 72.838], capacityPercent: 28 },
  { id: "d-3", from: [19.113, 72.869], to: [19.109, 72.866], capacityPercent: 62 },
  { id: "d-4", from: [19.005, 72.827], to: [19.001, 72.824], capacityPercent: 71 },
  { id: "d-5", from: [19.064, 72.867], to: [19.061, 72.864], capacityPercent: 88 },
];

export function mockLocationSearch(query: string): LocationRiskAssessment {
  const q = query.trim().toLowerCase();
  const match = STREETS.find(
    (s) => s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q)
  );
  if (match) {
    return {
      location: match.name,
      lat: match.lat,
      lng: match.lng,
      risk: match.severity,
      rainfallMm: Math.round(match.peakDepthCm * 1.1),
      expectedOnsetMinutes: match.timeToFloodMinutes ?? 180,
      soilAbsorption: match.severity === "low" ? "High" : match.severity === "moderate" ? "Moderate" : "Low",
      drainageCapacity: match.severity === "extreme" || match.severity === "high" ? "Low" : "Moderate",
      note:
        match.severity === "low"
          ? "Rainfall is within normal drainage capacity for this area."
          : "Heavy rainfall combined with limited drainage capacity may cause water accumulation in this area.",
    };
  }
  // Fallback generic assessment for unrecognized queries — deterministic-ish from string
  const seed = q.length % 4;
  const risk = (["low", "moderate", "high", "extreme"] as const)[seed];
  return {
    location: query || "Selected Location",
    lat: MUMBAI_CENTER[0],
    lng: MUMBAI_CENTER[1],
    risk,
    rainfallMm: 12 + seed * 8,
    expectedOnsetMinutes: 180 - seed * 40,
    soilAbsorption: seed <= 1 ? "Moderate" : "Low",
    drainageCapacity: seed >= 2 ? "Low" : "Moderate",
    note:
      risk === "low"
        ? "Rainfall is within normal drainage capacity for this area."
        : "Heavy rainfall combined with limited drainage capacity may cause water accumulation in this area.",
  };
}

export function mockRoutePlan(origin: string, destination: string): RouteOption[] {
  void origin;
  void destination;
  const primary: RouteOption = {
    id: "route-a",
    label: "Route A — via Tulsi Pipe Road",
    distanceKm: 4.2,
    etaMinutes: 45,
    peakFloodDepthCm: 35,
    status: "Unsafe",
    warning: "Travelling through Tulsi Pipe Road is not recommended. Alternate route calculated via Sea Link.",
    path: [
      [19.066, 72.868],
      [19.04, 72.85],
      [19.013, 72.833],
      [19.0, 72.83],
    ],
  };
  const alternate: RouteOption = {
    id: "route-b",
    label: "Route B — via Sea Link",
    distanceKm: 5.0,
    etaMinutes: 52,
    peakFloodDepthCm: 6,
    status: "Safe",
    path: [
      [19.066, 72.868],
      [19.045, 72.822],
      [19.028, 72.815],
      [19.0, 72.82],
      [19.0, 72.83],
    ],
  };
  return [primary, alternate];
}

export function severityFromCm(cm: number) {
  return riskFromDepthCm(cm);
}
