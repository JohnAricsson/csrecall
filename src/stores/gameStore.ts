import { create } from "zustand";
import { XP_REWARDS } from "@/lib/gameConstants";

export interface GameState {
  xp: number;
  streakDays: number;
  lastActiveDateStr: string | null;
  completedChapterIds: string[];
  completedTopics: string[];
  defusedTrapIds: string[];
  masteredFlashcardIds: string[];
  isHydrated: boolean;
  
  // Actions
  completeTopic: (id: string) => void;
  masterFlashcard: (id: string) => void;
  defuseTrap: (id: string) => void;
  completeChapter: (id: string) => void;
  updateStreak: () => void;
  reset: () => void;
  hydrateFromServer: (data: Partial<GameState>) => void;
}

let syncTimeout: NodeJS.Timeout | null = null;

const debouncedSyncProgress = (state: GameState) => {
  if (typeof window === "undefined") return;

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(() => {
    fetch("/api/user/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        xp: state.xp,
        streakDays: state.streakDays,
        completedChapterIds: state.completedChapterIds,
        completedTopics: state.completedTopics,
        defusedTraps: state.defusedTrapIds,
        masteredFlashcards: state.masteredFlashcardIds,
      }),
    }).catch((err) => {
      console.error("[gameStore] Sync failed:", err);
    });
  }, 400); // 400ms debounce
};

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0]!;
}

export const useGameStore = create<GameState>()((set, get) => ({
  xp: 0,
  streakDays: 0,
  lastActiveDateStr: null,
  completedChapterIds: [],
  completedTopics: [],
  defusedTrapIds: [],
  masteredFlashcardIds: [],
  isHydrated: false,

  completeTopic: (id) => {
    const s = get();
    if (s.completedTopics.includes(id)) return;
    const nextTopics = [...s.completedTopics, id];
    const nextXp = s.xp + XP_REWARDS.TOPIC_COMPLETED;
    set({
      completedTopics: nextTopics,
      xp: nextXp,
    });
    debouncedSyncProgress(get());
  },

  masterFlashcard: (id) => {
    const s = get();
    if (s.masteredFlashcardIds.includes(id)) return;
    const nextCards = [...s.masteredFlashcardIds, id];
    const nextXp = s.xp + XP_REWARDS.FLASHCARD_MASTERED;
    set({
      masteredFlashcardIds: nextCards,
      xp: nextXp,
    });
    debouncedSyncProgress(get());
  },

  defuseTrap: (id) => {
    const s = get();
    if (s.defusedTrapIds.includes(id)) return;
    const nextTraps = [...s.defusedTrapIds, id];
    const nextXp = s.xp + XP_REWARDS.TRAP_DEFUSED;
    set({
      defusedTrapIds: nextTraps,
      xp: nextXp,
    });
    debouncedSyncProgress(get());
  },

  completeChapter: (id) => {
    const s = get();
    if (s.completedChapterIds.includes(id)) return;
    const nextChapters = [...s.completedChapterIds, id];
    const nextXp = s.xp + XP_REWARDS.CHAPTER_COMPLETED;
    set({
      completedChapterIds: nextChapters,
      xp: nextXp,
    });
    debouncedSyncProgress(get());
  },

  updateStreak: () => {
    const { lastActiveDateStr, streakDays } = get();
    const today = todayStr();
    if (lastActiveDateStr === today) return;

    const newStreak =
      lastActiveDateStr === yesterdayStr() ? streakDays + 1 : 1;

    set({ streakDays: newStreak, lastActiveDateStr: today });
    debouncedSyncProgress(get());
  },

  reset: () => {
    set({
      xp: 0,
      streakDays: 0,
      lastActiveDateStr: null,
      completedChapterIds: [],
      completedTopics: [],
      defusedTrapIds: [],
      masteredFlashcardIds: [],
      isHydrated: true,
    });
    // Fire immediate sync to reset remote data
    if (typeof window !== "undefined") {
      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xp: 0,
          streakDays: 0,
          completedChapterIds: [],
          completedTopics: [],
          defusedTraps: [],
          masteredFlashcards: [],
        }),
      }).catch(console.error);
    }
  },
  
  hydrateFromServer: (data) => {
    set((s) => ({
      ...s,
      ...data,
      isHydrated: true,
    }));
  },
}));
