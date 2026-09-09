"use client";

import { LuSun, LuMoon, LuMonitor } from "react-icons/lu";
import { useTheme } from "@/lib/theme/provider";

const MODES = ["system", "dark", "light"] as const;

const LABELS: Record<string, string> = {
  system: "System theme",
  dark: "Dark theme",
  light: "Light theme",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useTheme();

  const cycle = () => {
    const i = MODES.indexOf(mode);
    setMode(MODES[(i + 1) % MODES.length]);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className={`flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-surface ${className ?? ""}`}
      aria-label={LABELS[mode]}
      title={LABELS[mode]}
    >
      {mode === "system" && <LuMonitor className="size-4" />}
      {mode === "dark" && <LuMoon className="size-4" />}
      {mode === "light" && <LuSun className="size-4" />}
    </button>
  );
}
