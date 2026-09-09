"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Layers,
  ShieldAlert,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── 2D Elliptical Revolving Orbit Showcase ──────────────────────────────────

interface OrbitCard {
  id: string;
  pill: string;
  pillClass: string;
  xp: string;
  title: string;
  text: string;
  tag: string;
}

const ORBIT_CARDS: OrbitCard[] = [
  {
    id: "card-trap",
    pill: "⚠️ INTERVIEW TRAP",
    pillClass: "bg-rose-100 text-rose-800 border border-black",
    xp: "+30 XP",
    title: "The const Myth",
    text: "Does const user = {} make the object immutable? No! It only prevents reassigning the variable.",
    tag: "#JavaScript",
  },
  {
    id: "card-arch",
    pill: "🧠 ARCHITECTURE",
    pillClass: "bg-sky-100 text-sky-800 border border-black",
    xp: "+20 XP",
    title: "Stack vs Heap",
    text: "Stack stores quick function frames and primitives. Heap handles dynamic, long-lived objects.",
    tag: "#OperatingSystems",
  },
  {
    id: "card-speed",
    pill: "⚡ QUICK FIRE",
    pillClass: "bg-amber-100 text-amber-800 border border-black",
    xp: "+15 XP",
    title: "TCP vs UDP",
    text: "TCP guarantees every packet arrives in order. UDP sends fast without checking—perfect for video calls.",
    tag: "#Networks",
  },
];

// Generates smooth parametric 2D elliptical keyframes around a center point
function generateOrbitKeyframes(startAngleDeg: number) {
  const points = 36;
  const A = 145; // horizontal radius in pixels
  const B = 45; // vertical radius in pixels

  const x: number[] = [];
  const y: number[] = [];
  const scale: number[] = [];
  const zIndex: number[] = [];

  for (let i = 0; i <= points; i++) {
    const angle = startAngleDeg + (i / points) * 360;
    const rad = (angle * Math.PI) / 180;
    const cosVal = Math.cos(rad); // +1 at front (bottom), -1 at back (top)
    const sinVal = Math.sin(rad);

    const curX = Math.round(A * sinVal);
    const curY = Math.round(B * cosVal);
    // depth factor: 0 (back) to 1 (front)
    const depth = (cosVal + 1) / 2;

    const curScale = Number((0.74 + 0.26 * depth).toFixed(3));
    const curZ = Math.round(10 + 20 * depth);

    x.push(curX);
    y.push(curY);
    scale.push(curScale);
    zIndex.push(curZ);
  }

  return { x, y, scale, zIndex };
}

// 3 cards staggered evenly by 120 degrees around the elliptical orbit
const ORBIT_TRACKS = [
  generateOrbitKeyframes(0),
  generateOrbitKeyframes(120),
  generateOrbitKeyframes(240),
];

