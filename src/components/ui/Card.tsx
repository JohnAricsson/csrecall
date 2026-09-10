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
        "bg-[#fffdf7] rounded-2xl",
        !borderless && "border-[3px] border-black",
        soft
          ? "shadow-[2px_2px_0px_0px_#000]"
          : "shadow-[5px_5px_0px_0px_#000]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
