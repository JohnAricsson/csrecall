/**
 * Utility functions for topic identification and completion scoping.
 * Ensures generic topic IDs (e.g., 'topic-1') do not collide across different chapters.
 */

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
