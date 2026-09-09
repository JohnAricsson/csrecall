"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary"
  | "accent"
  | "success"
  | "danger"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ─── Variant maps ─────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 active:from-violet-700 active:to-indigo-700",
  accent:
    "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 active:from-amber-500 active:to-amber-600",
  success:
    "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 active:from-emerald-600 active:to-teal-700",
  danger:
    "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 active:from-rose-600 active:to-red-700",
  ghost: "bg-white text-stone-900 hover:bg-stone-50 hover:text-violet-700",
};

/** Hard-offset drop-shadow per variant (neo-brutalist style) */
const SHADOW: Record<ButtonVariant, string> = {
  primary: "3px 3px 0px 0px #3b0764",
  accent: "3px 3px 0px 0px #78350f",
  success: "3px 3px 0px 0px #064e3b",
  danger: "3px 3px 0px 0px #881337",
  ghost: "3px 3px 0px 0px #1c1917",
};

const SHADOW_HOVER: Record<ButtonVariant, string> = {
  primary: "4px 4px 0px 0px #3b0764",
  accent: "4px 4px 0px 0px #78350f",
  success: "4px 4px 0px 0px #064e3b",
  danger: "4px 4px 0px 0px #881337",
  ghost: "4px 4px 0px 0px #1c1917",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs sm:text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm sm:text-base rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base sm:text-lg rounded-xl gap-2.5",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Tactile 3D neo-brutalist button.
 * Uses Framer Motion spring physics for the depress + lift effect.
 * Passes all HTMLMotionProps through so callers can add whileHover / animate / etc.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const shadow = SHADOW[variant];
  const shadowHover = SHADOW_HOVER[variant];
  const shadowDisabled = "none";

  return (
    <motion.button
      disabled={disabled}
      className={cn(
        // Layout
        "relative inline-flex items-center justify-center font-bold select-none",
        // Border (neo-brutalist 2 px solid)
        "border-2 border-stone-900",
        // Focus ring
        "outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
        // Disabled
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Transition for color changes (shadow handled by framer)
        "transition-colors",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      style={{ boxShadow: disabled ? shadowDisabled : shadow, ...style }}
      whileHover={disabled ? {} : { y: -1, boxShadow: shadowHover }}
      whileTap={
        disabled ? {} : { x: 3, y: 3, boxShadow: "0px 0px 0px 0px transparent" }
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
