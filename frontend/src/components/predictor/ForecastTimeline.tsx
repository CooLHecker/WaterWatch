import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import type { ForecastPoint } from "@/types";
import { formatOffsetLabel } from "@/lib/utils";

interface ForecastTimelineProps {
  forecast: ForecastPoint[];
  peakTimeMinutes: number;
}

export function ForecastTimeline({ forecast, peakTimeMinutes }: ForecastTimelineProps) {
  const data = forecast.map((f) => ({
    label: formatOffsetLabel(f.offsetMinutes),
    offset: f.offsetMinutes,
    depth: f.depthCm,
  }));
  const peak = data.find((d) => d.offset === peakTimeMinutes);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 16, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d2fd" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00d2fd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#43474d" }}
            axisLine={{ stroke: "#c4c6ce" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#43474d" }}
            axisLine={false}
            tickLine={false}
            width={40}
            label={{ value: "cm", angle: 0, position: "insideTopLeft", fontSize: 10, fill: "#74777e" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              fontFamily: "Inter",
            }}
            formatter={(value) => [`${value} cm`, "Depth"]}
          />
          <Area
            type="monotone"
            dataKey="depth"
            stroke="#00677e"
            strokeWidth={2}
            fill="url(#depthGradient)"
          />
          {peak && (
            <ReferenceDot
              x={peak.label}
              y={peak.depth}
              r={5}
              fill="#ba1a1a"
              stroke="#fff"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
