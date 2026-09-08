"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "accent" | "success" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ─── Variant maps ─────────────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  accent: "bg-amber-500  text-stone-900 hover:bg-amber-400",
  success: "bg-emerald-500 text-white hover:bg-emerald-600",
  ghost: "bg-white text-stone-900 hover:bg-stone-100",
};

/** Hard-offset drop-shadow per variant (neo-brutalist style) */
const SHADOW: Record<ButtonVariant, string> = {
  primary: "3px 3px 0px 0px #4c1d95",
  accent: "3px 3px 0px 0px #78350f",
  success: "3px 3px 0px 0px #064e3b",
  ghost: "3px 3px 0px 0px #1c1917",
};

const SHADOW_HOVER: Record<ButtonVariant, string> = {
  primary: "4px 4px 0px 0px #4c1d95",
  accent: "4px 4px 0px 0px #78350f",
  success: "4px 4px 0px 0px #064e3b",
  ghost: "4px 4px 0px 0px #1c1917",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm  rounded-lg  gap-1.5",
  md: "px-5 py-2.5 text-base rounded-xl gap-2",
  lg: "px-7 py-3.5 text-lg  rounded-xl gap-2.5",
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
