"use client";

import { useState } from "react";
import type { Chapter, Flashcard } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { toBengaliDigits } from "@/lib/topicUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pulls flashcards from topic-15 (RAPID REVISION FLASHCARDS) or fallbacks across chapter. */
function getFlashcards(chapter: Chapter): Flashcard[] {
  for (const section of chapter.sections) {
    for (const topic of section.topics) {
      if (
        topic.id === "topic-15" &&
        topic.flashcards &&
        topic.flashcards.length > 0
      ) {
        return topic.flashcards;
      }
    }
  }
  // Fallback: collect all flashcards across the chapter
  return chapter.sections.flatMap((s) =>
    s.topics.flatMap((t) => t.flashcards ?? []),
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center p-6 bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] max-w-md mx-auto">
      <span className="text-5xl">🃏</span>
      <h2 className="font-black text-2xl text-stone-900">No Flashcards Yet</h2>
      <p className="text-stone-600 font-semibold text-sm">
        There are no practice cards currently available for this chapter.
      </p>
    </div>
  );
}

// ─── Practice Mode ────────────────────────────────────────────────────────────

interface PracticeModeProps {
  chapter: Chapter;
}

export function PracticeMode({ chapter }: PracticeModeProps) {
  const flashcards = getFlashcards(chapter);
  const totalCards = flashcards.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (totalCards === 0) {
    return <EmptyState />;
  }

  const currentCard = flashcards[currentIndex];

  function handleFlip() {
    setIsFlipped((prev) => !prev);
  }

  function handlePrevious() {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.min(totalCards - 1, prev + 1));
  }

  return (
    <div className="max-w-2xl mx-auto pt-12 sm:pt-16 pb-6">
      {/* ── 3D Tap-to-Flip Viewer Container ── */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Tap to flip card"
        className="relative w-full max-w-2xl mx-auto h-[320px] sm:h-[360px] [perspective:1000px] cursor-pointer select-none"
      >
        {/* Rotating canvas */}
        <div
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]",
          )}
        >
          {/* ── Front Face (Question) ── */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden"
          >
            {/* Top accent border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

            {/* Top header row */}
            <div className="flex items-center justify-between pt-1">
              <span className="bg-amber-300 text-stone-950 font-black text-xs sm:text-sm px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase tracking-wider">
                কার্ড {toBengaliDigits(currentIndex + 1)} /{" "}
                {toBengaliDigits(totalCards)}
              </span>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider bg-yellow-200 text-stone-950 px-2.5 py-1 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                উল্টাতে ট্যাপ করুন 🔄
              </span>
            </div>

            {/* Center: Question Text */}
            <div className="my-auto flex items-center justify-center text-center px-2 sm:px-6">
              <p className="text-xl md:text-2xl font-black text-stone-900 text-center leading-snug">
                {currentCard.question}
              </p>
            </div>

            {/* Bottom hint pill */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-[11px] sm:text-xs font-black text-stone-600 pt-2.5 sm:pt-3 border-t-2 border-black/20 text-center sm:text-left">
              <span className="text-stone-700">
                ⚡ উত্তর দেখতে কার্ডে ট্যাপ করুন
              </span>
              <span className="text-rose-600 uppercase tracking-wider font-black">
                কার্ড ফ্লিপ করুন 👆
              </span>
            </div>
          </div>

          {/* ── Back Face (Answer) ── */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-emerald-400 text-stone-950 border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden"
          >
            {/* Top accent border */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-300 border-b-2 border-black" />

            {/* Top header row */}
            <div className="flex items-center justify-between pt-1">
              <span className="bg-[#fffdf7] text-stone-950 font-black text-xs sm:text-sm px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase tracking-wider">
                ✓ সঠিক উত্তর
              </span>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider bg-yellow-300 text-stone-950 px-2.5 py-1 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                কার্ড {toBengaliDigits(currentIndex + 1)} /{" "}
                {toBengaliDigits(totalCards)}
              </span>
            </div>

            {/* Center: Answer Text */}
            <div className="my-auto flex items-center justify-center text-center px-2 sm:px-6">
              <p className="text-lg md:text-xl font-black text-stone-950 text-center leading-relaxed">
                {currentCard.answer}
              </p>
            </div>

            {/* Bottom hint */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 text-[11px] sm:text-xs font-black text-stone-900 pt-2.5 sm:pt-3 border-t-2 border-black/20 text-center sm:text-left">
              <span>প্রশ্ন দেখতে আবার ট্যাপ করুন 🔄</span>
              <span className="bg-[#fffdf7] text-stone-950 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] uppercase tracking-wider font-black">
                উল্টাতে ট্যাপ করুন 🔄
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Arcade Navigation Controls Below Card ── */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          className="bg-stone-200 hover:bg-stone-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs sm:text-sm md:text-base px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
        >
          <span>←</span>
          <span>পূর্ববর্তী</span>
        </button>

        <span className="text-xs sm:text-sm font-black text-stone-900 bg-[#fffdf7] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          {toBengaliDigits(currentIndex + 1)} / {toBengaliDigits(totalCards)}
        </span>

        <button
          type="button"
          disabled={currentIndex === totalCards - 1}
          onClick={handleNext}
          className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2"
        >
          <span>পরবর্তী</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
