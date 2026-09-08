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
  | "sky";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  violet: "bg-violet-100 text-violet-800 border-violet-400",
  amber: "bg-amber-100  text-amber-900  border-amber-400",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-400",
  rose: "bg-rose-100   text-rose-800   border-rose-400",
  pink: "bg-pink-100   text-pink-800   border-pink-400",
  stone: "bg-stone-100  text-stone-700  border-stone-400",
  sky: "bg-sky-100    text-sky-800    border-sky-400",
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
