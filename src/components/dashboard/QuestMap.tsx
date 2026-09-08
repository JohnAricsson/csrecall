"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Clock, BookOpen, Trophy, PlayCircle } from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/stores/gameStore";
import { useHydration } from "@/hooks/useHydration";

// ─── Static metadata for chapters 2–12 ───────────────────────────────────────

const CHAPTER_META = [
  {
    id: "chapter-2",
    n: 2,
    title: "Data Structures & Arrays",
    min: 75,
    topics: 8,
  },
  {
    id: "chapter-3",
    n: 3,
    title: "Algorithms & Complexity",
    min: 90,
    topics: 10,
  },
  { id: "chapter-4", n: 4, title: "Databases & SQL", min: 60, topics: 7 },
  { id: "chapter-5", n: 5, title: "Networking & HTTP", min: 55, topics: 6 },
  { id: "chapter-6", n: 6, title: "Operating Systems", min: 65, topics: 8 },
  { id: "chapter-7", n: 7, title: "Design Patterns", min: 80, topics: 9 },
  { id: "chapter-8", n: 8, title: "System Design", min: 95, topics: 11 },
  { id: "chapter-9", n: 9, title: "JavaScript & Web APIs", min: 70, topics: 9 },
  {
    id: "chapter-10",
    n: 10,
    title: "React & State Management",
    min: 85,
    topics: 10,
  },
  { id: "chapter-11", n: 11, title: "APIs & REST", min: 50, topics: 6 },
  {
    id: "chapter-12",
    n: 12,
    title: "Behavioural & Soft Skills",
    min: 40,
    topics: 5,
  },
] as const;

// ─── Unified Chapter Tile ─────────────────────────────────────────────────────

interface ChapterTileProps {
  id: string;
  chapterNumber: number;
  title: string;
  estimatedMinutes: number;
  topicCount: number;
  /** Chapter has been fully completed by the player */
  isCompleted?: boolean;
  /** Chapter has live data and is the primary focus */
  isReady?: boolean;
  /** 0–100 completion progress */
  progress?: number;
  /** Framer Motion entrance delay (seconds) */
  delay?: number;
}

function ChapterTile({
  id,
  chapterNumber,
  title,
  estimatedMinutes,
  topicCount,
  isCompleted = false,
  isReady = false,
  progress = 0,
  delay = 0,
}: ChapterTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/chapter/${id}`} className="block h-full">
        <Card className="h-full p-5 cursor-pointer hover:border-violet-600 transition-colors group">
          {/* Header badges */}
          <div className="flex items-start justify-between mb-3 gap-2">
            <Badge variant="violet">Ch. {chapterNumber}</Badge>

            {isCompleted ? (
              <Badge variant="emerald">
                <Trophy className="w-3 h-3" />
                Mastered
              </Badge>
            ) : isReady ? (
              <Badge variant="amber">
                <Zap className="w-3 h-3" />
                Ready
              </Badge>
            ) : (
              <Badge variant="sky">
                <PlayCircle className="w-3 h-3" />
                Available
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-black text-stone-900 text-base leading-tight mb-1 group-hover:text-violet-700 transition-colors">
            {title}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-stone-500 font-bold mb-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {topicCount} topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {estimatedMinutes} min
            </span>
          </div>

          {/* Progress bar */}
          <ProgressBar
            value={progress}
            variant={isCompleted ? "readiness" : "topic"}
          />

          <p className="text-xs text-stone-400 mt-2 font-medium">
            {isCompleted
              ? "100% complete 🎉"
              : isReady
                ? "Start learning →"
                : "Coming soon →"}
          </p>
        </Card>
      </Link>
    </motion.div>
  );
}

// ─── Quest Map ────────────────────────────────────────────────────────────────

interface QuestMapProps {
  chapter1: Chapter;
}

export function QuestMap({ chapter1 }: QuestMapProps) {
  const hydrated = useHydration();
  const completedChapterIds = useGameStore((s) => s.completedChapterIds);
  const chapter1Done = hydrated && completedChapterIds.includes("chapter-1");

  const chapter1Topics = chapter1.sections.reduce(
    (acc, s) => acc + s.topics.length,
    0,
  );

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            📍 Quest Map
          </h2>
          <p className="text-stone-500 text-sm mt-1 font-medium">
            12 chapters of interview-ready CS knowledge.
          </p>
        </div>
        <Badge variant="violet">
          {hydrated ? completedChapterIds.length : 0} / 12 done
        </Badge>
      </div>

      {/* All 12 chapters — no locks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chapter 1 — live data, ⚡ Ready / ✓ Mastered */}
        <ChapterTile
          id={chapter1.id}
          chapterNumber={chapter1.chapterNumber}
          title={chapter1.title}
          estimatedMinutes={chapter1.estimatedMinutes}
          topicCount={chapter1Topics}
          isCompleted={chapter1Done}
          isReady={!chapter1Done}
          progress={chapter1Done ? 100 : 0}
          delay={0}
        />

        {/* Chapters 2–12 — all available (static metadata) */}
        {CHAPTER_META.map((ch, i) => (
          <ChapterTile
            key={ch.id}
            id={ch.id}
            chapterNumber={ch.n}
            title={ch.title}
            estimatedMinutes={ch.min}
            topicCount={ch.topics}
            isCompleted={false}
            isReady={false}
            progress={0}
            delay={(i + 1) * 0.05}
          />
        ))}
      </div>
    </section>
  );
}
