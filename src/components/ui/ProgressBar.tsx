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
  xp: "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
  readiness:
    "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
  topic:
    "bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 shadow-[0_0_12px_rgba(124,58,237,0.4)]",
};

const SIZE_CLASSES: Record<ProgressBarSize, { track: string; height: string }> =
  {
    sm: {
      track: "h-2 border border-stone-900 bg-stone-200/90 shadow-inner",
      height: "h-full",
    },
    md: {
      track: "h-3 border-2 border-stone-900 bg-stone-100 shadow-inner",
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
          <span className="text-xs font-black text-stone-500 uppercase tracking-wider">
            Progress
          </span>
          <span className="text-xs font-black text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300">
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
        {/* Animated fill */}
        <motion.div
          className={cn(
            sizeCfg.height,
            "rounded-full relative overflow-hidden",
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
          {/* Subtle sheen highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
