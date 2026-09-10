import { create } from "zustand";
import { XP_REWARDS } from "@/lib/gameConstants";
import {
  isTopicCompleted,
  isTrapDefused,
  getCanonicalTrapId,
} from "@/lib/topicUtils";

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
  completeTopic: (id: string, chapterId?: string) => void;
  masterFlashcard: (id: string) => void;
  defuseTrap: (
    canonicalId: string,
    chapterId?: string,
    topicId?: string,
  ) => void;
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

  completeTopic: (id, chapterId) => {
    const s = get();
    const compoundId = chapterId
      ? id.includes("::")
        ? id
        : `${chapterId}::${id}`
      : id;

    if (s.completedTopics.includes(compoundId)) return;
    if (chapterId && isTopicCompleted(s.completedTopics, chapterId, id)) return;

    const nextTopics = [...s.completedTopics, compoundId];
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

  defuseTrap: (id, chapterId, topicId) => {
    const s = get();
    let canonicalId = id;
    if (!canonicalId.includes("::") && chapterId && topicId) {
      canonicalId = getCanonicalTrapId(chapterId, topicId, id);
    }

    if (s.defusedTrapIds.includes(canonicalId)) return;

    const parts = canonicalId.split("::");
    if (parts.length === 3) {
      const [cId, topId, trId] = parts;
      if (isTrapDefused(s.defusedTrapIds, cId, topId, trId)) return;
    }

    const nextTraps = [...s.defusedTrapIds, canonicalId];
    const nextXp = s.xp + XP_REWARDS.TRAP_DEFUSED;
    set({
      defusedTrapIds: nextTraps,
      xp: nextXp,
    });

    if (typeof window !== "undefined") {
      const parts = canonicalId.split("::");
      const effChapterId = parts.length === 3 ? parts[0] : (chapterId ?? "");
      const effTopicId = parts.length === 3 ? parts[1] : (topicId ?? "");
      const effTrapId = parts.length === 3 ? parts[2] : id;

      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "defuseTrap",
          chapterId: effChapterId,
          topicId: effTopicId,
          trapId: effTrapId,
          scopedTrapId: canonicalId,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const resData = await res.json();
            if (resData?.data?.defusedTraps) {
              set((cur) => ({
                defusedTrapIds: Array.from(
                  new Set([
                    ...cur.defusedTrapIds,
                    ...resData.data.defusedTraps,
                  ]),
                ),
                xp:
                  typeof resData.data.xp === "number"
                    ? Math.max(cur.xp, resData.data.xp)
                    : cur.xp,
              }));
            }
          } else {
            debouncedSyncProgress(get());
          }
        })
        .catch(() => {
          debouncedSyncProgress(get());
        });
    } else {
      debouncedSyncProgress(get());
    }
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

    const newStreak = lastActiveDateStr === yesterdayStr() ? streakDays + 1 : 1;

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
      defusedTrapIds:
        (data as any).defusedTraps ??
        (data as any).defusedTrapIds ??
        s.defusedTrapIds,
      masteredFlashcardIds:
        (data as any).masteredFlashcards ??
        (data as any).masteredFlashcardIds ??
        s.masteredFlashcardIds,
      isHydrated: true,
    }));
  },
}));
