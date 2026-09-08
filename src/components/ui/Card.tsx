import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Replace the hard drop-shadow with a softer one for nested cards */
  soft?: boolean;
  /** Remove the border (e.g., for image-card thumbnails) */
  borderless?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Neo-brutalist card surface.
 * Crisp white background, 2 px solid stone-900 border,
 * and a hard offset drop-shadow for a tactile "lifted" feel.
 */
export function Card({
  children,
  className,
  soft = false,
  borderless = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl",
        !borderless && "border-2 border-stone-900",
        soft
          ? "shadow-[2px_2px_0px_0px_#1c1917]"
          : "shadow-[4px_4px_0px_0px_#1c1917]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
