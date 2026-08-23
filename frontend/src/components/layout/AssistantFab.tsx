import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Decorative assistant entry point matching the mockup's floating action
 * button. Opens a small mock panel — not wired to a real assistant backend.
 */
export function AssistantFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-2 p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-primary text-sm">WaterWatch Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <Icon name="close" className="text-on-surface-variant" size={18} />
            </button>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Ask about flood risk near you, safe routes, or how to read the forecast
            timeline. Assistant responses are illustrative in this preview build.
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-container hover:text-on-secondary-container hover:scale-105 transition-all duration-200 relative"
        aria-label="Open WaterWatch Assistant"
      >
        <Icon name={open ? "chat" : "support_agent"} size={24} />
        {!open && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full border-2 border-surface" />
        )}
      </button>
    </div>
  );
}
