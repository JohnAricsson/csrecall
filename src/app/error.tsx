"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router global error boundary.
 * Must be a Client Component — `reset` is a client-side callback.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error tracking service in production
    console.error("[CSRecall] Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8 bg-stone-50 px-4 text-center">
      {/* Game-over icon */}
      <div className="relative">
        <div className="text-7xl sm:text-8xl leading-none select-none">💀</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 border-2 border-stone-900 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Heading */}
      <div>
        <h1 className="font-black text-4xl sm:text-5xl text-stone-900 mb-3">
          Game Over
        </h1>
        <p className="text-stone-500 font-medium max-w-sm">
          Something crashed the arena. Your XP is safe — hit Retry to get back
          in the fight.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mt-4 p-3 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-700 text-xs text-left max-w-sm overflow-auto">
            {error.message}
          </pre>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" size="lg" onClick={reset}>
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
          Retry
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => (window.location.href = "/")}
        >
          ← Back to Hub
        </Button>
      </div>
    </div>
  );
}
