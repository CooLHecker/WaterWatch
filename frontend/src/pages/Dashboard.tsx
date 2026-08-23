import { FloodPredictorCard } from "@/components/dashboard/FloodPredictorCard";
import { RecentAlertsCard } from "@/components/dashboard/RecentAlertsCard";
import { RainMapCard } from "@/components/dashboard/RainMapCard";
import { RoutePlannerCard } from "@/components/dashboard/RoutePlannerCard";

function formatLastUpdated() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function Dashboard() {
  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Overview</h1>
          <p className="text-on-surface-variant mt-2">Real-time climate and infrastructure telemetry.</p>
        </div>
        <div className="font-data text-xs text-secondary px-3 py-1 bg-surface-container rounded-full inline-block self-start md:self-auto">
          LAST UPDATED: {formatLastUpdated()} IST
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <FloodPredictorCard />
        <RecentAlertsCard />
        <RainMapCard />
        <RoutePlannerCard />
      </div>
    </div>
  );
}
