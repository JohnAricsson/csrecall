"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Lock, ArrowRight } from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { isTopicCompleted, getLearnableTopics } from "@/lib/topicUtils";
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

// ─── Arcade Comic Chapter Themes (Grouped into 3 Tiers) ───────────────────────

interface ChapterTheme {
  tierName: string;
  tierTag: string;
  tierBadgeClass: string;
  accentBar: string;
  cardBorder: string;
  hoverGlow: string;
  badgeVariant: "mint" | "sky" | "orange";
}

function getChapterTheme(num: number): ChapterTheme {
  if (num <= 4) {
    // Tier 1: Foundations (Ch 1–4) — Mint / Lime comic borders & badges
    return {
      tierName: "TIER 1: FOUNDATIONS",
      tierTag: "Mint Arcade",
      tierBadgeClass: "bg-emerald-300 text-black border-black",
      accentBar: "bg-emerald-400",
      cardBorder: "border-black hover:border-emerald-500",
      hoverGlow: "hover:shadow-[6px_6px_0px_0px_#000]",
      badgeVariant: "mint",
    };
  } else if (num <= 8) {
    // Tier 2: Core Engineering (Ch 5–8) — High-voltage Sky / Cyan borders & badges
    return {
      tierName: "TIER 2: CORE ENGINEERING",
      tierTag: "High Voltage",
      tierBadgeClass: "bg-sky-300 text-black border-black",
      accentBar: "bg-sky-400",
      cardBorder: "border-black hover:border-sky-500",
      hoverGlow: "hover:shadow-[6px_6px_0px_0px_#000]",
      badgeVariant: "sky",
    };
  } else {
    // Tier 3: Systems & Defense (Ch 9–12) — Sunset Orange / Coral borders & badges
    return {
      tierName: "TIER 3: SYSTEMS & DEFENSE",
      tierTag: "Boss Arena",
      tierBadgeClass: "bg-orange-300 text-black border-black",
      accentBar: "bg-amber-400",
      cardBorder: "border-black hover:border-amber-500",
      hoverGlow: "hover:shadow-[6px_6px_0px_0px_#000]",
      badgeVariant: "orange",
    };
  }
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

const ChapterCard = memo(function ChapterCard({
  chapter,
  isCompleted,
  isLocked,
  progress,
  topicCount,
  delay,
  onLockedClick,
}: ChapterCardProps) {
  const theme = getChapterTheme(chapter.chapterNumber);
  const normalizedTitle = toTitleCase(chapter.title);

  const cardContent = (
    <Card
      className={cn(
        "relative h-full p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-200 group select-none",
        isLocked
          ? "bg-[#fffdf7]/80 border-[3px] border-dashed border-stone-600 shadow-[3px_3px_0px_0px_#000] cursor-pointer hover:border-black hover:-translate-y-0.5"
          : cn(
              "bg-[#fffdf7] border-[3px] shadow-[5px_5px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#000] cursor-pointer",
              theme.cardBorder,
              theme.hoverGlow,
            ),
      )}
    >
      {/* Top thematic accent line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-2 border-b-2 border-black",
          isLocked ? "bg-stone-400 opacity-60" : theme.accentBar,
        )}
      />

      <div className="pt-1">
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2.5 gap-2">
          <Badge
            variant={isLocked ? "stone" : theme.badgeVariant}
            className={cn(
              "px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black uppercase tracking-wider",
              isLocked &&
                "bg-stone-300 text-stone-700 border-black shadow-[1px_1px_0px_0px_#000]",
            )}
          >
            LVL{" "}
            {chapter.chapterNumber < 10
              ? `0${chapter.chapterNumber}`
              : chapter.chapterNumber}
          </Badge>

          {isLocked ? (
            <Badge
              variant="stone"
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black gap-1 bg-stone-300 text-stone-800 border-black shadow-[1px_1px_0px_0px_#000]"
            >
              <Lock className="w-3 h-3 text-black" />
              LOCKED
            </Badge>
          ) : isCompleted ? (
            <Badge
              variant="emerald"
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black gap-1"
            >
              🏆 সম্পন্ন
            </Badge>
          ) : progress > 0 ? (
            <Badge
              variant="amber"
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black gap-1"
            >
              ⚡ চলমান ({progress}%)
            </Badge>
          ) : (
            <Badge
              variant="sky"
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold sm:font-black gap-1"
            >
              ▶ শুরু করুন
            </Badge>
          )}
        </div>

        {/* Title (2 full lines min-height for clean alignment, no cutting off) */}
        <h3
          title={normalizedTitle}
          className={cn(
            "min-h-[2.5rem] sm:min-h-[3rem] line-clamp-2 font-black text-sm sm:text-base leading-tight mt-1.5 mb-1 sm:mb-2 transition-colors",
            isLocked
              ? "text-stone-500 font-bold"
              : "text-black group-hover:text-rose-600",
          )}
        >
          {normalizedTitle}
        </h3>

        {/* Metadata row */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-stone-700 font-bold sm:font-black mb-2 sm:mb-3.5">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-black" />
            {topicCount} টি টপিক
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-black" />
            {chapter.estimatedMinutes} মিনিট
          </span>
        </div>
      </div>

      <div>
        {/* Health-bar Style Progress Track */}
        <div className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full border-2 border-black bg-stone-200 shadow-[1px_1px_0px_0px_#000] my-2 sm:my-3">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 border-r border-black relative overflow-hidden",
              isCompleted
                ? "bg-emerald-400"
                : progress > 0
                  ? "bg-yellow-400"
                  : "bg-transparent",
            )}
            style={{ width: `${progress}%` }}
          >
            {progress > 0 && (
              <div className="absolute inset-0 bg-comic-stripes opacity-30" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-stone-600 mt-1.5 sm:mt-2.5">
          <span className="font-bold text-stone-800">
            {isLocked
              ? "Sign in to unlock"
              : isCompleted
                ? "১০০% সম্পন্ন 🎉"
                : progress > 0
                  ? `${progress}% সম্পন্ন হয়েছে`
                  : "শুরু করুন"}
          </span>

          <span
            className={cn(
              "font-black text-[11px] sm:text-xs inline-flex items-center gap-0.5 transition-colors",
              isLocked
                ? "text-black bg-yellow-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] group-hover:bg-yellow-400"
                : "text-black group-hover:text-rose-600",
            )}
          >
            {isLocked ? (
              <>Unlock 🚀</>
            ) : (
              <>
                প্রবেশ করুন{" "}
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={3}
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
      className="w-full h-full"
    >
      {isLocked ? (
        <div
          onClick={() => onLockedClick(chapter)}
          role="button"
          tabIndex={0}
          className="block w-full h-full cursor-pointer"
        >
          {cardContent}
        </div>
      ) : (
        <Link href={`/chapter/${chapter.id}`} className="block w-full h-full">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
});

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

  const handleLockedClick = useCallback((chapter: Chapter) => {
    setSelectedLockedChapter(chapter);
    setShowUnlockModal(true);
  }, []);

  return (
    <section id="quest-map" className="scroll-mt-12">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 bg-[#fffdf7] p-3.5 sm:p-5 md:p-6 rounded-2xl border-[3px] border-black shadow-[5px_5px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-black tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span>📍</span>
              <span>QUEST MAP</span>
            </h2>
            {!isAuthenticated && (
              <span className="bg-yellow-300 text-black border-2 border-black text-[10px] sm:text-xs font-black uppercase px-2 sm:px-2.5 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000] rotate-[-1deg]">
                গেস্ট মোড: ১ম ও ২য় চ্যাপ্টার সম্পূর্ণ ফ্রি!
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm md:text-base font-medium text-stone-700 leading-relaxed mt-1 mb-1.5 sm:mb-0">
            ইন্টারভিউ ক্র্যাক করার ১২টি আর্কেড লেভেল। ট্রিকি ফাঁদগুলো শিখুন আর
            সহজেই ইন্টারভিউ ক্লিয়ার করুন।
          </p>
        </div>

        <Badge
          variant="amber"
          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-black text-[10px] sm:text-xs self-start sm:self-auto shadow-[2px_2px_0px_0px_#000]"
        >
          {hydrated ? completedChapterIds.length : 0} / {chapters.length}{" "}
          CLEARED
        </Badge>
      </div>
      {/* Grid of Chapter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {chapters.map((chapter, i) => {
          const isCompleted =
            hydrated && completedChapterIds.includes(chapter.id);
          const learnableTopics = getLearnableTopics(chapter);
          const totalTopics = learnableTopics.length;
          const finishedTopics = learnableTopics.filter((t) =>
            isTopicCompleted(completedTopics, chapter.id, t.id),
          ).length;

          const progress = isCompleted
            ? 100
            : totalTopics > 0
              ? Math.round((finishedTopics / totalTopics) * 100)
              : 0;

          // Access gating rule: Guest users only get Chapters 1 & 2
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

      {/* ── High-Contrast Borderlands Comic Unlock Modal ── */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 sm:p-8 space-y-5 bg-[#fffdf7] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] relative">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="absolute top-4 right-4 text-black hover:text-rose-600 font-black p-1 cursor-pointer text-lg"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-300 border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] text-2xl flex-shrink-0">
                    🚀
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-yellow-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                      অ্যারেনা অ্যাক্সেস
                    </span>
                    <h3 className="font-black text-2xl text-black leading-tight mt-0.5">
                      পুরো অ্যারেনা আনলক করুন
                    </h3>
                  </div>
                </div>

                {selectedLockedChapter && (
                  <div className="p-3 bg-yellow-100 rounded-xl border-2 border-black text-xs text-black font-black">
                    টার্গেট: Chapter {selectedLockedChapter.chapterNumber} —{" "}
                    {toTitleCase(selectedLockedChapter.title)}
                  </div>
                )}

                <p className="text-stone-800 text-sm leading-relaxed font-bold">
                  Chapter 3 থেকে 12, সম্পূর্ণ 200+ ট্র্যাপ ব্যাংক এবং cloud
                  progress tracking ব্যবহার করতে একটি ফ্রি অ্যাকাউন্ট প্রয়োজন।
                </p>

                <div className="space-y-2 bg-emerald-50 p-3.5 rounded-xl border-2 border-black text-xs text-black font-bold shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-black">✓</span>{" "}
                    Google বা ইমেইল দিয়ে এক ক্লিকেই ফ্রিতে সাইন ইন করুন
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-black">✓</span> সব
                    ১২টি চ্যাপ্টার এবং ফ্ল্যাশকার্ড ডেকে সম্পূর্ণ অ্যাক্সেস
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUnlockModal(false)}
                    className="flex-1 cursor-pointer order-2 sm:order-1"
                  >
                    ঘুরে দেখুন
                  </Button>
                  <Link href="/login" className="flex-1 order-1 sm:order-2">
                    <Button
                      variant="accent"
                      className="w-full cursor-pointer shadow-[3px_3px_0px_0px_#000]"
                    >
                      ফ্রিতে সাইন ইন করুন &rarr;
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
