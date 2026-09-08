"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressBarVariant = "xp" | "readiness" | "topic";

interface ProgressBarProps {
  /** 0–100 percentage value */
  value: number;
  variant?: ProgressBarVariant;
  /** Show the numeric percentage label above the bar */
  showLabel?: boolean;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const FILL_CLASSES: Record<ProgressBarVariant, string> = {
  xp: "bg-amber-500",
  readiness: "bg-emerald-500",
  topic: "bg-violet-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Game-style XP / progress bar.
 * Thick 2 px solid border container, animated colored fill via Framer Motion.
 * Use `variant` to pick the semantic color (xp → amber, readiness → emerald, topic → violet).
 */
export function ProgressBar({
  value,
  variant = "xp",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("relative w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
            Progress
          </span>
          <span className="text-xs font-black text-stone-800">{clamped}%</span>
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          "h-3 w-full overflow-hidden",
          "rounded-full border-2 border-stone-900 bg-stone-100",
        )}
      >
        {/* Animated fill */}
        <motion.div
          className={cn("h-full rounded-full", FILL_CLASSES[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.15,
          }}
        />
      </div>
    </div>
  );
}
