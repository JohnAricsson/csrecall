"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressBarVariant = "xp" | "readiness" | "topic";
export type ProgressBarSize = "sm" | "md";

interface ProgressBarProps {
  /** 0–100 percentage value */
  value: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  /** Show the numeric percentage label above the bar */
  showLabel?: boolean;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const FILL_CLASSES: Record<ProgressBarVariant, string> = {
  xp: "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500",
  readiness: "bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400",
  topic: "bg-gradient-to-r from-rose-400 via-red-500 to-rose-600",
};

const SIZE_CLASSES: Record<ProgressBarSize, { track: string; height: string }> =
  {
    sm: {
      track:
        "h-2.5 border-2 border-black bg-stone-200 shadow-[1px_1px_0px_0px_#000]",
      height: "h-full",
    },
    md: {
      track:
        "h-4 border-2 border-black bg-stone-200 shadow-[2px_2px_0px_0px_#000]",
      height: "h-full",
    },
  };

// ─── Component ────────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  variant = "xp",
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const sizeCfg = SIZE_CLASSES[size];

  return (
    <div className={cn("relative w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 items-center">
          <span className="text-xs font-black text-black uppercase tracking-wider">
            HP / Progress
          </span>
          <span className="text-xs font-black text-black bg-yellow-300 px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_#000]">
            {clamped}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full relative",
          sizeCfg.track,
        )}
      >
        {/* Animated fill with comic striping */}
        <motion.div
          className={cn(
            sizeCfg.height,
            "rounded-full relative overflow-hidden border-r-2 border-black",
            FILL_CLASSES[variant],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.15,
          }}
        >
          {/* Comic health bar diagonal stripes */}
          <div className="absolute inset-0 bg-comic-stripes opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
