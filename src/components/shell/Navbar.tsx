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
    <header className="sticky top-3 sm:top-4 z-50 max-w-5xl mx-auto px-4 sm:px-6 transition-all">
      <div className="bg-[#fffbf0] border-[3px] border-black shadow-[5px_5px_0px_0px_#000] rounded-2xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-lg text-black hover:text-rose-600 transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] group-hover:rotate-6 group-hover:scale-105 transition-transform">
            <Zap
              className="w-5 h-5 text-black fill-yellow-400"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="tracking-tight text-xl font-black text-black">
              CS<span className="text-rose-600">RECALL</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-yellow-300 text-black px-2 py-0.5 rounded-md border border-black rotate-[-2deg] shadow-[1px_1px_0px_0px_#000]">
              ARCADE
            </span>
          </div>
        </Link>

        {/* Auth / Player Vitals */}
        {status === "loading" ? (
          <div className="w-28 h-9 bg-stone-200 animate-pulse rounded-xl border-2 border-black" />
        ) : session?.user ? (
          <Link href="/profile" className="cursor-pointer group">
            <div className="flex items-center gap-2 sm:gap-3 bg-[#fffbf0] hover:bg-yellow-50 transition-all px-3 py-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] group-hover:-translate-y-0.5">
              {streakDays > 0 && (
                <>
                  <div className="flex items-center gap-1 text-xs font-black text-orange-950 bg-orange-300 px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]">
                    <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
                    <span>{streakDays}d</span>
                  </div>
                  <div className="w-px h-4 bg-black" />
                </>
              )}
              <div className="font-black text-xs sm:text-sm text-black bg-yellow-300 px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1">
                <span>🪙</span>
                <span>{xp} XP</span>
              </div>
              <div className="w-px h-4 bg-black" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-black">
                <div className="w-5 h-5 rounded-full bg-emerald-300 border border-black flex items-center justify-center">
                  <User className="w-3 h-3 text-black" />
                </div>
                <span className="max-w-[80px] sm:max-w-[120px] truncate font-black">
                  {session.user.name?.split(" ")[0] || "Player"}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="cursor-pointer">
              <Button
                variant="primary"
                size="sm"
                className="cursor-pointer font-black"
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
