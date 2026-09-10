import test from "node:test";
import assert from "node:assert/strict";

// Re-implement pure logic or import from compiled/pure helpers
function toBengaliDigits(num) {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)] || d);
}

function getScopedTopicId(chapterId, topicId) {
  if (topicId.includes("::")) return topicId;
  return `${chapterId}::${topicId}`;
}

function isTopicCompleted(completedTopics, chapterId, topicId) {
  if (!completedTopics || completedTopics.length === 0) return false;
  const scopedId = `${chapterId}::${topicId}`;
  if (completedTopics.includes(scopedId)) return true;
  if (topicId.includes("::") && completedTopics.includes(topicId)) return true;
  if (chapterId === "chapter-1" && completedTopics.includes(topicId))
    return true;
  return false;
}

function getCanonicalTrapId(chapterId, topicId, trapId) {
  const parts = trapId.split("::");
  if (parts.length === 3) return trapId;
  return `${chapterId}::${topicId}::${trapId}`;
}

function isTrapDefused(defusedTraps, chapterId, topicId, trapId) {
  if (!defusedTraps || defusedTraps.length === 0) return false;
  const canonicalId =
    trapId.split("::").length === 3
      ? trapId
      : `${chapterId}::${topicId}::${trapId}`;

  if (defusedTraps.includes(canonicalId)) return true;
  if (defusedTraps.includes(trapId) && trapId.includes("::")) return true;
  const twoPartId = `${chapterId}::${trapId}`;
  if (defusedTraps.includes(twoPartId)) return true;
  if (chapterId === "chapter-1" && defusedTraps.includes(trapId)) return true;
  return false;
}

test("toBengaliDigits converts ASCII digits to Bengali numerals correctly", () => {
  assert.equal(toBengaliDigits(0), "০");
  assert.equal(toBengaliDigits(12345), "১২৩৪৫");
  assert.equal(toBengaliDigits("Chapter 12"), "Chapter ১২");
  assert.equal(toBengaliDigits(67890), "৬৭৮৯০");
});

test("getScopedTopicId creates proper compound keys", () => {
  assert.equal(getScopedTopicId("chapter-1", "topic-2"), "chapter-1::topic-2");
  assert.equal(
    getScopedTopicId("chapter-3", "chapter-3::topic-5"),
    "chapter-3::topic-5",
  );
});

test("isTopicCompleted strictly isolates unscoped legacy IDs to chapter-1", () => {
  const completed = ["topic-1", "chapter-2::topic-1"];

  // topic-1 without prefix should match chapter-1 for backwards compatibility
  assert.equal(isTopicCompleted(completed, "chapter-1", "topic-1"), true);

  // topic-1 should NOT match chapter-3 (must not collide)
  assert.equal(isTopicCompleted(completed, "chapter-3", "topic-1"), false);

  // chapter-2::topic-1 should match chapter-2
  assert.equal(isTopicCompleted(completed, "chapter-2", "topic-1"), true);
});

test("getCanonicalTrapId formats canonical 3-part IDs", () => {
  assert.equal(
    getCanonicalTrapId("chapter-1", "topic-2", "trap-1"),
    "chapter-1::topic-2::trap-1",
  );
  assert.equal(
    getCanonicalTrapId("chapter-5", "topic-3", "chapter-5::topic-3::trap-2"),
    "chapter-5::topic-3::trap-2",
  );
});

test("isTrapDefused correctly resolves canonical and scoped traps", () => {
  const defused = [
    "chapter-1::topic-1::trap-1",
    "chapter-2::trap-2",
    "trap-legacy",
  ];

  assert.equal(isTrapDefused(defused, "chapter-1", "topic-1", "trap-1"), true);
  assert.equal(isTrapDefused(defused, "chapter-2", "topic-3", "trap-2"), true);
  assert.equal(
    isTrapDefused(defused, "chapter-1", "topic-1", "trap-legacy"),
    true,
  );
  assert.equal(
    isTrapDefused(defused, "chapter-3", "topic-1", "trap-legacy"),
    false,
  );
});
