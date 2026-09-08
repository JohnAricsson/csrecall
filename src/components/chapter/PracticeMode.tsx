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
        // Fixed height via wrapper
      >
        {/* ── Front face ──────────────────────────────────────── */}
        <div
          className="w-full min-h-[260px] p-8 rounded-2xl border-2 border-stone-900 bg-white shadow-[6px_6px_0px_0px_#1c1917] flex flex-col gap-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-start justify-between">
            <Badge variant="violet">
              Card {index + 1} of {total}
            </Badge>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">
              Click or Space to flip
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-stone-900 font-black text-xl sm:text-2xl text-center leading-snug">
              {card.question}
            </p>
          </div>
          <div className="text-center text-stone-300 text-2xl">· · ·</div>
        </div>

        {/* ── Back face ───────────────────────────────────────── */}
        <div
          className="w-full min-h-[260px] p-8 rounded-2xl border-2 border-stone-900 bg-emerald-500 shadow-[6px_6px_0px_0px_#064e3b] flex flex-col gap-5 absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-start justify-between">
            <Badge variant="emerald">Answer</Badge>
            <span className="text-xs text-emerald-200 font-bold uppercase tracking-widest">
              Press 1 = Hard | 2 = Nailed
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white font-bold text-lg sm:text-xl text-center leading-relaxed">
              {card.answer}
            </p>
          </div>
          <div className="text-center text-emerald-300 text-2xl">✓</div>
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

export function PracticeMode({ chapter }: PracticeModeProps) {
  const allCards = getFlashcards(chapter);

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
              variant="ghost"
              size="lg"
              onClick={handleHard}
              className="flex-1 max-w-[200px] border-rose-400 text-rose-600 hover:bg-rose-50"
            >
              🔴 Hard / Again
              <kbd className="ml-auto px-1.5 py-0.5 rounded border border-stone-300 bg-stone-100 text-stone-400 text-xs font-mono">
                1
              </kbd>
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => void handleNailed()}
              className="flex-1 max-w-[200px]"
            >
              🟢 Nailed It!
              <kbd className="ml-auto px-1.5 py-0.5 rounded border border-emerald-700 bg-emerald-600 text-white text-xs font-mono">
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
