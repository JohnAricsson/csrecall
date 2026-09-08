import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── State shape ──────────────────────────────────────────────────────────────

export interface GameState {
  /** Total XP earned across all activities */
  xp: number;
  /** Consecutive active days */
  streakDays: number;
  /** ISO date string (YYYY-MM-DD) of the last active day */
  lastActiveDateStr: string | null;
  /** IDs of fully completed chapters */
  completedChapterIds: string[];
  /** Total interview traps the player has defused */
  totalTrapsDefused: number;

  // ── Actions ──────────────────────────────────────────────────────────────
  addXp: (amount: number) => void;
  defuseTrap: () => void;
  completeChapter: (id: string) => void;
  /** Call once on app load to advance/reset the daily streak */
  updateStreak: () => void;
}

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Derives a 0-100 readiness % from completed chapters (out of 12 total). */
export const selectReadiness = (state: GameState): number =>
  Math.round((state.completedChapterIds.length / 12) * 100);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0]!;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streakDays: 0,
      lastActiveDateStr: null,
      completedChapterIds: [],
      totalTrapsDefused: 0,

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      defuseTrap: () =>
        set((s) => ({
          totalTrapsDefused: s.totalTrapsDefused + 1,
          xp: s.xp + 15,
        })),

      completeChapter: (id) =>
        set((s) => ({
          completedChapterIds: s.completedChapterIds.includes(id)
            ? s.completedChapterIds
            : [...s.completedChapterIds, id],
          xp: s.xp + 100,
        })),

      updateStreak: () => {
        const { lastActiveDateStr, streakDays } = get();
        const today = todayStr();
        if (lastActiveDateStr === today) return; // already updated today

        const newStreak =
          lastActiveDateStr === yesterdayStr() ? streakDays + 1 : 1;

        set({ streakDays: newStreak, lastActiveDateStr: today });
      },
    }),
    { name: "csrecall-game-state" },
  ),
);
