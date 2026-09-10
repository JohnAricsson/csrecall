import { cache } from "react";
import fs from "fs";
import path from "path";
import { validateChapter } from "@/lib/schema";
import type { Chapter, Flashcard } from "@/lib/schema";

// ─── Memoised loaders (React cache – one value per request/render) ────────────

/**
 * Returns all validated chapters, sorted by chapterNumber.
 * Reads all .json files from src/data/chapters using fs.
 */
export const getAllChapters = cache((): Chapter[] => {
  const chaptersDirectory = path.join(process.cwd(), "src/data/chapters");

  let filenames: string[] = [];
  try {
    filenames = fs.readdirSync(chaptersDirectory);
  } catch (err) {
    console.error("Error reading chapters directory:", err);
    return [];
  }

  const jsonFiles = filenames.filter((file) =>
    file.toLowerCase().endsWith(".json"),
  );
  const chapters: Chapter[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(chaptersDirectory, file);
    try {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const rawJson = JSON.parse(fileContents);
      const chapter = validateChapter(rawJson);
      chapters.push(chapter);
    } catch (err) {
      console.error(`Zod parse error in ${file}:`, err);
    }
  }

  return chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
});

/**
 * Returns a single validated chapter by its `id` string (e.g. "chapter-1").
 */
export const getChapterById = cache((id: string): Chapter | undefined => {
  return getAllChapters().find((c) => c.id === id);
});

/**
 * Collects every flashcard defined across all topics in a chapter.
 */
export const getFlashcardsByChapter = cache((id: string): Flashcard[] => {
  const chapter = getChapterById(id);
  if (!chapter) return [];

  return chapter.sections.flatMap((section) =>
    section.topics.flatMap((topic) => topic.flashcards ?? []),
  );
});