function HeroOrbitShowcase() {
  return (
    <div className="relative w-full max-w-sm h-72 sm:h-80 flex items-center justify-center">
      {/* Ambient glowing radial bloom */}
      <div
        aria-hidden
        className="w-72 h-72 rounded-full bg-violet-400/25 blur-3xl pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      />
      <div
        aria-hidden
        className="w-52 h-52 rounded-full bg-amber-400/20 blur-2xl pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      />

      {/* 2D Flat Orbiting Cards (Solid 100% opaque, no bleed-through, dynamic z-index) */}
      <div className="relative w-full h-full flex items-center justify-center">
        {ORBIT_CARDS.map((card, index) => {
          const track = ORBIT_TRACKS[index];

          return (
            <motion.div
              key={card.id}
              animate={{
                x: track.x,
                y: track.y,
                scale: track.scale,
                zIndex: track.zIndex,
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-72 sm:w-80 bg-white border-2 border-stone-900 rounded-2xl p-5 select-none shadow-[5px_5px_0px_0px_#1c1917] flex flex-col justify-between pointer-events-auto"
              style={{
                backgroundColor: "#ffffff",
                opacity: 1,
                willChange: "transform",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      card.pillClass,
                    )}
                  >
                    {card.pill}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    {card.xp}
                  </span>
                </div>

                <h4 className="font-black text-stone-900 text-lg leading-tight mb-2">
                  {card.title}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {card.text}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                  {card.tag}
                </span>
                <span className="text-[10px] font-bold text-stone-400">
                  CSRecall Arena
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 3D Flip Card Feature with Particle FX ────────────────────────────────────

interface FeatureFlipCardProps {
  icon: any;
  accent: string;
  badge: string;
  value: string;
  unit: string;
  title: string;
  detail: string;
  backTitle: string;
  backDetail: string;
  backTag: string;
  confettiColors: string[];
  cardTint?: string;
  glowShadow?: string;
}

function FeatureFlipCard({
  icon: Icon,
  accent,
  badge,
  value,
  unit,
  title,
  detail,
  backTitle,
  backDetail,
  backTag,
  confettiColors,
  cardTint = "from-white to-white",
  glowShadow = "hover:shadow-[6px_6px_0px_0px_#1c1917]",
}: FeatureFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 25,
        spread: 50,
        ticks: 150,
        origin: { x, y },
        colors: confettiColors,
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    });

    setFlipped((f) => !f);
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
      className="relative cursor-pointer min-h-[170px] select-none group"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.48, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        {/* ── Front Face ── */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={cn(
            "w-full h-full p-4 sm:p-5 rounded-2xl bg-gradient-to-b border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden relative",
            cardTint,
            glowShadow,
          )}
        >
          {/* Colored top accent line */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1.5",
              accent.includes("violet") && "bg-violet-500",
              accent.includes("emerald") && "bg-emerald-500",
              accent.includes("rose") && "bg-rose-500",
              accent.includes("amber") && "bg-amber-500",
            )}
          />

          <div className="flex items-center justify-between mb-2.5 pt-1">
            <div
              className={cn(
                "w-9 h-9 rounded-xl border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]",
                accent,
              )}
            >
              <Icon className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-300">
              {badge}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {value}
              </span>
              <span className="text-xs font-black text-stone-700 uppercase tracking-wide">
                {unit}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-900 mt-1 line-clamp-1">
              {title}
            </p>
            <p className="text-[11px] text-stone-600 font-medium mt-0.5 line-clamp-2 leading-relaxed">
              {detail}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-bold text-stone-400 group-hover:text-violet-600 transition-colors">
            <span>Details & Payoff</span>
            <span className="inline-flex items-center gap-1">
              Flip <RotateCw className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>

        {/* ── Back Face (Clean Off-White) ── */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 w-full h-full p-4 sm:p-5 rounded-2xl bg-stone-50 text-stone-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-stone-900 line-clamp-1">
                {backTitle}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-800 bg-violet-100 px-1.5 py-0.5 rounded border border-violet-300">
                {backTag}
              </span>
            </div>
            <p className="text-[11px] text-stone-700 font-medium leading-relaxed">
              {backDetail}
            </p>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-bold text-violet-700">
            <span>✨ Interactive Feature</span>
            <span className="inline-flex items-center gap-1 text-stone-500">
              Flip back <RotateCw className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Bento Stat Grid Data with Flip Payoffs ───────────────────────────────────

const STAT_ITEMS = [
  {
    icon: BookOpen,
    accent: "bg-violet-100 text-violet-700 border-violet-300",
    badge: "12 Chapters",
    value: "12",
    unit: "Chapters",
    title: "12 Chapters",
    detail: "Everything you need for CS interviews, simplified.",
    backTitle: "Structured Step-by-Step",
    backDetail:
      "Covers OOP, Data Structures, System Design, and Web fundamentals without 500-page textbooks.",
    backTag: "Roadmap",
    confettiColors: ["#7c3aed", "#a78bfa", "#c4b5fd"],
    cardTint: "from-[#FAF8FF] to-white",
    glowShadow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(124,58,237,0.18)]",
  },
  {
    icon: Layers,
    accent: "bg-emerald-100 text-emerald-700 border-emerald-300",
    badge: "200+ Cards",
    value: "200+",
    unit: "Cards",
    title: "200+ Flashcards",
    detail: "Quick spaced-repetition cards to build recall.",
    backTitle: "Fast Review Sessions",
    backDetail:
      "Flip cards using Spacebar, tap 1 for Hard, or tap 2 for Nailed to lock key terms in memory.",
    backTag: "Recall",
    confettiColors: ["#10b981", "#6ee7b7", "#a7f3d0"],
    cardTint: "from-[#F0FDF8] to-white",
    glowShadow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(16,185,129,0.18)]",
  },
  {
    icon: ShieldAlert,
    accent: "bg-rose-100 text-rose-700 border-rose-300",
    badge: "60+ Traps",
    value: "60+",
    unit: "Traps",
    title: "60+ Interview Traps",
    detail: "Learn the trick questions interviewers love to ask.",
    backTitle: "Never Get Caught Off Guard",
    backDetail:
      "Spot edge cases, syntax surprises, and common gotchas before you enter your interview.",
    backTag: "Defense",
    confettiColors: ["#f43f5e", "#fb7185", "#fecdd3"],
    cardTint: "from-[#FFF5F6] to-white",
    glowShadow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(244,63,94,0.18)]",
  },
  {
    icon: Zap,
    accent: "bg-amber-100 text-amber-800 border-amber-300",
    badge: "5-Min Sprint",
    value: "5 Min",
    unit: "Sprint",
    title: "5-Minute Sprint",
    detail: "Short, high-impact practice rounds.",
    backTitle: "Quick Daily Warm-Up",
    backDetail:
      "Run through 5 rapid interview questions to keep your CS knowledge sharp between rounds.",
    backTag: "Warmup",
    confettiColors: ["#f59e0b", "#fbbf24", "#fde68a"],
    cardTint: "from-[#FFFDF2] to-white",
    glowShadow:
      "hover:shadow-[6px_6px_0px_0px_#1c1917,0_0_24px_rgba(245,158,11,0.18)]",
  },
];

// ─── MovingBorder "Start Quest" Button (Aceternity UI style) ───────────────────

function MovingBorderButton() {
  return (
    <Link
      href="/chapter/chapter-1"
      className="relative group inline-flex rounded-xl p-[2px] overflow-hidden shadow-[4px_4px_0px_0px_#1c1917] hover:shadow-[5px_5px_0px_0px_#1c1917] transition-all cursor-pointer"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,#7c3aed_0deg,#f59e0b_180deg,#7c3aed_360deg)] opacity-85 group-hover:opacity-100"
      />
      <div className="relative z-10 w-full bg-violet-600 hover:bg-violet-700 transition-colors text-white font-bold text-base sm:text-lg px-6 sm:px-7 py-3 sm:py-3.5 rounded-[10px] flex items-center justify-center gap-2.5">
        <span>Start Quest</span>
        <ArrowRight
          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      </div>
    </Link>
  );
}

// ─── Hero Section Component ───────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9FE] via-[#F8F7FC] to-[#F5F3FF]/40 border-b-2 border-stone-900">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="w-[520px] h-[520px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none absolute -top-28 -left-24"
      />
      <div
        aria-hidden
        className="w-[420px] h-[420px] rounded-full bg-sky-400/12 blur-[90px] pointer-events-none absolute top-10 -right-20"
      />
      <div
        aria-hidden
        className="w-80 h-80 rounded-full bg-amber-400/10 blur-[80px] pointer-events-none absolute bottom-6 left-1/3"
      />

      {/* Dot-grid background decoration */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1c1917 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-8 sm:pt-12">
        {/* ── Row 1: Headline + Aceternity Continuous CardStack ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10 sm:mb-12">
          {/* Left: text + CTAs */}
          <div>
            {/* Arena badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border-2 border-violet-300 bg-violet-100 text-violet-800 text-xs font-black uppercase tracking-widest shadow-[1px_1px_0px_0px_#4c1d95]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Zap className="w-3.5 h-3.5 fill-violet-600" />
              Programming Training Arena
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-4 text-stone-900">
              Clear{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 underline decoration-wavy decoration-amber-400">
                Your
              </span>{" "}
              Tech Interview
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-base sm:text-lg text-stone-600 font-medium max-w-md mb-7 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Simple, short notes, quick flashcards, and tricky interview traps.
              Revise OOP, memory, and coding basics in minutes without reading
              long books.
            </motion.p>

            {/* CTAs with Aceternity MovingBorder */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MovingBorderButton />
              <Link href="/sprint">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto cursor-pointer"
                >
                  <Zap className="w-5 h-5" strokeWidth={2.5} />
                  5-Min Sprint
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: 2D Revolving Orbit Showcase */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <HeroOrbitShowcase />
          </motion.div>
        </div>

        {/* ── Row 2: 3D Flip Feature Cards with Particle FX ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-8 sm:pb-10">
          {STAT_ITEMS.map((item) => (
            <FeatureFlipCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
