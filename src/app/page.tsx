import { getAllChapters } from "@/lib/chapters";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { NextMoveWidget } from "@/components/dashboard/NextMoveWidget";
import { QuestMap } from "@/components/dashboard/QuestMap";

/**
 * CSRecall Home — Dynamic Hub
 *
 * Server Component: fetches chapter data via memoised static loader.
 * Interactive sections (hero CTAs, quest map hover, HUD) are Client Components.
 */
export default function HomePage() {
  const chapters = getAllChapters();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Dashboard body with rich comic canvas ── */}
      <div className="relative py-10 sm:py-14">
        {/* Subtle ambient blooms */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 left-1/4 w-80 h-80 bg-rose-500/10 blur-[100px] rounded-full -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-1/4 w-80 h-80 bg-yellow-400/10 blur-[100px] rounded-full -z-10"
        />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-10">
          {/* "Your Next Move" / Active Mission Tracker */}
          <NextMoveWidget chapters={chapters} />

          {chapters.length > 0 && <QuestMap chapters={chapters} />}
        </div>
      </div>
    </>
  );
}
