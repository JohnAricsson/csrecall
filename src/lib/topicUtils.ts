import type { Topic, Chapter } from "@/lib/schema";

/**
 * Utility functions for topic identification, completion scoping, and filtering.
 * Ensures generic topic IDs (e.g., 'topic-1') do not collide across different chapters,
 * and pure container topics (flashcard decks, trap checklists) are excluded from learning topic counts.
 */

/**
 * Determines whether a topic item is a genuine learning topic (as opposed to a container for flashcards or traps).
 */
export function isLearnableTopic(topic: Topic): boolean {
  // Exclude pure utility/container topics
  const isContainer =
    /flashcard|trap/i.test(topic.id) ||
    /flashcard|trap/i.test(topic.title) ||
    Boolean(topic.flashcards && topic.flashcards.length > 0) ||
    /checklist/i.test(topic.title);

  if (isContainer) return false;

  // Must have content to read/learn
  const hasContent = Boolean(
    (topic.explanation && topic.explanation.trim().length > 0) ||
    (topic.codeSnippets && topic.codeSnippets.length > 0) ||
    (topic.questions && topic.questions.length > 0) ||
    (topic.comparisons && topic.comparisons.length > 0) ||
    (topic.keyPoints && topic.keyPoints.length > 0) ||
    (topic.tldr && topic.tldr.trim().length > 0),
  );

  return hasContent;
}

/**
 * Extracts all genuine learning topics for a given chapter.
 */
export function getLearnableTopics(chapter: Chapter): Topic[] {
  return chapter.sections.flatMap((s) => s.topics).filter(isLearnableTopic);
}

/**
 * Returns a scoped compound topic key: `${chapterId}::${topicId}`
 */
export function getScopedTopicId(chapterId: string, topicId: string): string {
  if (topicId.includes("::")) return topicId;
  return `${chapterId}::${topicId}`;
}

/**
 * Checks if a topic belonging to a chapter is completed.
 * Handles both compound keys (`chapter-1::topic-1`) and legacy unscoped keys (`topic-1`)
 * while strictly ensuring unscoped keys are never attributed to any chapter other than chapter-1.
 */
export function isTopicCompleted(
  completedTopics: string[] | undefined,
  chapterId: string,
  topicId: string,
): boolean {
  if (!completedTopics || completedTopics.length === 0) return false;

  // 1. Direct compound key match (e.g. "chapter-3::topic-1")
  const scopedId = `${chapterId}::${topicId}`;
  if (completedTopics.includes(scopedId)) return true;

  // 2. Exact match if topicId already has "::"
  if (topicId.includes("::") && completedTopics.includes(topicId)) return true;

  // 3. Backward compatibility: Legacy unscoped IDs in storage/DB originated from chapter-1.
  // Strictly prevent unscoped IDs (e.g. "topic-1") from matching chapter-3, chapter-10, etc.
  if (chapterId === "chapter-1" && completedTopics.includes(topicId)) {
    return true;
  }

  return false;
}

/**
 * Converts Western digits to Bengali numerals.
 */
export function toBengaliDigits(num: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)] || d);
}

/**
 * Returns a canonical scoped compound trap key: `chapterId::topicId::trapId`
 */
export function getCanonicalTrapId(
  chapterId: string,
  topicId: string,
  trapId: string,
): string {
  const parts = trapId.split("::");
  if (parts.length === 3) return trapId;
  return `${chapterId}::${topicId}::${trapId}`;
}

export const getScopedTrapId = getCanonicalTrapId;

/**
 * Checks if a trap belonging to a specific chapter and topic is defused.
 * Matches canonical format: `chapterId::topicId::trapId`.
 * Also handles backwards compatibility with 2-part keys (`chapterId::trapId`)
 * and legacy unscoped IDs strictly scoped to `chapter-1`.
 */
export function isTrapDefused(
  defusedTraps: string[] | undefined,
  chapterId: string,
  topicId: string,
  trapId: string,
): boolean {
  if (!defusedTraps || defusedTraps.length === 0) return false;

  const canonicalId =
    trapId.split("::").length === 3
      ? trapId
      : `${chapterId}::${topicId}::${trapId}`;

  // 1. Direct canonical match
  if (defusedTraps.includes(canonicalId)) return true;

  // 2. Exact match if raw trapId matches directly
  if (defusedTraps.includes(trapId) && trapId.includes("::")) return true;

  // 3. Backward compatibility: 2-part compound keys (e.g. "chapter-1::trap-1-1")
  const twoPartId = `${chapterId}::${trapId}`;
  if (defusedTraps.includes(twoPartId)) {
    return true;
  }

  // 4. Backward compatibility: Legacy unscoped IDs in storage/DB originated strictly from chapter-1
  if (chapterId === "chapter-1" && defusedTraps.includes(trapId)) {
    return true;
  }

  return false;
}
