import { clsx, type ClassValue } from "clsx";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#10b981",
  moderate: "#f59e0b",
  high: "#ef4444",
  extreme: "#7c3aed",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  extreme: "Extreme",
};

export function riskFromDepthCm(depthCm: number): RiskLevel {
  if (depthCm >= 30) return "extreme";
  if (depthCm >= 15) return "high";
  if (depthCm >= 5) return "moderate";
  return "low";
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h}h ${m}m`;
}

export function formatOffsetLabel(offset: number): string {
  return offset === 0 ? "NOW" : `+${offset}m`;
}

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} min${minutesAgo === 1 ? "" : "s"} ago`;
  const h = Math.floor(minutesAgo / 60);
  return `${h} hr${h === 1 ? "" : "s"} ago`;
}

/** Simulates network latency for mock API calls so loading states are exercised. */
export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
