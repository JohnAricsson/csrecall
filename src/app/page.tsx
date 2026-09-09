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

      {/* ── Dashboard body with distinct tinted section surface ── */}
      <div className="relative border-t border-stone-200/70 bg-gradient-to-b from-[#F5F3FF]/70 via-[#F8FAFC]/90 to-[#F8F7FC] py-10 sm:py-14">
        {/* Subtle ambient corner blooms */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 left-1/4 w-80 h-80 bg-violet-400/10 blur-[100px] rounded-full -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-1/4 w-80 h-80 bg-sky-400/10 blur-[100px] rounded-full -z-10"
        />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-10">
          {/* "Your Next Move" — hidden for new users, revealed after first XP */}
          <NextMoveWidget />

          {chapters.length > 0 && <QuestMap chapters={chapters} />}
        </div>
      </div>
    </>
  );
}
