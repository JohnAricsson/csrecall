"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Zap,
  BookOpen,
  ShieldAlert,
  Flame,
  Trophy,
  RotateCcw,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { useGameStore } from "@/stores/gameStore";
import { BADGE_REQUIREMENTS } from "@/lib/gameConstants";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    joinDate: string;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    xp,
    completedChapterIds,
    defusedTrapIds,
    masteredFlashcardIds,
    streakDays,
    reset,
  } = useGameStore();

  const totalTrapsDefused = defusedTrapIds.length;

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/user/reset", { method: "POST" });
      if (res.ok) {
        reset();
        setResetSuccess(true);
        setShowReset(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const allBadges = [
    {
      ...BADGE_REQUIREMENTS.NOVICE_CODER,
      isUnlocked: xp >= BADGE_REQUIREMENTS.NOVICE_CODER.xp,
    },
    {
      ...BADGE_REQUIREMENTS.TRAP_DEFUSER,
      isUnlocked: totalTrapsDefused >= BADGE_REQUIREMENTS.TRAP_DEFUSER.traps,
    },
    {
      ...BADGE_REQUIREMENTS.MEMORY_ENGINE,
      isUnlocked:
        masteredFlashcardIds.length >=
        BADGE_REQUIREMENTS.MEMORY_ENGINE.flashcards,
    },
    {
      ...BADGE_REQUIREMENTS.SYSTEM_ARCHITECT,
      isUnlocked:
        completedChapterIds.length >=
        BADGE_REQUIREMENTS.SYSTEM_ARCHITECT.chapters,
    },
    {
      ...BADGE_REQUIREMENTS.INTERVIEW_GRANDMASTER,
      isUnlocked: xp >= BADGE_REQUIREMENTS.INTERVIEW_GRANDMASTER.xp,
    },
  ];

  return (
    <div className="relative min-h-screen bg-stone-50 overflow-hidden pb-20">
      {/* Floating animated particles */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1c1917 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* ── Header Card ── */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] bg-violet-100 flex items-center justify-center text-violet-600">
              <User className="w-10 h-10" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-black text-stone-900 leading-none">
              {user.name}
            </h1>
            <p className="text-stone-500 font-bold mt-2 text-lg">
              {user.email}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border-2 border-stone-200 text-sm font-semibold text-stone-600">
              <span>Joined:</span>
              <span className="text-stone-900">{user.joinDate}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 bg-violet-50 border-2 border-violet-900 rounded-2xl shadow-[4px_4px_0px_0px_#4c1d95]">
              <Zap className="w-10 h-10 text-violet-600" />
              <p className="text-4xl font-black text-stone-900">{xp}</p>
              <p className="text-sm font-black uppercase tracking-widest text-violet-700">
                Total XP
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 bg-emerald-50 border-2 border-emerald-900 rounded-2xl shadow-[4px_4px_0px_0px_#064e3b]">
              <BookOpen className="w-10 h-10 text-emerald-600" />
              <p className="text-4xl font-black text-stone-900">
                {completedChapterIds.length}{" "}
                <span className="text-xl">/ 12</span>
              </p>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
                Mastered
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 bg-rose-50 border-2 border-rose-900 rounded-2xl shadow-[4px_4px_0px_0px_#9f1239]">
              <ShieldAlert className="w-10 h-10 text-rose-600" />
              <p className="text-4xl font-black text-stone-900">
                {totalTrapsDefused}
              </p>
              <p className="text-sm font-black uppercase tracking-widest text-rose-700">
                Defused
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-3 bg-amber-50 border-2 border-amber-900 rounded-2xl shadow-[4px_4px_0px_0px_#78350f]">
              <Flame className="w-10 h-10 text-amber-600" />
              <p className="text-4xl font-black text-stone-900">{streakDays}</p>
              <p className="text-sm font-black uppercase tracking-widest text-amber-700">
                Day Streak
              </p>
            </div>
          </TiltCard>
        </div>

        {/* ── Badges ── */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-stone-900 flex items-center justify-center rounded-xl text-amber-400 border-2 border-stone-700 shadow-[2px_2px_0px_0px_#1c1917]">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-stone-900">Badge Matrix</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allBadges.map((badge, i) => (
              <div
                key={i}
                className={cn(
                  "relative p-4 rounded-xl border-2 flex items-center gap-4 shadow-[2px_2px_0px_0px_#1c1917] transition-all",
                  badge.isUnlocked
                    ? "bg-amber-50 border-amber-500 shadow-[3px_3px_0px_0px_#f59e0b]"
                    : "bg-stone-50 border-stone-300 grayscale opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center",
                    badge.isUnlocked
                      ? "bg-amber-400 border-amber-700 text-stone-900"
                      : "bg-stone-200 border-stone-400 text-stone-500",
                  )}
                >
                  {badge.isUnlocked ? (
                    <Trophy className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "font-black text-sm",
                      badge.isUnlocked ? "text-stone-900" : "text-stone-500",
                    )}
                  >
                    {badge.name}
                  </p>
                  <p className="text-xs font-bold text-stone-500 mt-0.5">
                    {badge.isUnlocked ? "Unlocked!" : "Locked"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Danger Zone ── */}
        <Card className="p-6 sm:p-8 bg-rose-50/50 border-rose-200">
          <h2 className="text-xl font-black text-rose-900 mb-2">Danger Zone</h2>
          <p className="text-stone-600 text-sm mb-6 max-w-xl">
            Need a fresh start? This will permanently wipe your XP, completed
            chapters, and defused traps. This action cannot be undone.
          </p>

          {resetSuccess && (
            <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 border-2 border-emerald-900 rounded-xl text-sm font-bold shadow-[2px_2px_0px_0px_#064e3b]">
              ✅ Progress has been successfully reset!
            </div>
          )}

          <Button
            variant="primary"
            onClick={() => setShowReset(true)}
            className="!bg-rose-600 !border-rose-900 hover:!bg-rose-700 !shadow-[3px_3px_0px_0px_#881337] gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Progress
          </Button>
        </Card>

        {/* ── Reset Modal ── */}
        {showReset && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-sm w-full p-6 space-y-4 shadow-[8px_8px_0px_0px_#000]">
              <h2 className="font-black text-stone-900 text-xl">
                ⚠️ Reset All Progress?
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                This will permanently wipe your XP, completed chapters, defused
                traps, and local game cache. This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowReset(false)}
                  className="flex-1"
                  disabled={resetting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 !bg-rose-600 !border-rose-900 !shadow-[3px_3px_0px_0px_#881337]"
                >
                  {resetting ? "Resetting..." : "🔄 Yes, Reset"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
