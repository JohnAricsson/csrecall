"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Trophy, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { Chapter } from "@/lib/schema";
import { LearnMode } from "./LearnMode";

const PracticeMode = dynamic(
  () => import("./PracticeMode").then((m) => m.PracticeMode),
  {
    loading: () => (
      <div className="flex justify-center items-center py-16 text-stone-500 font-bold text-sm">
        ফ্ল্যাশকার্ড লোড হচ্ছে...
      </div>
    ),
  },
);

const TrapsMode = dynamic(
  () => import("./TrapsMode").then((m) => m.TrapsMode),
  {
    loading: () => (
      <div className="flex justify-center items-center py-16 text-stone-500 font-bold text-sm">
        ট্র্যাপস লোড হচ্ছে...
      </div>
    ),
  },
);
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/Button";
import { toBengaliDigits } from "@/lib/topicUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "learn" | "practice" | "traps";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "learn", label: "শিখুন", emoji: "📖" },
  { id: "practice", label: "প্র্যাকটিস", emoji: "🗂️" },
  { id: "traps", label: "ট্র্যাপস", emoji: "🪤" },
];

// ─── Mode Switcher ────────────────────────────────────────────────────────────

function ModeSwitcher({
  active,
  isGuest,
  onChange,
  onLockedClick,
}: {
  active: Mode;
  isGuest: boolean;
  onChange: (m: Mode) => void;
  onLockedClick: (m: Mode) => void;
}) {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 w-full sm:w-auto bg-stone-100 p-1 border-2 border-black rounded-xl">
      {MODES.map(({ id, label, emoji }) => {
        const isActive = active === id;
        const isLocked = isGuest && (id === "practice" || id === "traps");

        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (isLocked) {
                onLockedClick(id);
              } else {
                onChange(id);
              }
            }}
            className={cn(
              "relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold sm:font-black transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer flex-1 sm:flex-initial text-center justify-center",
              isActive && !isLocked
                ? "bg-amber-300 text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                : isLocked
                  ? "text-stone-500 opacity-70 hover:opacity-100 border-2 border-dashed border-stone-400"
                  : "text-stone-700 hover:text-black border-2 border-transparent",
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 font-bold sm:font-black">
              <span>{isLocked ? "🔒" : emoji}</span>
              <span>{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Comic-Arcade Unlock Modal ────────────────────────────────────────────────

interface UnlockModalProps {
  chapterId: string;
  onClose: () => void;
}

function UnlockModal({ chapterId, onClose }: UnlockModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#fffdf7] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] rounded-2xl p-4 sm:p-6 md:p-8 max-w-md mx-auto text-stone-900 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
              🔒
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                সদস্যদের জন্য
              </span>
              <h3 className="font-black text-lg sm:text-xl text-black leading-tight mt-1">
                ⚡ প্লেয়ার সাইন-ইন প্রয়োজন
              </h3>
            </div>
          </div>

          <p className="text-stone-800 text-sm font-semibold leading-relaxed">
            সাইন ইন করে আপনার XP ট্র্যাক করুন, ডেইলি স্ট্রিক তৈরি করুন,
            ফ্ল্যাশকার্ড আনলক করুন এবং ইন্টারভিউ ট্র্যাপস প্র্যাকটিস করুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <Link
              href={`/login?callbackUrl=/chapter/${chapterId}`}
              className="w-full sm:flex-1 text-center bg-amber-400 hover:bg-amber-300 text-black font-black border-2 border-black shadow-[3px_3px_0px_0px_#000] px-4 py-2 rounded-xl cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              লগইন / রেজিস্টার
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-stone-200 hover:bg-stone-300 border-2 border-black text-black font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              পড়া চালিয়ে যান
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Chapter Arena ────────────────────────────────────────────────────────────

interface ChapterArenaProps {
  chapter: Chapter;
}

export function ChapterArena({ chapter }: ChapterArenaProps) {
  const { status } = useSession();
  const isGuest = status === "unauthenticated";

  const searchParams = useSearchParams();
  const router = useRouter();

  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const completedChapterIds = useGameStore((s) => s.completedChapterIds);
  const completeChapter = useGameStore((s) => s.completeChapter);
  const isChapterCompleted = completedChapterIds.includes(chapter.id);

  // Access Gating Rule: Guest users cannot access chapters beyond Chapter 2
  const isLockedForGuest = isGuest && chapter.chapterNumber > 2;

  const rawMode = searchParams.get("mode") ?? "learn";

  // If unauthenticated guest lands on ?mode=practice or ?mode=traps, default to learn
  const activeMode: Mode =
    isGuest && (rawMode === "practice" || rawMode === "traps")
      ? "learn"
      : rawMode === "practice" || rawMode === "traps"
        ? rawMode
        : "learn";

  // Direct URL protection: trigger modal when guest lands on locked mode
  useEffect(() => {
    if (isGuest && (rawMode === "practice" || rawMode === "traps")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowUnlockModal(true);
    }
  }, [isGuest, rawMode]);

  function handleModeChange(mode: Mode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function handleDismissModal() {
    setShowUnlockModal(false);
    if (
      searchParams.get("mode") === "practice" ||
      searchParams.get("mode") === "traps"
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", "learn");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }

  async function handleMasterChapter() {
    if (status !== "authenticated") {
      setShowUnlockModal(true);
      return;
    }

    if (isChapterCompleted) {
      return;
    }

    completeChapter(chapter.id);

    try {
      const nextChapters = Array.from(
        new Set([...completedChapterIds, chapter.id]),
      );
      const nextXp = useGameStore.getState().xp || 0;

      await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: nextXp,
          streakDays: useGameStore.getState().streakDays || 0,
          completedChapterIds: nextChapters,
          completedTopics: useGameStore.getState().completedTopics || [],
          defusedTraps: useGameStore.getState().defusedTrapIds || [],
          masteredFlashcards:
            useGameStore.getState().masteredFlashcardIds || [],
        }),
      });
    } catch (err) {
      console.error("Failed to sync progress:", err);
    }

    // Multi-colored arcade confetti burst
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#facc15", "#fb7185", "#34d399", "#38bdf8"],
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    });
  }

  if (isLockedForGuest) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full bg-[#fffdf7] p-6 sm:p-8 rounded-2xl border-[3px] border-black shadow-[8px_8px_0px_0px_#000] text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-yellow-300 border-[3px] border-black flex items-center justify-center text-3xl mx-auto shadow-[3px_3px_0px_0px_#000]">
            🔒
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-black bg-yellow-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
              MEMBER EXCLUSIVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-black mt-2">
              Level {chapter.chapterNumber} is Locked
            </h2>
            <p className="text-stone-800 text-sm font-bold mt-1 leading-relaxed">
              Guest access is limited to Chapters 1 and 2. Sign in with a free
              account to unlock all 12 chapters, flashcard decks, and cloud
              progress tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link href={`/login?callbackUrl=/chapter/${chapter.id}`}>
              <Button variant="accent" className="w-full">
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
    <div className="min-h-screen pt-4 sm:pt-6 pb-20 relative overflow-hidden">
      {/* ── Unlock Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUnlockModal && (
          <UnlockModal chapterId={chapter.id} onClose={handleDismissModal} />
        )}
      </AnimatePresence>

      {/* ── Secondary Control Bar (Floating Neo-Brutalist Panel, offset from Navbar) ── */}
      <div className="sticky top-16 sm:top-20 md:top-24 z-30 px-3.5 sm:px-6 mb-4 sm:mb-5">
        <div className="bg-[#fffdf7] text-stone-900 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-2xl p-2.5 sm:p-3 md:p-3.5 max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Back + title row */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-black text-black hover:text-rose-600 transition-colors group cursor-pointer bg-yellow-300 hover:bg-yellow-400 px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]"
            >
              <ArrowLeft
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={3}
              />
              <span>BACK</span>
            </Link>

            <div className="w-0.5 h-6 bg-black flex-shrink-0" />

            <h1 className="font-black text-stone-900 text-base sm:text-lg leading-tight truncate flex items-center gap-2">
              {chapter.title}
              {isChapterCompleted && (
                <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
              )}
            </h1>

            <span className="flex-shrink-0 hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-black bg-[#fffdf7] text-stone-900 text-xs font-black shadow-[1px_1px_0px_0px_#000]">
              <Clock className="w-3.5 h-3.5 text-stone-900" />
              ⏱️ {toBengaliDigits(chapter.estimatedMinutes)} মিনিট
            </span>
          </div>

          {/* Mode switcher */}
          <div className="flex-shrink-0 cursor-pointer w-full sm:w-auto flex justify-center sm:justify-end">
            <ModeSwitcher
              active={activeMode}
              isGuest={isGuest}
              onChange={handleModeChange}
              onLockedClick={() => setShowUnlockModal(true)}
            />
          </div>
        </div>
      </div>

      {/* ── Mode content ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <AnimatePresence mode="wait">
          {activeMode === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LearnMode
                chapter={chapter}
                isGuest={isGuest}
                onRequireAuth={() => setShowUnlockModal(true)}
              />
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
          <button
            type="button"
            disabled={isChapterCompleted}
            onClick={handleMasterChapter}
            className={cn(
              "inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl border-[3px] border-black font-black text-base sm:text-lg uppercase tracking-wider transition-all",
              isChapterCompleted
                ? "bg-emerald-200 text-emerald-950 border-[3px] border-black opacity-90 cursor-default shadow-[3px_3px_0px_0px_#000]"
                : "bg-emerald-400 hover:bg-emerald-300 text-stone-950 border-[3px] border-black font-black shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer hover:-translate-y-0.5",
            )}
          >
            {isChapterCompleted ? (
              <>
                <CheckCircle2
                  className="w-6 h-6 text-emerald-950"
                  strokeWidth={3}
                />
                <span>✓ চ্যাপ্টার ক্লিয়ার (+১০০ XP)</span>
              </>
            ) : (
              <>
                <Trophy className="w-6 h-6 text-stone-950" />
                <span>🏆 চ্যাপ্টার সম্পন্ন (+১০০ XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
