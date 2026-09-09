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
      <Card className="p-5 sm:p-6 border-[3px] border-black bg-[#fffbf0] shadow-[5px_5px_0px_0px_#000] relative overflow-hidden">
        {/* Comic Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl border-2 border-black bg-yellow-300 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <Target className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-300 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                🎯 ACTIVE MISSION
              </span>
              <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                Daily Focus
              </span>
            </div>
            {chapter1Done ? (
              <>
                <h3 className="font-black text-black text-lg sm:text-xl leading-tight">
                  Chapter 1 Complete! Continue Your Quest 🚀
                </h3>
                <p className="text-sm text-stone-700 mt-1 font-bold">
                  Head over to the Quest Map below to tackle Chapter 2 and
                  unlock your next level badge.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-black text-black text-lg sm:text-xl leading-tight">
                  Priority Target: Object Inheritance{" "}
                  <span className="text-rose-600">🪤</span>
                </h3>
                <p className="text-sm text-stone-700 mt-1 font-bold">
                  Defuse the OOP traps before your next mock interview. You have{" "}
                  <span className="font-black text-black bg-yellow-300 px-1 rounded border border-black">
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
          <div className="mt-4 pt-4 border-t-2 border-black/20 flex flex-wrap items-center gap-3">
            <Link href="/chapter/chapter-1?mode=traps">
              <Button
                variant="accent"
                size="sm"
                className="shadow-[3px_3px_0px_0px_#000]"
              >
                <Shield className="w-4 h-4" strokeWidth={2.5} />
                Defuse Traps
              </Button>
            </Link>
            <span className="text-xs text-black font-black bg-yellow-200 px-2.5 py-1 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]">
              ⚡ ~5 min to clear Chapter 1 traps
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
