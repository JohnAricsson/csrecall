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
  chapters: Chapter[];
}

export function QuestMap({ chapters }: QuestMapProps) {
  const hydrated = useHydration();
  const completedChapterIds = useGameStore((s) => s.completedChapterIds);

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
          {hydrated ? completedChapterIds.length : 0} / {chapters.length} done
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter, i) => {
          const isCompleted =
            hydrated && completedChapterIds.includes(chapter.id);
          const topicCount = chapter.sections.reduce(
            (acc, s) => acc + s.topics.length,
            0,
          );
          const isReady = !isCompleted;

          return (
            <ChapterTile
              key={chapter.id}
              id={chapter.id}
              chapterNumber={chapter.chapterNumber}
              title={chapter.title}
              estimatedMinutes={chapter.estimatedMinutes}
              topicCount={topicCount}
              isCompleted={isCompleted}
              isReady={isReady}
              progress={isCompleted ? 100 : 0}
              delay={i * 0.05}
            />
          );
        })}
      </div>
    </section>
  );
}
