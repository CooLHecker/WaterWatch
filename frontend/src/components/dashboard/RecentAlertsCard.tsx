import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getRecentAlerts } from "@/data/api";
import { timeAgo, RISK_COLORS, RISK_LABELS } from "@/lib/utils";
import type { FloodAlert } from "@/types";

export function RecentAlertsCard() {
  const [alerts, setAlerts] = useState<FloodAlert[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentAlerts().then(setAlerts);
  }, []);

  return (
    <Card className="md:col-span-4 col-span-1 flex flex-col h-full">
      <CardHeader
        title="Recent Alerts"
        icon={<Icon name="warning" className="text-error" />}
      />
      <Button
        variant="danger"
        fullWidth
        icon={<Icon name="add_alert" />}
        className="mb-6"
        onClick={() => navigate("/report")}
      >
        Report Waterlogging
      </Button>
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[420px]">
        {!alerts && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-surface-container-low animate-pulse" />
            ))}
          </div>
        )}
        {alerts?.map((alert) => {
          const isCritical = alert.severity === "high" || alert.severity === "extreme";
          return (
            <div
              key={alert.id}
              className={
                isCritical
                  ? "p-4 bg-error-container/20 border border-error/20 rounded-lg relative"
                  : "p-4 bg-surface rounded-lg border border-outline-variant relative"
              }
            >
              {isCritical && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-error animate-pulse-soft" />
              )}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 rounded-sm font-semibold text-[10px] uppercase tracking-wide"
                  style={{
                    backgroundColor: `${RISK_COLORS[alert.severity]}26`,
                    color: RISK_COLORS[alert.severity],
                  }}
                >
                  {RISK_LABELS[alert.severity]} severity
                </span>
                <span className="font-data text-[11px] text-on-surface-variant">
                  {timeAgo(alert.minutesAgo)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-primary mb-1">{alert.title}</h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <Icon name="location_on" size={14} />
                {alert.location}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
