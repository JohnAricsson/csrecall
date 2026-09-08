"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING_CFG = { stiffness: 320, damping: 30 };

const CONFETTI_COLORS: Record<string, string[]> = {
  violet: ["#7c3aed", "#a78bfa", "#ede9fe"],
  emerald: ["#10b981", "#6ee7b7", "#d1fae5"],
  rose: ["#f43f5e", "#fb7185", "#ffe4e6"],
  amber: ["#f59e0b", "#fcd34d", "#fef3c7"],
};

const BACK_BG: Record<string, string> = {
  violet: "bg-violet-600",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

// ─── Feature card data ────────────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    emoji: "📚",
    title: "12 Chapters",
    description:
      "Short, clean cheat sheets on OOP, Pointers, Memory, and Data Structures. No unnecessary theory, only what interviewers actually ask.",
    accent: "violet",
  },
  {
    emoji: "🃏",
    title: "200+ Flashcards",
    description:
      "Quick question-and-answer cards. Flip the card, check your answer, and never forget key definitions during an interview.",
    accent: "emerald",
  },
  {
    emoji: "🪤",
    title: "60+ Traps",
    description:
      "Tricky coding questions where most freshers make mistakes. Learn how to avoid these common interview traps.",
    accent: "rose",
  },
  {
    emoji: "⚡",
    title: "5-Min Sprint",
    description:
      "Have an interview today? Answer 5 quick questions and traps to warm up your brain right before your viva or tech round.",
    accent: "amber",
  },
];

// ─── 3D Flip Feature Card ─────────────────────────────────────────────────────

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  accent: string;
  delay: number;
}

