"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { useHydration } from "@/hooks/useHydration";

export function NextMoveWidget() {
  const hydrated = useHydration();
  const { xp, defusedTrapIds, completedChapterIds } = useGameStore();
  const totalTrapsDefused = defusedTrapIds.length;

  // Don't render for brand-new users — the hero section is their entry point
  if (!hydrated) return null;
  const hasStarted =
    xp > 0 || completedChapterIds.length > 0 || totalTrapsDefused > 0;
  if (!hasStarted) return null;

  const chapter1Done = completedChapterIds.includes("chapter-1");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Card className="p-5 sm:p-6 border-2 border-stone-900 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 shadow-[4px_4px_0px_0px_#78350f] relative overflow-hidden">
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl border-2 border-stone-900 bg-amber-400 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
            <Target className="w-5 h-5 text-stone-950" strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                🎯 Active Mission
              </span>
              <span className="text-xs font-bold text-amber-700">
                Daily Focus
              </span>
            </div>
            {chapter1Done ? (
              <>
                <h3 className="font-black text-stone-900 text-lg leading-tight">
                  Chapter 1 Complete! Continue Your Quest 🚀
                </h3>
                <p className="text-sm text-stone-600 mt-1 font-medium">
                  Head over to the Quest Map below to tackle Chapter 2 and
                  unlock your next level badge.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-black text-stone-900 text-lg leading-tight">
                  Priority Target: Object Inheritance{" "}
                  <span className="text-rose-500">🪤</span>
                </h3>
                <p className="text-sm text-stone-600 mt-1 font-medium">
                  Defuse the OOP traps before your next mock interview. You have{" "}
                  <span className="font-black text-stone-900">
                    {totalTrapsDefused}
                  </span>{" "}
                  trap
                  {totalTrapsDefused !== 1 ? "s" : ""} defused so far.
                </p>
              </>
            )}
          </div>
        </div>

        {!chapter1Done && (
          <div className="mt-4 pt-4 border-t-2 border-amber-200/80 flex flex-wrap items-center gap-3">
            <Link href="/chapter/chapter-1">
              <Button
                variant="accent"
                size="sm"
                className="shadow-[2px_2px_0px_0px_#78350f]"
              >
                <Shield className="w-4 h-4" strokeWidth={2.5} />
                Defuse Traps
              </Button>
            </Link>
            <span className="text-xs text-amber-800 font-bold bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-300">
              ⚡ ~5 min to clear Chapter 1 traps
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
