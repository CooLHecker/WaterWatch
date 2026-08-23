import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { submitWaterlogReport } from "@/data/api";
import type { ReportDepthCategory } from "@/types";

const DEPTH_OPTIONS: {
  value: ReportDepthCategory;
  label: string;
  approx: string;
  color: string;
}[] = [
  { value: "low", label: "Ankle Deep", approx: "~15 cm", color: "#22c55e" },
  { value: "moderate", label: "Knee Deep", approx: "~30 cm", color: "#fb923c" },
  { value: "high", label: "Waist Deep", approx: "~90 cm", color: "#ef4444" },
  { value: "critical", label: "Car Submerged", approx: ">100 cm", color: "#7c3aed" },
];

export function ReportForm() {
  const [location, setLocation] = useState("");
  const [depth, setDepth] = useState<ReportDepthCategory | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim() || !depth) return;
    setSubmitting(true);
    await submitWaterlogReport({ location, depthCategory: depth, details });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-risk-low/15 flex items-center justify-center mx-auto mb-4">
          <Icon name="check_circle" className="text-risk-low" size={32} filled />
        </div>
        <h3 className="font-display text-xl font-bold text-primary mb-2">Report submitted</h3>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
          Thanks — this helps improve flood models for everyone nearby. Your report has been
          logged for {location}.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setSubmitted(false);
            setLocation("");
            setDepth(null);
            setDetails("");
          }}
        >
          Submit another report
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-bold text-primary mb-2 text-sm">Location</label>
        <div className="flex gap-2">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-sm"
            placeholder="Search location or drop pin"
            required
          />
          <button
            type="button"
            onClick={() => setLocation("Current Location")}
            className="px-4 py-2 border-2 border-secondary text-secondary rounded-lg font-bold hover:bg-secondary/10 flex items-center justify-center min-w-[48px]"
            aria-label="Use current location"
          >
            <Icon name="my_location" />
          </button>
        </div>
      </div>

      <div>
        <label className="block font-bold text-primary mb-2 text-sm">Water Depth Estimation</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DEPTH_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="depth"
                className="peer sr-only"
                checked={depth === opt.value}
                onChange={() => setDepth(opt.value)}
              />
              <div
                className="text-center p-3 rounded-lg border border-outline-variant transition-all"
                style={
                  depth === opt.value
                    ? { borderColor: opt.color, backgroundColor: `${opt.color}1a` }
                    : undefined
                }
              >
                <div className="text-sm font-bold" style={{ color: opt.color }}>
                  {opt.label}
                </div>
                <div className="text-xs text-on-surface-variant">{opt.approx}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold text-primary mb-2 text-sm">Additional Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary outline-none text-sm"
          placeholder="Any obstacles, traffic blockages, etc."
        />
      </div>

      <Button
        type="submit"
        variant="danger"
        fullWidth
        icon={<Icon name="send" />}
        disabled={submitting || !location.trim() || !depth}
      >
        {submitting ? "Submitting…" : "Submit Report"}
      </Button>
    </form>
  );
}
