"use client";

import Link from "next/link";
import { Zap, LogIn, User, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useGameStore } from "@/stores/gameStore";

export function Navbar() {
  const { data: session, status } = useSession();
  const xp = useGameStore((s) => s.xp);
  const streakDays = useGameStore((s) => s.streakDays);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-stone-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-black text-lg text-stone-900 hover:text-violet-600 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917] group-hover:rotate-6 group-hover:scale-105 transition-transform">
            <Zap
              className="w-4 h-4 text-white fill-white/30"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tight text-xl">
              CS<span className="text-violet-600">Recall</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded border border-violet-300">
              ARENA
            </span>
          </div>
        </Link>

        {/* Auth / Player Vitals */}
        {status === "loading" ? (
          <div className="w-28 h-9 bg-stone-200 animate-pulse rounded-xl border-2 border-stone-300" />
        ) : session?.user ? (
          <Link href="/profile" className="cursor-pointer group">
            <div className="flex items-center gap-2.5 sm:gap-3 bg-stone-100 hover:bg-stone-200/80 transition-all px-3 py-1.5 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] group-hover:shadow-[4px_4px_0px_0px_#1c1917] group-hover:-translate-y-0.5">
              {streakDays > 0 && (
                <>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-700">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                    <span>{streakDays}d</span>
                  </div>
                  <div className="w-px h-4 bg-stone-300" />
                </>
              )}
              <div className="font-black text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                <span className="text-amber-500">⚡</span>
                <span>{xp} XP</span>
              </div>
              <div className="w-px h-4 bg-stone-300" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-stone-900">
                <div className="w-5 h-5 rounded-full bg-violet-200 border border-violet-400 flex items-center justify-center">
                  <User className="w-3 h-3 text-violet-700" />
                </div>
                <span className="max-w-[90px] sm:max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0] || "Player"}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="cursor-pointer">
              <Button
                variant="primary"
                size="sm"
                className="cursor-pointer shadow-[2px_2px_0px_0px_#3b0764]"
              >
                <LogIn className="w-4 h-4" strokeWidth={2.5} />
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
