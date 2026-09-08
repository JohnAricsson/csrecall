"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { LearnMode } from "./LearnMode";
import { PracticeMode } from "./PracticeMode";
import { TrapsMode } from "./TrapsMode";
import { cn } from "@/lib/utils";

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
              "relative px-4 py-2 rounded-xl text-sm font-black transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              isActive ? "text-white" : "text-stone-600 hover:text-stone-900",
            )}
          >
            {/* Sliding pill background */}
            {isActive && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-xl bg-violet-600 border-2 border-violet-800 shadow-[2px_2px_0px_0px_#3b0764]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {emoji} {label}
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawMode = searchParams.get("mode") ?? "learn";
  const activeMode: Mode =
    rawMode === "practice" || rawMode === "traps" ? rawMode : "learn";

  function handleModeChange(mode: Mode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", mode);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b-2 border-stone-900 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Back + title row */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-violet-600 transition-colors group"
            >
              <ArrowLeft
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
              <span className="hidden sm:inline">Arena</span>
            </Link>

            <div className="w-px h-5 bg-stone-300 flex-shrink-0" />

            <h1 className="font-black text-stone-900 text-base sm:text-lg leading-tight truncate">
              {chapter.title}
            </h1>

            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-stone-200 bg-stone-50 text-stone-500 text-xs font-bold">
              <Clock className="w-3 h-3" />
              {chapter.estimatedMinutes} min
            </span>
          </div>

          {/* Mode switcher */}
          <div className="flex-shrink-0">
            <ModeSwitcher active={activeMode} onChange={handleModeChange} />
          </div>
        </div>
      </div>

      {/* ── Mode content ─────────────────────────────────────────── */}
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
      </div>
    </div>
  );
}
