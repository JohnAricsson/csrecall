"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGameStore } from "@/stores/gameStore";

export function StoreHydrator() {
  const { status } = useSession();
  const hydrateFromServer = useGameStore((s) => s.hydrateFromServer);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/progress")
        .then((res) => res.json())
        .then((payload) => {
          if (payload?.ok && payload?.data) {
            hydrateFromServer(payload.data);
          }
        })
        .catch((err) => {
          console.error("[StoreHydrator] Error fetching progress from database:", err);
        });
    } else if (status === "unauthenticated") {
      hydrateFromServer({
        xp: 0,
        streakDays: 0,
        completedChapterIds: [],
        completedTopics: [],
        defusedTrapIds: [],
        masteredFlashcardIds: [],
      });
    }
  }, [status, hydrateFromServer]);

  return null;
}
