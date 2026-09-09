"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Trophy, CheckCircle2, Lock } from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { LearnMode } from "./LearnMode";
import { PracticeMode } from "./PracticeMode";
import { TrapsMode } from "./TrapsMode";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "learn" | "practice" | "traps";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "learn", label: "Learn", emoji: "📖" },
  { id: "practice", label: "Practice", emoji: "🃏" },
  { id: "traps", label: "Traps", emoji: "🪤" },
];

// ─── Mode Switcher ────────────────────────────────────────────────────────────

function ModeSwitcher({
  active,
  onChange,
}: {
  active: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-stone-100 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917]">
      {MODES.map(({ id, label, emoji }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer",
              isActive ? "text-white" : "text-stone-600 hover:text-stone-900",
            )}
          >
            {/* Sliding pill background */}
            {isActive && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#3b0764]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{emoji}</span>
              <span>{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Chapter Arena ────────────────────────────────────────────────────────────

interface ChapterArenaProps {
  chapter: Chapter;
}

export function ChapterArena({ chapter }: ChapterArenaProps) {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { completedChapterIds, completeChapter } = useGameStore();
  const isChapterCompleted = completedChapterIds.includes(chapter.id);

  // Access Gating Rule: Guest users cannot access chapters beyond Chapter 2
  const isLockedForGuest =
    status === "unauthenticated" && chapter.chapterNumber > 2;

  const rawMode = searchParams.get("mode") ?? "learn";
  const activeMode: Mode =
    rawMode === "practice" || rawMode === "traps" ? rawMode : "learn";

  function handleModeChange(mode: Mode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  if (isLockedForGuest) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-[#FAF9FE] to-[#F5F3FF]/40 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="w-96 h-96 rounded-full bg-amber-400/10 blur-[100px] pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="relative z-10 max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-900 shadow-[6px_6px_0px_0px_#1c1917] text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-stone-900 flex items-center justify-center text-3xl mx-auto shadow-[2px_2px_0px_0px_#1c1917]">
            🔒
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              MEMBER EXCLUSIVE
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2">
              Chapter {chapter.chapterNumber} is Locked
            </h2>
            <p className="text-stone-600 text-sm font-medium mt-1 leading-relaxed">
              Guest access is limited to Chapters 1 and 2. Sign in with a free
              account to unlock all 12 chapters, flashcard decks, and cloud
              progress tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link href={`/login?callbackUrl=/chapter/${chapter.id}`}>
              <Button variant="primary" className="w-full">
                Sign In to Unlock &rarr;
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Back to Quest Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9FE] via-[#F8F7FC] to-[#F5F3FF]/40 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[100px] pointer-events-none absolute -top-24 -left-24"
      />
      <div
        aria-hidden
        className="w-[450px] h-[450px] rounded-full bg-sky-400/8 blur-[100px] pointer-events-none absolute top-48 -right-24"
      />

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="bg-white/90 backdrop-blur-md border-b-2 border-stone-900 sticky top-14 sm:top-16 z-40 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Back + title row */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-black text-stone-600 hover:text-stone-900 transition-colors group cursor-pointer bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl border border-stone-300"
            >
              <ArrowLeft
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
              <span>Arena</span>
            </Link>

            <div className="w-px h-5 bg-stone-300 flex-shrink-0" />

            <h1 className="font-black text-stone-900 text-base sm:text-lg leading-tight truncate flex items-center gap-2">
              {chapter.title}
              {isChapterCompleted && (
                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </h1>

            <span className="flex-shrink-0 hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-stone-200 bg-stone-100 text-stone-600 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              {chapter.estimatedMinutes} min
            </span>
          </div>

          {/* Mode switcher */}
          <div className="flex-shrink-0 cursor-pointer self-start sm:self-auto">
            <ModeSwitcher active={activeMode} onChange={handleModeChange} />
          </div>
        </div>
      </div>

      {/* ── Mode content ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeMode === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LearnMode chapter={chapter} />
            </motion.div>
          )}

          {activeMode === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PracticeMode chapter={chapter} />
            </motion.div>
          )}

          {activeMode === "traps" && (
            <motion.div
              key="traps"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TrapsMode chapter={chapter} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chapter Complete Button ── */}
        <div className="mt-16 text-center">
          {isChapterCompleted ? (
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 text-emerald-950 border-2 border-stone-900 px-7 py-3.5 rounded-2xl shadow-[4px_4px_0px_0px_#064e3b] font-black text-base sm:text-lg">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>Chapter Mastered (+100 XP) 🏆</span>
            </div>
          ) : (
            <button
              onClick={() => {
                completeChapter(chapter.id);
                // Confetti burst for chapter complete
                void import("canvas-confetti").then(({ default: confetti }) => {
                  confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ["#7c3aed", "#f59e0b", "#10b981"],
                    scalar: 1.2,
                    disableForReducedMotion: true,
                  });
                });
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-base sm:text-lg rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1c1917] active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <CheckCircle2
                className="w-5 h-5 text-stone-950"
                strokeWidth={2.5}
              />
              <span>Mark Chapter Complete (+100 XP)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
