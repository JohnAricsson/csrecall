import { z } from "zod";

// ─── Leaf schemas ────────────────────────────────────────────────────────────

export const CodeSnippetSchema = z.object({
  language: z.string(),
  code: z.string(),
  explanation: z.string().optional(),
});

export const ComparisonTableSchema = z.object({
  title: z.string(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

export const TrapSchema = z.object({
  id: z.string(),
  statement: z.string(),
  explanation: z.string(),
  category: z.enum(["interview-gotcha", "common-mistake", "conceptual"]),
});

export const FlashcardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

// ─── Topic ───────────────────────────────────────────────────────────────────

export const TopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  explanation: z.string().optional(),
  tldr: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
  codeSnippets: z.array(CodeSnippetSchema).optional(),
  comparisons: z.array(ComparisonTableSchema).optional(),
  traps: z.array(TrapSchema).optional(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
  flashcards: z.array(FlashcardSchema).optional(),
  memoryMap: z
    .object({
      nodes: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          description: z.string(),
        }),
      ),
    })
    .optional(),
});

// ─── Section ─────────────────────────────────────────────────────────────────

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  topics: z.array(TopicSchema),
});

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const ChapterSchema = z.object({
  id: z.string(),
  chapterNumber: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  estimatedMinutes: z.number().int().positive(),
  sections: z.array(SectionSchema),
});

// ─── TypeScript types (inferred from schemas) ────────────────────────────────

export type CodeSnippet = z.infer<typeof CodeSnippetSchema>;
export type ComparisonTable = z.infer<typeof ComparisonTableSchema>;
export type Trap = z.infer<typeof TrapSchema>;
export type Flashcard = z.infer<typeof FlashcardSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;

// ─── Validator ───────────────────────────────────────────────────────────────

/**
 * Validates raw JSON data against the ChapterSchema.
 * Throws a ZodError with descriptive messages on failure.
 */
export function validateChapter(data: unknown): Chapter {
  return ChapterSchema.parse(data);
}