function FeatureCard({
  emoji,
  title,
  description,
  accent,
  delay,
}: FeatureCardProps) {
  const [flipped, setFlipped] = useState(false);

  // Mouse-relative position (-0.5 → 0.5) for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    SPRING_CFG,
  );
  const tiltY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    SPRING_CFG,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (flipped) return;
      const r = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - r.left) / r.width - 0.5);
      mouseY.set((e.clientY - r.top) / r.height - 0.5);
    },
    [flipped, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Reset tilt springs to neutral before flip
      mouseX.set(0);
      mouseY.set(0);
      setFlipped((f) => !f);

      // Dynamic import keeps confetti out of the initial JS bundle
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 55,
          spread: 70,
          startVelocity: 28,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: CONFETTI_COLORS[accent] ?? CONFETTI_COLORS["violet"],
          scalar: 0.88,
          disableForReducedMotion: true,
        });
      });
    },
    [accent, mouseX, mouseY],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mouseX.set(0);
        mouseY.set(0);
        setFlipped((f) => !f);
      }
    },
    [mouseX, mouseY],
  );

  const backBgClass = BACK_BG[accent] ?? "bg-violet-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 24, delay }}
    >
      {/* Perspective wrapper */}
      <div style={{ perspective: "900px" }}>
        {/* Tilt layer — tracks mouse, resets when flipped */}
        <motion.div
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`${title} — click to flip`}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-2xl"
        >
          {/* Flip layer */}
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              position: "relative",
              height: "13rem",
            }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {/* ── Front face ────────────────────────────────── */}
            <div
              className={cn(
                "absolute inset-0 p-5 rounded-2xl",
                "border-2 border-stone-900 bg-white",
                "shadow-[4px_4px_0px_0px_#1c1917]",
                "flex flex-col gap-3 select-none",
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-4xl leading-none">{emoji}</span>
              <div className="flex-1">
                <p className="font-black text-stone-900 text-lg leading-tight">
                  {title}
                </p>
              </div>
              <p className="text-xs text-stone-400 font-semibold">
                Click to reveal →
              </p>
            </div>

            {/* ── Back face ─────────────────────────────────── */}
            <div
              className={cn(
                "absolute inset-0 p-5 rounded-2xl",
                "border-2 border-stone-900",
                backBgClass,
                "flex flex-col items-center justify-center gap-3",
                "text-center select-none",
              )}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="text-3xl leading-none">{emoji}</span>
              <p className="text-white font-bold text-sm leading-snug max-w-[160px]">
                {description}
              </p>
              <p className="text-white/60 text-xs font-semibold">
                Click to flip back ↩
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Hero Visual — floating parallax card stack ───────────────────────────────

function HeroVisual() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const slowSpring = { stiffness: 60, damping: 18 };

  // Three cards at different parallax depths
  const c1x = useSpring(useTransform(mouseX, [0, 1], [-28, 28]), slowSpring);
  const c1y = useSpring(useTransform(mouseY, [0, 1], [-18, 18]), slowSpring);

  const c2x = useSpring(useTransform(mouseX, [0, 1], [14, -14]), slowSpring);
  const c2y = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), slowSpring);

  const c3x = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), slowSpring);
  const c3y = useSpring(useTransform(mouseY, [0, 1], [6, -6]), slowSpring);

  return (
    <div
      aria-hidden
      className="relative w-full h-72 lg:h-80 select-none pointer-events-none"
    >
      {/* Card 3 — Trap (deepest layer) */}
      <motion.div
        style={{ x: c3x, y: c3y, rotate: 7, zIndex: 1 }}
        className="absolute top-10 right-2 w-52"
      >
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#fb7185]">
          <p className="text-xs font-black uppercase tracking-widest text-rose-500 mb-1.5">
            🪤 Trap
          </p>
          <p className="text-sm font-bold text-stone-800 leading-snug">
            &ldquo;const prevents object mutation&rdquo;
          </p>
          <p className="text-xs text-stone-400 mt-1.5">
            Is this true? Click to defuse!
          </p>
        </div>
      </motion.div>

      {/* Card 2 — Flashcard (middle layer) */}
      <motion.div
        style={{ x: c2x, y: c2y, rotate: -4, zIndex: 2 }}
        className="absolute bottom-4 left-2 w-52"
      >
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 shadow-[4px_4px_0px_0px_#f59e0b]">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-2">
            🃏 Flashcard
          </p>
          <p className="text-sm font-bold text-stone-800">
            What is Big-O notation?
          </p>
          <div className="mt-2 pt-2 border-t border-amber-200">
            <p className="text-xs text-stone-500">
              A way to describe algorithm efficiency…
            </p>
          </div>
        </div>
      </motion.div>

      {/* Card 1 — Topic (front layer) */}
      <motion.div
        style={{ x: c1x, y: c1y, zIndex: 3 }}
        className="absolute top-0 left-8 w-60"
      >
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_#1c1917]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-violet-600 rounded-lg border-2 border-stone-900 flex items-center justify-center flex-shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-violet-600">
              Topic
            </span>
          </div>
          <p className="font-black text-stone-900 text-base mb-1.5 leading-tight">
            OOP — Polymorphism
          </p>
          <p className="text-xs text-stone-500 leading-relaxed">
            The ability of different classes to respond to the same method call
            in their own way…
          </p>
          <div className="flex gap-1.5 mt-3">
            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold border border-violet-300">
              OOP
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-300">
              Java
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Animated headline word ────────────────────────────────────────────────────

function Word({
  children,
  delay,
  accent,
}: {
  children: React.ReactNode;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.span
      className={accent ? "text-violet-600" : "text-stone-900"}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay }}
    >
      {children}
    </motion.span>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-50 border-b-2 border-stone-900">
      {/* Dot-grid background decoration */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1c1917 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        {/* ── Row 1: Headline + floating visual ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12 sm:mb-16">
          {/* Left: text + CTAs */}
          <div>
            {/* Arena badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border-2 border-violet-300 bg-violet-100 text-violet-800 text-xs font-black uppercase tracking-widest"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Zap className="w-3 h-3" />
              Programming Training Arena
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-5 flex flex-wrap gap-x-3 gap-y-0.5">
              <Word delay={0.06}>Clear</Word>
              <Word delay={0.12} accent>
                Your
              </Word>
              <Word delay={0.2}>Tech</Word>
              <Word delay={0.26}>Interview</Word>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-stone-600 font-medium max-w-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Simple, short notes, quick flashcards, and tricky interview traps.
              Revise OOP, memory, and coding basics in minutes without reading
              long books.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
            >
              <Link href="/chapter/chapter-1">
                <Button variant="primary" size="lg">
                  Start Quest
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </Link>
              <Link href="/sprint">
                <Button variant="accent" size="lg">
                  <Zap className="w-5 h-5" strokeWidth={2.5} />
                  5-Min Sprint
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: floating card stack (desktop only) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* ── Row 2: 3D flip feature cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-10 sm:pb-14">
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={card.title} {...card} delay={0.52 + i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
