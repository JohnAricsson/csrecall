"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import {
  Zap,
  Clock,
  BookOpen,
  Trophy,
  PlayCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { useHydration } from "@/hooks/useHydration";
import { cn } from "@/lib/utils";

// ─── Title Case Helper ────────────────────────────────────────────────────────

function toTitleCase(title: string): string {
  const ACRONYMS = new Set([
    "OOP",
    "OS",
    "SQL",
    "CPU",
    "RAM",
    "CAP",
    "I/O",
    "API",
    "REST",
    "HTTP",
    "TCP",
    "IP",
    "DNS",
    "ACID",
    "JVM",
  ]);
  return title
    .split(" ")
    .map((word) => {
      if (!word) return "";
      const cleanWord = word.replace(/[^a-zA-Z0-9/]/g, "").toUpperCase();
      if (ACRONYMS.has(cleanWord)) {
        return word.replace(cleanWord, cleanWord);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

// ─── Chapter Color Themes (Chapters 1-12) ────────────────────────────────────

interface ChapterTheme {
  accentColor: string;
  badgeVariant:
    | "violet"
    | "sky"
    | "cyan"
    | "pink"
    | "orange"
    | "indigo"
    | "emerald"
    | "rose"
    | "amber";
  spotlightRgba: string;
  cardBg: string;
  hoverGlow: string;
}

const CHAPTER_THEMES: Record<number, ChapterTheme> = {
  1: {
    accentColor: "from-violet-500 to-indigo-600",
    badgeVariant: "violet",
    spotlightRgba: "rgba(124, 58, 237, 0.12)",
    cardBg: "from-[#FAF8FF] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(124,58,237,0.16)]",
  },
  2: {
    accentColor: "from-blue-500 to-cyan-500",
    badgeVariant: "sky",
    spotlightRgba: "rgba(14, 165, 233, 0.12)",
    cardBg: "from-[#F2F8FD] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(14,165,233,0.16)]",
  },
  3: {
    accentColor: "from-teal-500 to-emerald-500",
    badgeVariant: "cyan",
    spotlightRgba: "rgba(20, 184, 166, 0.12)",
    cardBg: "from-[#F0FDF8] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(20,184,166,0.16)]",
  },
  4: {
    accentColor: "from-rose-500 to-pink-500",
    badgeVariant: "pink",
    spotlightRgba: "rgba(244, 63, 94, 0.12)",
    cardBg: "from-[#FFF5F7] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(244,63,94,0.16)]",
  },
  5: {
    accentColor: "from-amber-500 to-orange-500",
    badgeVariant: "orange",
    spotlightRgba: "rgba(245, 158, 11, 0.12)",
    cardBg: "from-[#FFF8F0] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(245,158,11,0.16)]",
  },
  6: {
    accentColor: "from-indigo-500 to-violet-600",
    badgeVariant: "indigo",
    spotlightRgba: "rgba(99, 102, 241, 0.12)",
    cardBg: "from-[#F5F3FF] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(99,102,241,0.16)]",
  },
  7: {
    accentColor: "from-emerald-500 to-teal-600",
    badgeVariant: "emerald",
    spotlightRgba: "rgba(16, 185, 129, 0.12)",
    cardBg: "from-[#F0FDF4] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(16,185,129,0.16)]",
  },
  8: {
    accentColor: "from-fuchsia-500 to-purple-600",
    badgeVariant: "pink",
    spotlightRgba: "rgba(217, 70, 239, 0.12)",
    cardBg: "from-[#FDF2F8] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(217,70,239,0.16)]",
  },
  9: {
    accentColor: "from-sky-500 to-blue-600",
    badgeVariant: "sky",
    spotlightRgba: "rgba(2, 132, 199, 0.12)",
    cardBg: "from-[#F0F9FF] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(2,132,199,0.16)]",
  },
  10: {
    accentColor: "from-rose-600 to-red-600",
    badgeVariant: "rose",
    spotlightRgba: "rgba(225, 29, 72, 0.12)",
    cardBg: "from-[#FFF1F2] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(225,29,72,0.16)]",
  },
  11: {
    accentColor: "from-amber-400 to-yellow-500",
    badgeVariant: "amber",
    spotlightRgba: "rgba(217, 119, 6, 0.12)",
    cardBg: "from-[#FEFCE8] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(217,119,6,0.16)]",
  },
  12: {
    accentColor: "from-emerald-500 to-green-600",
    badgeVariant: "emerald",
    spotlightRgba: "rgba(5, 150, 105, 0.12)",
    cardBg: "from-[#ECFDF5] to-white",
    hoverGlow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(5,150,105,0.16)]",
  },
};

function getChapterTheme(num: number): ChapterTheme {
  return (
    CHAPTER_THEMES[num] ?? {
      accentColor: "from-violet-500 to-indigo-600",
      badgeVariant: "violet",
      spotlightRgba: "rgba(124, 58, 237, 0.12)",
      cardBg: "from-[#FAF8FF] to-white",
      hoverGlow:
        "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(124,58,237,0.16)]",
    }
  );
}

// ─── Chapter Card Component ───────────────────────────────────────────────────

interface ChapterCardProps {
  chapter: Chapter;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number;
  topicCount: number;
  delay: number;
  onLockedClick: (chapter: Chapter) => void;
}

function ChapterCard({
  chapter,
  isCompleted,
  isLocked,
  progress,
  topicCount,
  delay,
  onLockedClick,
}: ChapterCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const theme = getChapterTheme(chapter.chapterNumber);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    if (isLocked) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const normalizedTitle = toTitleCase(chapter.title);

  const cardContent = (
    <Card
      onMouseMove={handleMouseMove}
      className={cn(
        "relative h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-200 group select-none",
        isLocked
          ? "bg-stone-50/90 border-dashed border-2 border-stone-300 shadow-[3px_3px_0px_0px_#a8a29e] cursor-pointer hover:border-stone-500 hover:-translate-y-0.5"
          : cn(
              "bg-gradient-to-b border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#1c1917] hover:border-stone-900 cursor-pointer",
              theme.cardBg,
              theme.hoverGlow,
            ),
      )}
    >
      {/* Top thematic accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
          isLocked ? cn(theme.accentColor, "opacity-40") : theme.accentColor,
        )}
      />

      {/* Aceternity CardSpotlight Cursor Highlight (unlocked only) */}
      {!isLocked && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, ${theme.spotlightRgba}, transparent 80%)`,
          }}
        />
      )}

      <div className="pt-1">
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <Badge
            variant={isLocked ? "stone" : theme.badgeVariant}
            className={cn(
              "px-2.5 py-0.5 text-xs font-black uppercase tracking-wider",
              isLocked &&
                "bg-stone-200 text-stone-600 border-stone-300 shadow-none",
            )}
          >
            CH. {chapter.chapterNumber}
          </Badge>

          {isLocked ? (
            <Badge
              variant="stone"
              className="px-2 py-0.5 text-xs font-black gap-1 bg-stone-200 text-stone-700 border-stone-300 shadow-none"
            >
              <Lock className="w-3 h-3 text-stone-500" />
              LOCKED
            </Badge>
          ) : isCompleted ? (
            <Badge
              variant="emerald"
              className="px-2 py-0.5 text-xs font-black gap-1"
            >
              <Trophy className="w-3 h-3 text-amber-300" />
              COMPLETED 🏆
            </Badge>
          ) : progress > 0 ? (
            <Badge
              variant="amber"
              className="px-2 py-0.5 text-xs font-black gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              IN FLIGHT ({progress}%)
            </Badge>
          ) : (
            <Badge
              variant="sky"
              className="px-2 py-0.5 text-xs font-black gap-1"
            >
              <PlayCircle className="w-3 h-3" />
              READY
            </Badge>
          )}
        </div>

        {/* Title (2 full lines min-height for clean alignment) */}
        <h3
          title={normalizedTitle}
          className={cn(
            "min-h-[3rem] line-clamp-2 font-black text-base leading-snug mb-2 transition-colors",
            isLocked
              ? "text-stone-500 font-bold"
              : "text-stone-900 group-hover:text-violet-700",
          )}
        >
          {normalizedTitle}
        </h3>

        {/* Metadata row */}
        <div className="flex items-center gap-3 text-xs text-stone-500 font-bold mb-3.5">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-stone-400" />
            {topicCount} topics
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {chapter.estimatedMinutes} min
          </span>
        </div>
      </div>

      <div>
        {/* Active Progress Track */}
        <div className="h-2.5 w-full overflow-hidden rounded-full border border-stone-900 bg-stone-200/90 shadow-inner">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isCompleted
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : progress > 0
                  ? "bg-gradient-to-r from-violet-500 to-indigo-600 shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                  : "bg-transparent",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-stone-400 mt-2.5">
          <span className="font-semibold text-stone-500">
            {isLocked
              ? "Sign in to access"
              : isCompleted
                ? "100% Mastered 🎉"
                : progress > 0
                  ? `${progress}% in progress`
                  : "Start learning"}
          </span>

          <span
            className={cn(
              "font-black inline-flex items-center gap-0.5 transition-colors",
              isLocked
                ? "text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 group-hover:bg-amber-200"
                : "text-stone-900 group-hover:text-violet-600",
            )}
          >
            {isLocked ? (
              <>Unlock 🚀</>
            ) : (
              <>
                Open{" "}
                <ArrowRight
                  className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={2.5}
                />
              </>
            )}
          </span>
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay }}
      className="h-full"
    >
      {isLocked ? (
        <div
          onClick={() => onLockedClick(chapter)}
          role="button"
          tabIndex={0}
          className="block h-full"
        >
          {cardContent}
        </div>
      ) : (
        <Link href={`/chapter/${chapter.id}`} className="block h-full">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}

// ─── Quest Map Component ──────────────────────────────────────────────────────

interface QuestMapProps {
  chapters: Chapter[];
}

export function QuestMap({ chapters }: QuestMapProps) {
  const { status } = useSession();
  const hydrated = useHydration();
  const completedChapterIds = useGameStore((s) => s.completedChapterIds);
  const completedTopics = useGameStore((s) => s.completedTopics);

  const isAuthenticated = status === "authenticated";

  // Unlock modal state
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedLockedChapter, setSelectedLockedChapter] =
    useState<Chapter | null>(null);

  const handleLockedClick = (chapter: Chapter) => {
    setSelectedLockedChapter(chapter);
    setShowUnlockModal(true);
  };

  return (
    <section id="quest-map" className="scroll-mt-24">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              📍 Quest Map
            </h2>
            {!isAuthenticated && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-black uppercase px-2 py-0.5 rounded-md">
                Guest Mode: Ch. 1 &amp; 2 Free
              </span>
            )}
          </div>
          <p className="text-stone-500 text-sm mt-1 font-medium">
            12 chapters of interview-ready CS knowledge. Master gotchas, defuse
            traps, clear interviews.
          </p>
        </div>

        <Badge
          variant="violet"
          className="px-3 py-1 font-black text-xs self-start sm:self-auto"
        >
          {hydrated ? completedChapterIds.length : 0} / {chapters.length}{" "}
          mastered
        </Badge>
      </div>

      {/* Grid of Chapter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {chapters.map((chapter, i) => {
          const isCompleted =
            hydrated && completedChapterIds.includes(chapter.id);
          const totalTopics = chapter.sections.reduce(
            (acc, s) => acc + s.topics.length,
            0,
          );
          const finishedTopics = chapter.sections.reduce(
            (acc, s) =>
              acc +
              s.topics.filter((t) => completedTopics.includes(t.id)).length,
            0,
          );

          const progress = isCompleted
            ? 100
            : totalTopics > 0
              ? Math.round((finishedTopics / totalTopics) * 100)
              : 0;

          // Access gating rule:
          // Unauthenticated guests only get Chapters 1 & 2.
          // Authenticated users get all chapters.
          const isLocked = !isAuthenticated && chapter.chapterNumber > 2;

          return (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isCompleted={isCompleted}
              isLocked={isLocked}
              progress={progress}
              topicCount={totalTopics}
              delay={i * 0.03}
              onLockedClick={handleLockedClick}
            />
          );
        })}
      </div>

      {/* ── High-Contrast Neo-Brutalist Unlock Modal ── */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 sm:p-8 space-y-5 bg-white border-2 border-stone-900 shadow-[8px_8px_0px_0px_#1c1917] relative">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 font-black p-1 cursor-pointer"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917] text-2xl flex-shrink-0">
                    🚀
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      ARENA ACCESS
                    </span>
                    <h3 className="font-black text-2xl text-stone-900 leading-tight mt-0.5">
                      Unlock the Full Arena 🚀
                    </h3>
                  </div>
                </div>

                {selectedLockedChapter && (
                  <div className="p-3 bg-stone-100 rounded-xl border border-stone-300 text-xs text-stone-700 font-bold">
                    Target: Chapter {selectedLockedChapter.chapterNumber} —{" "}
                    {toTitleCase(selectedLockedChapter.title)}
                  </div>
                )}

                <p className="text-stone-700 text-sm leading-relaxed font-medium">
                  Chapters 3 through 12, the full 60+ trap bank, and cloud
                  progress tracking require a free account.
                </p>

                <div className="space-y-2 bg-violet-50/60 p-3.5 rounded-xl border border-violet-200 text-xs text-stone-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>{" "}
                    1-click free sign in with Google or email
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>{" "}
                    Persistent XP, streaks &amp; Badge Matrix saved to MongoDB
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span> Full
                    access to all 12 chapters &amp; rapid flashcard decks
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUnlockModal(false)}
                    className="flex-1 cursor-pointer order-2 sm:order-1"
                  >
                    Keep Exploring
                  </Button>
                  <Link href="/login" className="flex-1 order-1 sm:order-2">
                    <Button
                      variant="primary"
                      className="w-full cursor-pointer !bg-violet-600 hover:!bg-violet-700 shadow-[3px_3px_0px_0px_#1c1917]"
                    >
                      Sign In / Free Account &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
