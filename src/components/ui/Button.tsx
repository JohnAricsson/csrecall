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
    "bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white hover:from-rose-500 hover:to-red-500 active:from-rose-700 active:to-red-700",
  accent:
    "bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 text-black hover:from-yellow-200 hover:to-yellow-300 active:from-yellow-400 active:to-amber-500",
  success:
    "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-black hover:from-emerald-300 hover:to-teal-400 active:from-emerald-500 active:to-teal-600",
  danger:
    "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-400 hover:to-red-500 active:from-rose-600 active:to-red-700",
  ghost: "bg-[#fffbf0] text-black hover:bg-yellow-100 hover:text-black",
};

/** Hard-offset drop-shadow per variant (comic-arcade style) */
const SHADOW: Record<ButtonVariant, string> = {
  primary: "4px 4px 0px 0px #000000",
  accent: "4px 4px 0px 0px #000000",
  success: "4px 4px 0px 0px #000000",
  danger: "4px 4px 0px 0px #000000",
  ghost: "3px 3px 0px 0px #000000",
};

const SHADOW_HOVER: Record<ButtonVariant, string> = {
  primary: "5px 5px 0px 0px #000000",
  accent: "5px 5px 0px 0px #000000",
  success: "5px 5px 0px 0px #000000",
  danger: "5px 5px 0px 0px #000000",
  ghost: "4px 4px 0px 0px #000000",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs sm:text-sm rounded-xl gap-1.5 font-black",
  md: "px-5 py-2.5 text-sm sm:text-base rounded-2xl gap-2 font-black",
  lg: "px-7 py-3.5 text-base sm:text-lg rounded-2xl gap-2.5 font-black",
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Tactile 3D comic-arcade button.
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
        "relative inline-flex items-center justify-center font-black uppercase tracking-wider select-none",
        // Border (comic 3px solid black)
        "border-[3px] border-black",
        // Focus ring
        "outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
        // Disabled
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Transition for color changes (shadow handled by framer)
        "transition-colors",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      style={{ boxShadow: disabled ? shadowDisabled : shadow, ...style }}
      whileHover={disabled ? {} : { y: -2, boxShadow: shadowHover }}
      whileTap={
        disabled ? {} : { x: 4, y: 4, boxShadow: "1px 1px 0px 0px #000000" }
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
