import { Icon } from "@/components/ui/Icon";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="water_drop" className="text-on-primary-container" size={18} />
        </div>
        <span className="font-display font-bold text-primary text-base">WaterWatch</span>
      </div>
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
      >
        <Icon name="menu" />
      </button>
    </div>
  );
}
