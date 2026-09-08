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
  const { xp, completedChapterIds, totalTrapsDefused } = useGameStore();

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
      <Card className="p-5 border-amber-500 bg-amber-50 shadow-[4px_4px_0px_0px_#92400e]">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl border-2 border-amber-500 bg-amber-200 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-900" strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">
              🎯 Your Next Move
            </p>
            {chapter1Done ? (
              <>
                <h3 className="font-black text-stone-900 text-lg leading-tight">
                  Chapter 2 coming soon! 🔒
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  You've completed Chapter 1. New chapters are on the way!
                </p>
              </>
            ) : (
              <>
                <h3 className="font-black text-stone-900 text-lg leading-tight">
                  You keep missing: Object Inheritance{" "}
                  <span className="text-rose-500">🪤</span>
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Defuse the OOP traps before your next mock interview. You have{" "}
                  <span className="font-bold">{totalTrapsDefused}</span> trap
                  {totalTrapsDefused !== 1 ? "s" : ""} defused so far.
                </p>
              </>
            )}
          </div>
        </div>

        {!chapter1Done && (
          <div className="mt-4 pt-4 border-t-2 border-amber-200 flex items-center gap-3">
            <Link href="/chapter/chapter-1">
              <Button variant="accent" size="sm">
                <Shield className="w-4 h-4" strokeWidth={2.5} />
                Defuse Traps
              </Button>
            </Link>
            <span className="text-xs text-amber-700 font-bold">
              ~5 min to clear Chapter 1 traps
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
