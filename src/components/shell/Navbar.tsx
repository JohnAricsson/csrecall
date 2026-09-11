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
    <header className="w-full mt-2 mb-3 sm:mt-3 sm:mb-4 z-50 max-w-6xl mx-auto px-4 sm:px-6 transition-all">
      <div className="bg-[#fffdf7] border-[3px] border-black shadow-[5px_5px_0px_0px_#000] rounded-2xl w-full flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3 sm:h-13 overflow-hidden">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 font-black text-sm sm:text-lg text-black hover:text-rose-600 transition-colors cursor-pointer group shrink-0"
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-transform shrink-0">
            <Zap
              className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-yellow-400"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="tracking-tight text-base sm:text-xl font-black text-black">
              CS<span className="text-rose-600">RECALL</span>
            </span>
          </div>
        </Link>

        {/* Auth / Player Vitals - User Cluster Container */}
        {status === "loading" ? (
          <div className="w-24 sm:w-28 h-8 sm:h-9 bg-stone-200 animate-pulse rounded-xl border-2 border-black shrink-0" />
        ) : session?.user ? (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {streakDays > 0 && (
              <div className="px-2 py-1 text-[11px] font-black h-8 flex items-center shrink-0 border-2 border-black rounded-lg bg-orange-300 text-orange-950 shadow-[1px_1px_0px_0px_#000] gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse shrink-0" />
                <span>{streakDays}d</span>
              </div>
            )}
            <div className="px-2 py-1 text-[11px] sm:text-xs font-black h-8 flex items-center shrink-0 border-2 border-black rounded-lg bg-yellow-300 text-black shadow-[1px_1px_0px_0px_#000] gap-1">
              <span>🪙</span>
              <span>{xp} XP</span>
            </div>
            <Link
              href="/profile"
              className="px-2 py-1 text-[11px] font-bold h-8 flex items-center shrink-0 border-2 border-black rounded-lg max-w-[90px] sm:max-w-none truncate bg-[#fffdf7] hover:bg-yellow-50 text-black gap-1.5 shadow-[1px_1px_0px_0px_#000] cursor-pointer group transition-all"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-300 border border-black flex items-center justify-center shrink-0">
                <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" />
              </div>
              <span className="truncate max-w-[55px] sm:max-w-[100px]">
                {session.user.name?.split(" ")[0] || "Player"}
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/login" className="cursor-pointer">
              <Button
                variant="primary"
                size="sm"
                className="cursor-pointer font-black h-8 px-2.5 text-xs sm:h-9 sm:px-3 sm:text-sm"
              >
                <LogIn
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                />
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
