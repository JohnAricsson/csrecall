/**
 * Next.js App Router global loading UI.
 * Shown while page segments are streaming.
 * Uses CSS animation-delay for staggered bouncing dots — no client JS needed.
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-stone-50">
      {/* Bouncing dots */}
      <div className="flex items-center gap-3">
        {([0, 0.15, 0.3] as const).map((delay, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 border-stone-900 bg-violet-600 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="font-black text-stone-500 uppercase tracking-widest text-sm">
        Loading arena…
      </p>

      {/* Skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl px-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl border-2 border-stone-200 bg-white animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
