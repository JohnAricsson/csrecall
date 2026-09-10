"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, ShieldCheck } from "lucide-react";
import type { Chapter, Trap } from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/stores/gameStore";
import { cn } from "@/lib/utils";
import { toBengaliDigits, isTrapDefused } from "@/lib/topicUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export interface ScopedTrap extends Trap {
  chapterId: string;
  topicId: string;
  canonicalId: string;
}

/** Aggregates all traps from every topic in every section preserving canonical identity. */
function getAllTraps(chapter: Chapter): ScopedTrap[] {
  return chapter.sections.flatMap((s) =>
    s.topics.flatMap((t) =>
      (t.traps ?? []).map((trap) => ({
        ...trap,
        chapterId: chapter.id,
        topicId: t.id,
        canonicalId: `${chapter.id}::${t.id}::${trap.id}`,
      })),
    ),
  );
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  Trap["category"],
  { label: string; badgeVariant: "rose" | "amber" | "sky"; emoji: string }
> = {
  "interview-gotcha": {
    label: "TRICKY",
    badgeVariant: "rose",
    emoji: "🎯",
  },
  "common-mistake": {
    label: "Common Mistake",
    badgeVariant: "amber",
    emoji: "⚠️",
  },
  conceptual: { label: "Conceptual", badgeVariant: "sky", emoji: "💡" },
};

// ─── Trap Card ────────────────────────────────────────────────────────────────

interface TrapCardProps {
  trap: Trap;
  index: number;
  isDefused: boolean;
  onDefuse: () => void;
}

function TrapCard({ trap, index, isDefused, onDefuse }: TrapCardProps) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[trap.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        delay: index * 0.04,
      }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 relative border-[3px] border-black",
          isDefused
            ? "border-emerald-500 shadow-[5px_5px_0px_0px_#000] bg-emerald-50"
            : "shadow-[5px_5px_0px_0px_#000] bg-white",
        )}
      >
        {/* Top colored accent line */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-2 border-b-2 border-black",
            isDefused
              ? "bg-emerald-400"
              : trap.category === "interview-gotcha"
                ? "bg-rose-400"
                : trap.category === "common-mistake"
                  ? "bg-amber-400"
                  : "bg-sky-400",
          )}
        />

        {/* Card header */}
        <div
          className={cn(
            "px-5 sm:px-6 py-5 pt-5.5",
            isDefused ? "bg-emerald-50" : "bg-white",
          )}
        >
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant={meta.badgeVariant}>
              {meta.emoji} {meta.label}
            </Badge>
            {isDefused && (
              <Badge variant="emerald">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />✓ ডিফিউজড!
              </Badge>
            )}
          </div>

          {/* Trap statement */}
          <p
            className={cn(
              "font-black text-base sm:text-lg leading-snug mb-4",
              isDefused ? "line-through text-stone-500" : "text-black",
            )}
          >
            🪤 &ldquo;{trap.statement}&rdquo;
          </p>

          {/* Actions row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Defuse toggle */}
            <button
              onClick={onDefuse}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-[3px] border-black font-black text-sm transition-all cursor-pointer",
                "active:translate-x-[2px] active:translate-y-[2px]",
                isDefused
                  ? "bg-emerald-400 text-black shadow-[3px_3px_0px_0px_#000] active:shadow-none"
                  : "bg-rose-500 text-white shadow-[3px_3px_0px_0px_#000] hover:bg-rose-400 active:shadow-none uppercase tracking-wider",
              )}
            >
              {isDefused ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" strokeWidth={3} />
                  ✓ ডিফিউজড (+৩০ XP)
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-white" strokeWidth={3} />
                  🛡️ডিফিউজ করুন
                </>
              )}
            </button>

            {/* Expand explanation */}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-[3px] border-black bg-yellow-300 hover:bg-yellow-200 text-black text-sm font-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              কেন এটা ট্রিকি?
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ChevronDown className="w-4 h-4 text-black" strokeWidth={3} />
              </motion.span>
            </button>
          </div>
        </div>

        {/* Expandable explanation */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4 bg-[#fffbf0] border-t-2 border-black">
                <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-1.5 flex items-center gap-1">
                  <span>🔍</span>
                  <span>কেন ডেভেলপাররা ফাঁদে পড়েন:</span>
                </p>
                <p className="text-stone-900 text-sm sm:text-base leading-relaxed font-bold">
                  {trap.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Traps Mode ───────────────────────────────────────────────────────────────

interface TrapsModeProps {
  chapter: Chapter;
}

export function TrapsMode({ chapter }: TrapsModeProps) {
  const traps = useMemo(() => getAllTraps(chapter), [chapter]);
  const defusedTrapIds = useGameStore((s) => s.defusedTrapIds);
  const defuseTrap = useGameStore((s) => s.defuseTrap);

  // Derive defusal count strictly from the store's traps that belong to this chapter and topic
  const defusedCount = useMemo(() => {
    return traps.filter((t) =>
      isTrapDefused(defusedTrapIds, t.chapterId, t.topicId, t.id),
    ).length;
  }, [traps, defusedTrapIds]);

  const totalCount = traps.length;
  const progress =
    totalCount > 0 ? Math.round((defusedCount / totalCount) * 100) : 0;

  const handleDefuse = useCallback(
    (canonicalId: string, isCurrentlyDefused: boolean) => {
      if (!isCurrentlyDefused) {
        // Award XP + update store + trigger confetti
        defuseTrap(canonicalId);
        void import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.8 },
            colors: ["#fb7185", "#f43f5e", "#facc15", "#34d399"],
            scalar: 0.9,
            disableForReducedMotion: true,
          });
        });
      }
    },
    [defuseTrap],
  );

  // Group traps by category for summary
  const gotchas = traps.filter((t) => t.category === "interview-gotcha").length;
  const mistakes = traps.filter((t) => t.category === "common-mistake").length;
  const conceptuals = traps.filter((t) => t.category === "conceptual").length;

  return (
    <div className="space-y-6">
      {/* ── Defusal Tracker Banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn(
          "p-5 sm:p-6 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_#000] relative overflow-hidden",
          defusedCount === totalCount && totalCount > 0
            ? "bg-emerald-100"
            : "bg-[#fffbf0]",
        )}
      >
        {/* Top accent line */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-2 border-b-2 border-black",
            defusedCount === totalCount && totalCount > 0
              ? "bg-emerald-400"
              : "bg-rose-500",
          )}
        />

        <div className="flex items-start justify-between gap-4 mb-4 pt-1">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-stone-600 mb-1">
              Trap Defusal Arena
            </p>
            <p className="font-black text-2xl sm:text-3xl text-black">
              {toBengaliDigits(totalCount)} টির মধ্যে{" "}
              {toBengaliDigits(defusedCount)} টি ডিফিউজড 🛡️
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-300 border-[3px] border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
            {defusedCount === totalCount && totalCount > 0 ? "🏆" : "🪤"}
          </div>
        </div>

        <ProgressBar
          value={progress}
          variant={defusedCount === totalCount ? "readiness" : "topic"}
          showLabel={false}
        />

        {/* Category summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="rose">
            🚨 {toBengaliDigits(gotchas)}টি ট্রিকি পয়েন্ট (Tricky)
          </Badge>
          <Badge variant="amber">
            ⚠️ {toBengaliDigits(mistakes)}টি সাধারণ ভুল (Mistakes)
          </Badge>
          <Badge variant="sky">
            💡 {toBengaliDigits(conceptuals)}টি কনসেপচুয়াল (Conceptual)
          </Badge>
        </div>
      </motion.div>

      {/* ── Trap Cards ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {traps.map((trap, i) => {
          const isDefused = isTrapDefused(
            defusedTrapIds,
            trap.chapterId,
            trap.topicId,
            trap.id,
          );
          return (
            <TrapCard
              key={trap.canonicalId}
              trap={trap}
              index={i}
              isDefused={isDefused}
              onDefuse={() => handleDefuse(trap.canonicalId, isDefused)}
            />
          );
        })}
      </div>

      {/* ── All clear state ─────────────────────────────────────── */}
      <AnimatePresence>
        {defusedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-3"
          >
            <div className="text-5xl">🏆</div>
            <h3 className="font-black text-2xl text-emerald-400 drop-shadow-[2px_2px_0px_#000]">
              All Traps Defused!
            </h3>
            <p className="text-yellow-100 font-bold text-sm drop-shadow-[1px_1px_0px_#000]">
              You&apos;re interview-ready. No trap can catch you now.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
