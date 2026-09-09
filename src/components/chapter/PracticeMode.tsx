"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter, Flashcard } from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pulls flashcards from topic-15 (RAPID REVISION FLASHCARDS). */
function getFlashcards(chapter: Chapter): Flashcard[] {
  for (const section of chapter.sections) {
    for (const topic of section.topics) {
      if (topic.id === "topic-15" && topic.flashcards) {
        return topic.flashcards;
      }
    }
  }
  // Fallback: collect all flashcards across the chapter
  return chapter.sections.flatMap((s) =>
    s.topics.flatMap((t) => t.flashcards ?? []),
  );
}

// ─── 3D Flash Card ────────────────────────────────────────────────────────────

interface FlashCardProps {
  card: Flashcard;
  index: number;
  total: number;
  isFlipped: boolean;
  onFlip: () => void;
}

function FlashCard({ card, index, total, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
      role="button"
      aria-label="Click or press Space to flip card"
      tabIndex={0}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d", position: "relative" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
        className="w-full"
      >
        {/* ── Front face ──────────────────────────────────────── */}
        <div
          className="w-full min-h-[280px] p-6 sm:p-8 rounded-2xl border-2 border-stone-900 bg-white shadow-[6px_6px_0px_0px_#1c1917] flex flex-col justify-between relative overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />

          <div className="flex items-start justify-between pt-1">
            <Badge
              variant="violet"
              className="shadow-[1px_1px_0px_0px_#4c1d95]"
            >
              Card {index + 1} of {total}
            </Badge>
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
              Click or <kbd className="font-mono text-stone-700">Space</kbd> to
              flip
            </span>
          </div>

          <div className="my-6 flex items-center justify-center text-center px-2 sm:px-6">
            <p className="text-stone-900 font-black text-xl sm:text-2xl lg:text-3xl leading-snug">
              {card.question}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-stone-400 pt-3 border-t border-stone-100">
            <span>Flip to reveal answer</span>
            <span className="text-violet-600">⚡ Tap or Spacebar</span>
          </div>
        </div>

        {/* ── Back face ───────────────────────────────────────── */}
        <div
          className="w-full min-h-[280px] p-6 sm:p-8 rounded-2xl border-2 border-stone-900 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-[6px_6px_0px_0px_#064e3b] flex flex-col justify-between absolute inset-0 relative overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-300" />

          <div className="flex items-start justify-between pt-1">
            <Badge
              variant="emerald"
              className="bg-white text-emerald-900 border-white shadow-none"
            >
              ✓ Core Answer
            </Badge>
            <span className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider bg-emerald-700/60 px-2 py-0.5 rounded border border-emerald-400/40">
              1 = Hard · 2 = Nailed
            </span>
          </div>

          <div className="my-6 flex items-center justify-center text-center px-2 sm:px-6">
            <p className="text-white font-black text-lg sm:text-xl lg:text-2xl leading-relaxed text-shadow-sm">
              {card.answer}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-emerald-200 pt-3 border-t border-emerald-400/40">
            <span>Rate your recall below:</span>
            <span className="text-white font-black">Nailed it? Press 2 🎯</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
      <span className="text-6xl">🎉</span>
      <h2 className="font-black text-2xl text-stone-900">All Done!</h2>
      <p className="text-stone-500 font-medium max-w-xs">
        You&apos;ve reviewed all flashcards. Switch to Traps mode to test your
        defusal skills.
      </p>
    </div>
  );
}

// ─── Practice Mode ────────────────────────────────────────────────────────────

interface PracticeModeProps {
  chapter: Chapter;
}

import { useGameStore } from "@/stores/gameStore";

export function PracticeMode({ chapter }: PracticeModeProps) {
  const allCards = getFlashcards(chapter);
  const { masterFlashcard } = useGameStore();

  // State
  const [deck, setDeck] = useState<Flashcard[]>(allCards);
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [nailedCount, setNailedCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentCard = deck[0] ?? reviewQueue[0] ?? null;
  const deckIndex = allCards.findIndex((c) => c.id === currentCard?.id);
  const progress = Math.round((nailedCount / allCards.length) * 100);

  // ── Keyboard shortcuts ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentCard) return;

      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === "1" || e.code === "Digit1" || e.code === "Numpad1") {
        e.preventDefault();
        handleHard();
      } else if (e.key === "2" || e.code === "Digit2" || e.code === "Numpad2") {
        e.preventDefault();
        void handleNailed();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }); // Run on every render to ensure latest state in closure

  // ── Actions ────────────────────────────────────────────────────
  function advance() {
    setIsFlipped(false);
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    if (newDeck.length === 0 && reviewQueue.length === 0) {
      setSessionDone(true);
    }
  }

  function handleHard() {
    if (!currentCard || !isFlipped) return;
    // Move card to end of review queue
    if (deck.length > 0) {
      setReviewQueue((q) => [...q, currentCard]);
      advance();
    } else {
      // Already in reviewQueue — reshuffle it to end
      const [, ...rest] = reviewQueue;
      setReviewQueue([...rest, currentCard]);
      setIsFlipped(false);
    }
  }

  async function handleNailed() {
    if (!currentCard || !isFlipped) return;
    // Confetti burst
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#10b981", "#6ee7b7", "#d1fae5", "#f59e0b"],
        scalar: 0.9,
        disableForReducedMotion: true,
      });
    });
    setNailedCount((n) => n + 1);
    masterFlashcard(currentCard.id);

    if (deck.length > 0) {
      advance();
    } else {
      const [, ...rest] = reviewQueue;
      setReviewQueue(rest);
      setIsFlipped(false);
      if (rest.length === 0) setSessionDone(true);
    }
  }

  if (sessionDone || !currentCard) {
    return <EmptyState />;
  }

  const displayIndex = deckIndex >= 0 ? deckIndex : allCards.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-widest">
          <span>Session Progress</span>
          <span>
            {nailedCount} / {allCards.length} nailed
          </span>
        </div>
        <ProgressBar value={progress} variant="readiness" />
        {reviewQueue.length > 0 && (
          <p className="text-xs text-amber-600 font-bold">
            🔄 {reviewQueue.length} card{reviewQueue.length > 1 ? "s" : ""} to
            review again
          </p>
        )}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <FlashCard
            card={currentCard}
            index={displayIndex}
            total={allCards.length}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((f) => !f)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Rating buttons — only visible when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex gap-3 justify-center"
          >
            <Button
              variant="danger"
              size="lg"
              onClick={handleHard}
              className="flex-1 max-w-[200px] cursor-pointer"
            >
              <span>🔴 Hard / Again</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded border border-rose-700 bg-rose-700/80 text-white text-xs font-mono">
                1
              </kbd>
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => void handleNailed()}
              className="flex-1 max-w-[200px] cursor-pointer"
            >
              <span>🟢 Nailed It!</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded border border-emerald-800 bg-emerald-700/80 text-white text-xs font-mono">
                2
              </kbd>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-stone-400 font-medium">
        <kbd className="px-1.5 py-0.5 rounded border border-stone-300 bg-stone-100 text-stone-500 font-mono">
          Space
        </kbd>{" "}
        to flip &nbsp;·&nbsp;{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-stone-300 bg-stone-100 text-stone-500 font-mono">
          1
        </kbd>{" "}
        Hard &nbsp;·&nbsp;{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-stone-300 bg-stone-100 text-stone-500 font-mono">
          2
        </kbd>{" "}
        Nailed
      </p>
    </div>
  );
}
