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
  | "orange"
  | "mint";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  violet: "bg-violet-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  amber: "bg-yellow-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  emerald:
    "bg-emerald-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  mint: "bg-emerald-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  rose: "bg-rose-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  pink: "bg-pink-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  stone: "bg-[#fffdf7] text-black border-black shadow-[2px_2px_0px_0px_#000]",
  sky: "bg-sky-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  indigo: "bg-indigo-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  cyan: "bg-cyan-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
  orange: "bg-orange-300 text-black border-black shadow-[2px_2px_0px_0px_#000]",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Chunky comic-book sticker pill.
 * Thick 2px black border, high-contrast text, uppercase tracking.
 */
export function Badge({ variant = "stone", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "px-2.5 py-0.5 rounded-full",
        "border-2 border-black text-xs font-black uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
