"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, ShieldCheck } from "lucide-react";
import type { Chapter, Trap } from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/stores/gameStore";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Aggregates all traps from every topic in every section. */
function getAllTraps(chapter: Chapter): Trap[] {
  return chapter.sections.flatMap((s) =>
    s.topics.flatMap((t) => t.traps ?? []),
  );
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  Trap["category"],
  { label: string; badgeVariant: "rose" | "amber" | "sky"; emoji: string }
> = {
  "interview-gotcha": {
    label: "Interview Gotcha",
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
          "overflow-hidden transition-colors duration-300",
          isDefused
            ? "border-emerald-400 shadow-[4px_4px_0px_0px_#064e3b]"
            : "border-stone-900",
        )}
      >
        {/* Card header */}
        <div
          className={cn("px-5 py-4", isDefused ? "bg-emerald-50" : "bg-white")}
        >
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant={meta.badgeVariant}>
              {meta.emoji} {meta.label}
            </Badge>
            {isDefused && (
              <Badge variant="emerald">
                <ShieldCheck className="w-3 h-3" />
                Defused
              </Badge>
            )}
          </div>

          {/* Trap statement */}
          <p
            className={cn(
              "font-black text-base leading-snug mb-4",
              isDefused ? "line-through text-stone-400" : "text-stone-900",
            )}
          >
            🪤 &ldquo;{trap.statement}&rdquo;
          </p>

          {/* Actions row */}
          <div className="flex items-center gap-3">
            {/* Defuse toggle */}
            <button
              onClick={onDefuse}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all",
                "active:translate-x-[2px] active:translate-y-[2px]",
                isDefused
                  ? "bg-emerald-500 border-emerald-700 text-white shadow-[2px_2px_0px_0px_#064e3b] active:shadow-none"
                  : "bg-white border-stone-900 text-stone-700 shadow-[2px_2px_0px_0px_#1c1917] hover:bg-stone-50 active:shadow-none",
              )}
            >
              {isDefused ? (
                <>
                  <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
                  Defused!
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" strokeWidth={2.5} />
                  Defuse Trap
                </>
              )}
            </button>

            {/* Expand explanation */}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-500 text-sm font-bold transition-colors"
            >
              Why tricky?
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
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
              <div className="px-5 py-4 bg-rose-50 border-t-2 border-rose-200">
                <p className="text-xs font-black uppercase tracking-widest text-rose-500 mb-2">
                  🔍 Why developers get tricked:
                </p>
                <p className="text-stone-700 text-sm leading-relaxed font-medium">
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
  const traps = getAllTraps(chapter);
  const [defusedIds, setDefusedIds] = useState<Set<string>>(new Set());
  const defuseInStore = useGameStore((s) => s.defuseTrap);

  const defusedCount = defusedIds.size;
  const totalCount = traps.length;
  const progress =
    totalCount > 0 ? Math.round((defusedCount / totalCount) * 100) : 0;

  const handleDefuse = useCallback(
    (trapId: string, wasDefused: boolean) => {
      setDefusedIds((prev) => {
        const next = new Set(prev);
        if (wasDefused) {
          next.delete(trapId);
        } else {
          next.add(trapId);
          // Award XP + update global trap counter on first defusal
          defuseInStore();
        }
        return next;
      });
    },
    [defuseInStore],
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
          "p-5 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917]",
          defusedCount === totalCount && totalCount > 0
            ? "bg-emerald-50 border-emerald-500 shadow-[4px_4px_0px_0px_#064e3b]"
            : "bg-white",
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-1">
              Trap Defusal Progress
            </p>
            <p className="font-black text-2xl text-stone-900">
              {defusedCount} of {totalCount} Defused 🛡️
            </p>
          </div>
          {defusedCount === totalCount && totalCount > 0 ? (
            <div className="text-3xl">🏆</div>
          ) : (
            <div className="text-3xl">🎯</div>
          )}
        </div>

        <ProgressBar
          value={progress}
          variant={defusedCount === totalCount ? "readiness" : "xp"}
          showLabel={false}
        />

        {/* Category summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="rose">🎯 {gotchas} Gotchas</Badge>
          <Badge variant="amber">⚠️ {mistakes} Mistakes</Badge>
          <Badge variant="sky">💡 {conceptuals} Conceptual</Badge>
        </div>
      </motion.div>

      {/* ── Trap Cards ─────────────────────────────────────────── */}
      <div className="space-y-4">
        {traps.map((trap, i) => (
          <TrapCard
            key={trap.id}
            trap={trap}
            index={i}
            isDefused={defusedIds.has(trap.id)}
            onDefuse={() => handleDefuse(trap.id, defusedIds.has(trap.id))}
          />
        ))}
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
            <h3 className="font-black text-2xl text-emerald-700">
              All Traps Defused!
            </h3>
            <p className="text-stone-500 font-medium text-sm">
              You&apos;re interview-ready. No trap can catch you now.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
