/**
 * Lightweight class-name merger (no extra deps needed).
 * Filters falsy values and joins with a space.
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}
