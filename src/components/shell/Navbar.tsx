import Link from "next/link";
import { Zap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * App shell Navbar — Server Component.
 * Minimal: brand logo on the left, Login button on the right.
 * Player HUD (XP, streak, readiness) lives on the /profile page.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-stone-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* ── Brand ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-lg text-stone-900 hover:text-violet-600 transition-colors"
        >
          <div className="w-8 h-8 bg-violet-600 rounded-lg border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span>CSRecall</span>
        </Link>

        {/* ── Login CTA ─────────────────────────────────────── */}
        <Button variant="primary" size="sm">
          <LogIn className="w-4 h-4" strokeWidth={2.5} />
          Login / Sign In
        </Button>
      </div>
    </header>
  );
}
