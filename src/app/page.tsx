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

      {/* ── Dashboard body ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* "Your Next Move" — hidden for new users, revealed after first XP */}
        <NextMoveWidget />

        {chapters.length > 0 && <QuestMap chapters={chapters} />}
      </div>
    </>
  );
}
