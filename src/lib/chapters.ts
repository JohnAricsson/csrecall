import { cache } from "react";
import { validateChapter } from "@/lib/schema";
import type { Chapter, Flashcard } from "@/lib/schema";

// ─── Raw imports ─────────────────────────────────────────────────────────────
// Next.js bundles JSON imports at build time, keeping reads out of the hot path.

import chapter1Raw from "@/data/chapters/chapter-1.json";

// ─── Registry ────────────────────────────────────────────────────────────────

const rawChapters: unknown[] = [chapter1Raw];

// ─── Memoised loaders (React cache – one value per request/render) ────────────

/**
 * Returns all validated chapters, sorted by chapterNumber.
 * Validation runs once per server render thanks to React `cache()`.
 */
export const getAllChapters = cache((): Chapter[] => {
  return rawChapters
    .map((raw) => validateChapter(raw))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
});

/**
 * Returns a single validated chapter by its `id` string (e.g. "chapter-1").
 * Returns `undefined` if not found.
 */
export const getChapterById = cache((id: string): Chapter | undefined => {
  return getAllChapters().find((c) => c.id === id);
});

/**
 * Collects every flashcard defined across all topics in a chapter.
 * Returns an empty array if the chapter is not found or has no flashcards.
 */
export const getFlashcardsByChapter = cache((id: string): Flashcard[] => {
  const chapter = getChapterById(id);
  if (!chapter) return [];

  return chapter.sections.flatMap((section) =>
    section.topics.flatMap((topic) => topic.flashcards ?? []),
  );
});
