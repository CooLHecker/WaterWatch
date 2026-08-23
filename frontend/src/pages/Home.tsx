import { Link } from "react-router-dom";
import { RainBackground } from "@/components/home/RainBackground";
import { Icon } from "@/components/ui/Icon";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/predictor", label: "Predictor" },
  { to: "/map", label: "Map" },
  { to: "/route", label: "Route" },
  { to: "/report", label: "Report" },
];

const FEATURES = [
  {
    icon: "analytics",
    title: "Flood Predictor",
    description: "Predict waterlogging risk using rainfall, soil and drainage conditions.",
    to: "/predictor",
  },
  {
    icon: "map",
    title: "Hyperlocal Rain Map",
    description: "See rainfall intensity.",
    to: "/map",
  },
  {
    icon: "report_problem",
    title: "Flood Reporting",
    description: "Report waterlogging and alert people nearby.",
    to: "/report",
  },
  {
    icon: "directions_car",
    title: "Optimal Route",
    description: "Find safer routes during heavy rainfall.",
    to: "/route",
  },
];

export function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <RainBackground />

      {/* Top nav */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between h-16 px-4 md:px-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <Icon name="water_drop" className="text-on-primary-container" size={20} />
          </div>
          <span className="font-display text-lg font-bold text-on-surface">WaterWatch</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-sm font-semibold text-on-surface hover:text-secondary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/dashboard"
          className="hidden sm:inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-sm py-2 px-4 rounded-lg hover:bg-primary-container transition-colors"
        >
          Launch Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative w-full min-h-[640px] h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-10 w-full flex flex-col items-center text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-secondary-fixed bg-white/5 border border-secondary-fixed/30 rounded-full px-4 py-1.5 mb-6">
            Live rainfall intelligence &middot;
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-on-primary mb-6 max-w-4xl tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            WaterWatch
          </h1>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-secondary-fixed mb-4 max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Know the rain. Predict the risk. Travel safer.
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-10 max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Hyperlocal rainfall intelligence and waterlogging prediction for a safer, more
            resilient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="font-bold text-sm py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 bg-primary text-on-primary hover:bg-primary-container"
            >
              Launch Dashboard
            </Link>
            <Link
              to="/map"
              className="font-bold text-sm py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 bg-transparent border-2 border-secondary-fixed text-secondary-fixed hover:bg-secondary-fixed/10"
            >
              Explore
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon
            name="keyboard_arrow_down"
            className="text-secondary-fixed text-3xl opacity-80"
            size={32}
          />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-20 py-20 px-4 md:px-10">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-on-primary mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Built for Urban Resilience
            </h2>
            <div className="w-24 h-1 bg-secondary-fixed mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                to={feature.to}
                className="group bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-level-1 hover-lift"
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={feature.icon} filled className="text-secondary text-2xl" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30">
        <div className="font-display text-lg font-bold text-on-surface">WaterWatch</div>
        <div className="text-sm text-on-surface-variant text-center md:text-left">
          &copy; {new Date().getFullYear()} WaterWatch. Authoritative Climate Monitoring.
        </div>
        <div className="flex gap-6 text-sm">
          <a className="text-on-surface-variant hover:text-secondary hover:underline transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-secondary hover:underline transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-on-surface-variant hover:text-secondary hover:underline transition-colors" href="#">
            Data API
          </a>
          <a className="text-on-surface-variant hover:text-secondary hover:underline transition-colors" href="#">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
