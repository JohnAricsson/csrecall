import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "pink"
  | "stone"
  | "sky"
  | "indigo"
  | "cyan"
  | "orange";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  violet:
    "bg-violet-100 text-violet-800 border-violet-400 shadow-[1px_1px_0px_0px_#4c1d95]",
  amber:
    "bg-amber-100 text-amber-900 border-amber-400 shadow-[1px_1px_0px_0px_#78350f]",
  emerald:
    "bg-emerald-100 text-emerald-800 border-emerald-400 shadow-[1px_1px_0px_0px_#064e3b]",
  rose: "bg-rose-100 text-rose-800 border-rose-400 shadow-[1px_1px_0px_0px_#881337]",
  pink: "bg-pink-100 text-pink-800 border-pink-400 shadow-[1px_1px_0px_0px_#831843]",
  stone:
    "bg-stone-100 text-stone-700 border-stone-300 shadow-[1px_1px_0px_0px_#1c1917]",
  sky: "bg-sky-100 text-sky-800 border-sky-400 shadow-[1px_1px_0px_0px_#0369a1]",
  indigo:
    "bg-indigo-100 text-indigo-800 border-indigo-400 shadow-[1px_1px_0px_0px_#3730a3]",
  cyan: "bg-cyan-100 text-cyan-800 border-cyan-400 shadow-[1px_1px_0px_0px_#155e75]",
  orange:
    "bg-orange-100 text-orange-900 border-orange-400 shadow-[1px_1px_0px_0px_#9a3412]",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Chunky pill-shaped tag badge.
 * Thick 2 px border, high-contrast text, uppercase tracking.
 * Matches the game's energetic accent palette.
 */
export function Badge({ variant = "stone", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "px-2.5 py-0.5 rounded-full",
        "border-2 text-xs font-black uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
