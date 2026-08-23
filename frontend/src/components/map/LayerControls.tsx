interface LayerState {
  rainfall: boolean;
  floodDepth: boolean;
  drainage: boolean;
  criticalRoads: boolean;
}

interface LayerControlsProps {
  layers: LayerState;
  onChange: (layers: LayerState) => void;
}

const OPTIONS: { key: keyof LayerState; label: string }[] = [
  { key: "rainfall", label: "Radar Rainfall" },
  { key: "floodDepth", label: "Flood Depth" },
  { key: "drainage", label: "Drainage Network" },
  { key: "criticalRoads", label: "Critical Roads" },
];

export function LayerControls({ layers, onChange }: LayerControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-[500] bg-surface/90 backdrop-blur-sm p-4 rounded-lg border border-outline-variant shadow-sm w-56">
      <h3 className="font-bold text-primary mb-3 text-sm">Map Layers</h3>
      {OPTIONS.map((opt) => (
        <label
          key={opt.key}
          className="flex items-center gap-2 mb-2 last:mb-0 cursor-pointer text-sm font-medium"
        >
          <input
            type="checkbox"
            checked={layers[opt.key]}
            onChange={(e) => onChange({ ...layers, [opt.key]: e.target.checked })}
            className="rounded text-secondary focus:ring-secondary w-4 h-4"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export type { LayerState };
