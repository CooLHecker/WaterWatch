import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/predictor", label: "Predictor", icon: "analytics", end: false },
  { to: "/map", label: "Map", icon: "map", end: false },
  { to: "/route", label: "Route", icon: "directions_car", end: false },
  { to: "/report", label: "Report", icon: "report_problem", end: false },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex flex-col p-6 gap-4 bg-surface-container-lowest text-secondary h-full w-[280px] border-r border-outline-variant">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="water_drop" className="text-on-primary-container" />
        </div>
        <div>
          <div className="font-display font-bold text-primary text-xl leading-tight">
            WaterWatch
          </div>
          <div className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wide mt-0.5">
            Vigilant Monitoring
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-2 flex-grow">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-sm",
                isActive
                  ? "bg-secondary-container/60 text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} filled={isActive} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-primary text-on-primary font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-colors mb-6 shadow-sm text-sm">
          <Icon name="smart_toy" />
          AI Assistant
        </button>
        <div className="flex flex-col gap-1 border-t border-outline-variant pt-4">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 ease-in-out text-sm"
          >
            <Icon name="settings" />
            Settings
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 ease-in-out text-sm"
          >
            <Icon name="help" />
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
