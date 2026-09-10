"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  User,
  LogOut,
  Zap,
  BookOpen,
  ShieldAlert,
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
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    xp,
    completedChapterIds,
    defusedTrapIds,
    masteredFlashcardIds,
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
      displayName: "নতুন কোডার (Novice Coder)",
      isUnlocked: xp >= BADGE_REQUIREMENTS.NOVICE_CODER.xp,
    },
    {
      ...BADGE_REQUIREMENTS.TRAP_DEFUSER,
      displayName: "ট্র্যাপ ডিফিউজার (Trap Defuser)",
      isUnlocked: totalTrapsDefused >= BADGE_REQUIREMENTS.TRAP_DEFUSER.traps,
    },
    {
      ...BADGE_REQUIREMENTS.MEMORY_ENGINE,
      displayName: "মেমোরি ইঞ্জিন (Memory Engine)",
      isUnlocked:
        masteredFlashcardIds.length >=
        BADGE_REQUIREMENTS.MEMORY_ENGINE.flashcards,
    },
    {
      ...BADGE_REQUIREMENTS.SYSTEM_ARCHITECT,
      displayName: "সিস্টেম আর্কিটেক্ট (System Architect)",
      isUnlocked:
        completedChapterIds.length >=
        BADGE_REQUIREMENTS.SYSTEM_ARCHITECT.chapters,
    },
    {
      ...BADGE_REQUIREMENTS.INTERVIEW_GRANDMASTER,
      displayName: "ইন্টারভিউ গ্র্যান্ডমাস্টার (Grandmaster)",
      isUnlocked: xp >= BADGE_REQUIREMENTS.INTERVIEW_GRANDMASTER.xp,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* ── Header Card ── */}
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-[#fffdf7] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="w-24 h-24 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] bg-yellow-300 flex items-center justify-center text-black">
              <User className="w-12 h-12" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-black leading-none">
              {user.name}
            </h1>
            <p className="text-stone-700 font-bold mt-2 text-lg">
              {user.email}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-200 px-3 py-1.5 rounded-xl border-2 border-black text-sm font-black text-black shadow-[2px_2px_0px_0px_#000]">
              <span>Joined:</span>
              <span className="text-black">{user.joinDate}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full sm:w-auto font-black"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-2 bg-yellow-300 border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000]">
              <Zap className="w-10 h-10 text-black fill-black" />
              <p className="text-4xl font-black text-black">{xp}</p>
              <p className="text-xs font-black uppercase tracking-widest text-black">
                Total XP
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-2 bg-emerald-300 border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000]">
              <BookOpen className="w-10 h-10 text-black" />
              <p className="text-4xl font-black text-black">
                {completedChapterIds.length}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-black">
                Cleared
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6 flex flex-col items-center justify-center text-center gap-2 bg-rose-300 border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000]">
              <ShieldAlert className="w-10 h-10 text-black" />
              <p className="text-4xl font-black text-black">
                {totalTrapsDefused}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-black">
                Defused
              </p>
            </div>
          </TiltCard>
        </div>

        {/* ── Badge Matrix ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#fffdf7] p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
            <div>
              <h2 className="text-2xl font-black text-black">
                ট্রফি ম্যাট্রিক্স (Trophies)
              </h2>
              <p className="text-stone-700 text-sm font-bold">
                আর্কেড অর্জন ও মাস্টারি ট্রফি
              </p>
            </div>
            <span className="bg-yellow-300 text-black border-2 border-black font-black text-xs px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#000]">
              {allBadges.filter((b) => b.isUnlocked).length} /{" "}
              {allBadges.length} টি আনলকড
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allBadges.map((badge, i) => (
              <Card
                key={i}
                className={cn(
                  "p-5 flex items-start gap-4 transition-all duration-200 border-[3px] border-black",
                  badge.isUnlocked
                    ? "bg-[#fffdf7] shadow-[4px_4px_0px_0px_#000]"
                    : "bg-stone-200/80 opacity-60 shadow-[2px_2px_0px_0px_#000]",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-[2px_2px_0px_0px_#000]",
                    badge.isUnlocked
                      ? "bg-yellow-300"
                      : "bg-stone-300 text-stone-500",
                  )}
                >
                  {badge.isUnlocked ? (
                    <Trophy className="w-6 h-6 text-black" />
                  ) : (
                    <Lock className="w-5 h-5 text-black" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-black text-sm",
                      badge.isUnlocked ? "text-black" : "text-stone-600",
                    )}
                  >
                    {badge.displayName}
                  </p>
                  <p className="text-xs font-bold text-stone-600 mt-0.5">
                    {badge.isUnlocked ? "✓ আনলকড!" : "লক করা"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <Card className="p-6 sm:p-8 bg-[#fffdf7] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500 border-b-2 border-black" />
          <h2 className="text-xl font-black text-rose-600 mb-2 uppercase tracking-wider">
            ⚠️ DANGER ZONE
          </h2>
          <p className="text-sm font-semibold text-stone-800 mb-6 max-w-xl leading-relaxed">
            নতুন করে শুরু করতে চান? রিসেট করলে আপনার অর্জিত সমস্ত XP, কমপ্লিট
            করা চ্যাপ্টার এবং ট্র্যাপস স্কোর স্থায়ীভাবে মুছে যাবে।
          </p>

          {resetSuccess && (
            <div className="mb-4 p-3 bg-emerald-200 text-black border-2 border-black rounded-xl text-sm font-black shadow-[2px_2px_0px_0px_#000]">
              ✅ Progress has been successfully reset!
            </div>
          )}

          <Button
            variant="danger"
            onClick={() => setShowReset(true)}
            className="cursor-pointer font-black"
          >
            <RotateCcw className="w-4 h-4" />
            RESET ALL PROGRESS
          </Button>
        </Card>

        {/* ── Reset Modal ── */}
        {showReset && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <Card className="max-w-sm w-full p-6 space-y-4 bg-[#fffdf7] border-[3px] border-black shadow-[8px_8px_0px_0px_#000]">
              <h2 className="font-black text-stone-900 text-xl">
                ⚠️ Reset All Progress?
              </h2>
              <p className="text-sm font-semibold text-stone-800 leading-relaxed">
                রিসেট করলে আপনার অর্জিত সমস্ত XP, কমপ্লিট করা চ্যাপ্টার এবং
                ট্র্যাপস স্কোর স্থায়ীভাবে মুছে যাবে। এটি আর ফিরিয়ে আনা সম্ভব নয়।
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
                  variant="danger"
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 shadow-[3px_3px_0px_0px_#000]"
                >
                  {resetting ? "Resetting..." : "🔄 Yes"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
