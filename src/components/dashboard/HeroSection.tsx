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

// ─── 2D Elliptical Revolving Orbit Showcase ──────────────────────────────────

interface OrbitCard {
  id: string;
  pill: string;
  pillClass: string;
  xp: string;
  xpClass: string;
  title: string;
  text: string;
  tag: string;
}

const ORBIT_CARDS: OrbitCard[] = [
  {
    id: "card-trap",
    pill: "⚠️ INTERVIEW TRAP",
    pillClass: "bg-rose-300 text-black border-2 border-black font-black",
    xp: "+30 XP",
    xpClass: "bg-yellow-300 text-black border-2 border-black",
    title: "The const Myth",
    text: "Does const user = {} make the object immutable? No! It only prevents reassigning the variable.",
    tag: "#JavaScript",
  },
  {
    id: "card-arch",
    pill: "🧠 ARCHITECTURE",
    pillClass: "bg-sky-300 text-black border-2 border-black font-black",
    xp: "+20 XP",
    xpClass: "bg-yellow-300 text-black border-2 border-black",
    title: "Stack vs Heap",
    text: "Stack stores quick function frames and primitives. Heap handles dynamic, long-lived objects.",
    tag: "#OperatingSystems",
  },
  {
    id: "card-speed",
    pill: "⚡ QUICK FIRE",
    pillClass: "bg-emerald-300 text-black border-2 border-black font-black",
    xp: "+15 XP",
    xpClass: "bg-yellow-300 text-black border-2 border-black",
    title: "TCP vs UDP",
    text: "TCP guarantees every packet arrives in order. UDP sends fast without checking—perfect for video calls.",
    tag: "#Networks",
  },
];

// Generates smooth parametric 2D elliptical keyframes around a center point
function generateOrbitKeyframes(startAngleDeg: number) {
  const points = 36;
  const A = 205; // horizontal radius in pixels (spread out cards)
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
      {/* Halftone comic glow behind orbit */}
      <div
        aria-hidden
        className="w-72 h-72 rounded-full bg-yellow-400/20 blur-2xl pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      />
      <div
        aria-hidden
        className="w-60 h-60 rounded-full bg-rose-500/20 blur-3xl pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
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
              className="absolute w-72 sm:w-80 bg-[#fffdfa] border-[3px] border-black rounded-2xl p-5 select-none shadow-[5px_5px_0px_#000] flex flex-col justify-between pointer-events-auto"
              style={{
                backgroundColor: "#fffdfa",
                opacity: 1,
                willChange: "transform",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_0px_#000]",
                      card.pillClass,
                    )}
                  >
                    {card.pill}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-black px-2.5 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]",
                      card.xpClass,
                    )}
                  >
                    {card.xp}
                  </span>
                </div>

                <h4 className="font-black text-black text-lg leading-tight mb-2">
                  {card.title}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-bold">
                  {card.text}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-[11px] font-mono font-black text-black bg-yellow-300 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                  {card.tag}
                </span>
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
                  CSRecall Arcade
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 3D Flip Card Feature with Multi-Colored Arcade Confetti ─────────────────

interface FeatureFlipCardProps {
  icon: any;
  accent: string;
  badge: string;
  badgeClass: string;
  value: string;
  unit: string;
  title: string;
  detail: string;
  backTitle: string;
  backDetail: string;
  backTag: string;
  confettiColors: string[];
  cardBg: string;
  topAccent: string;
}

function FeatureFlipCard({
  icon: Icon,
  accent,
  badge,
  badgeClass,
  value,
  unit,
  title,
  detail,
  backTitle,
  backDetail,
  backTag,
  confettiColors,
  cardBg,
  topAccent,
}: FeatureFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 35,
        spread: 60,
        ticks: 150,
        origin: { x, y },
        colors: confettiColors,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
    });

    setFlipped((f) => !f);
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      onClick={handleFlip}
      className="relative cursor-pointer min-h-[175px] select-none group"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        {/* ── Front Face (Solid Opaque Cream/Ivory) ── */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className={cn(
            "w-full h-full p-4 sm:p-5 rounded-2xl border-[3px] border-black shadow-[5px_5px_0px_0px_#000] hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden relative",
            cardBg,
          )}
        >
          {/* Top colored accent line */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-2 border-b-2 border-black",
              topAccent,
            )}
          />

          <div className="flex items-center justify-between mb-2.5 pt-1">
            <div
              className={cn(
                "w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]",
                accent,
              )}
            >
              <Icon className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border-2 border-black shadow-[1px_1px_0px_0px_#000]",
                badgeClass,
              )}
            >
              {badge}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                {value}
              </span>
              <span className="text-xs font-black text-stone-800 uppercase tracking-wide">
                {unit}
              </span>
            </div>
            <p className="text-xs font-black text-black mt-1 line-clamp-1">
              {title}
            </p>
            <p className="text-[11px] text-stone-700 font-bold mt-0.5 line-clamp-2 leading-relaxed">
              {detail}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t-2 border-black/20 flex items-center justify-between text-[10px] font-black text-black">
            <span>Payoff &amp; Tips</span>
            <span className="inline-flex items-center gap-1 text-rose-600 font-black">
              Flip <RotateCw className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* ── Back Face (Solid Comic Ivory) ── */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 w-full h-full p-4 sm:p-5 rounded-2xl bg-white text-black border-[3px] border-black shadow-[5px_5px_0px_0px_#000] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-black line-clamp-1">
                {backTitle}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-black bg-yellow-300 px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                {backTag}
              </span>
            </div>
            <p className="text-[11px] text-stone-800 font-bold leading-relaxed">
              {backDetail}
            </p>
          </div>

          <div className="pt-2 border-t-2 border-black/20 flex items-center justify-between text-[10px] font-black text-black">
            <span className="text-rose-600">⚡ Arcade Card</span>
            <span className="inline-flex items-center gap-1 text-stone-600 font-bold">
              Flip back <RotateCw className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── 4 Feature Cards with Distinct Multi-Colored Comic Palettes ───────────────

const STAT_ITEMS: FeatureFlipCardProps[] = [
  {
    icon: BookOpen,
    accent: "bg-emerald-300",
    badge: "12 Modules",
    badgeClass: "bg-emerald-400 text-black",
    value: "12",
    unit: "Chapters",
    title: "12 Chapters",
    detail: "Everything you need for CS interviews, simplified.",
    backTitle: "Structured Step-by-Step",
    backDetail:
      "Covers OOP, Data Structures, System Design, and Web fundamentals without 500-page textbooks.",
    backTag: "Roadmap",
    confettiColors: ["#10b981", "#34d399", "#6ee7b7", "#059669"], // Lime / mint burst
    cardBg: "bg-[#fffbf0]",
    topAccent: "bg-emerald-400",
  },
  {
    icon: Layers,
    accent: "bg-amber-300",
    badge: "200+ Decks",
    badgeClass: "bg-amber-400 text-black",
    value: "200+",
    unit: "Cards",
    title: "200+ Flashcards",
    detail: "Quick spaced-repetition cards to build recall.",
    backTitle: "Fast Review Sessions",
    backDetail:
      "Tap to flip through rapid-fire CS concept decks and lock core definitions into memory.",
    backTag: "Recall",
    confettiColors: ["#f59e0b", "#fbbf24", "#fde047", "#d97706"], // Solar gold burst
    cardBg: "bg-[#fffbf0]",
    topAccent: "bg-amber-400",
  },
  {
    icon: ShieldAlert,
    accent: "bg-rose-300",
    badge: "200+ Traps",
    badgeClass: "bg-rose-400 text-black",
    value: "200+",
    unit: "Traps",
    title: "60+ Interview Traps",
    detail: "Learn the trick questions interviewers love to ask.",
    backTitle: "Never Get Caught Off Guard",
    backDetail:
      "Spot edge cases, syntax surprises, and common gotchas before you enter your interview.",
    backTag: "Defense",
    confettiColors: ["#f43f5e", "#fb7185", "#fda4af", "#e11d48"], // Hot coral burst
    cardBg: "bg-[#fffbf0]",
    topAccent: "bg-rose-400",
  },
  {
    icon: Zap,
    accent: "bg-sky-300",
    badge: "5-Min Sprint",
    badgeClass: "bg-sky-400 text-black",
    value: "5 Min",
    unit: "Sprint",
    title: "5-Minute Sprint",
    detail: "Short, high-impact practice rounds.",
    backTitle: "Quick Daily Warm-Up",
    backDetail:
      "Run through 5 rapid interview questions to keep your CS knowledge sharp between rounds.",
    backTag: "Warmup",
    confettiColors: ["#0284c7", "#38bdf8", "#7dd3fc", "#0369a1"], // Sky blue burst
    cardBg: "bg-[#fffbf0]",
    topAccent: "bg-sky-400",
  },
];

// ─── Hero Section Component ───────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-6 sm:pt-10">
        {/* ── Row 1: Headline + 2D Revolving Orbit Showcase ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10 sm:mb-12">
          {/* Left: text + CTAs */}
          <div>
            {/* Arena badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full border-2 border-black bg-yellow-300 text-black text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              INTERVIEW REVISION ARENA
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-4 text-white drop-shadow-[3px_3px_0px_#000]">
              CRACK THE CODE.{" "}
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-300 text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-xl rotate-[-1deg]">
                LEVEL UP YOUR MEMORY
              </span>
            </h1>

            {/* Subtitle */}
            <motion.div
              className="bg-black/35 border-2 border-black/60 rounded-xl p-3.5 text-stone-100 font-medium leading-relaxed max-w-md mb-7 backdrop-blur-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-sm sm:text-base leading-relaxed text-stone-100 font-medium">
                Simple, short notes, quick flashcards, and tricky interview
                traps. Revise OOP, memory, and coding basics in minutes without
                reading long books.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link href="/chapter/chapter-1">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto cursor-pointer"
                >
                  Start Quest
                  <ArrowRight className="w-5 h-5 ml-1" strokeWidth={3} />
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

        {/* ── Row 2: 3D Flip Feature Cards with Distinct Comic Colorways ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-6">
          {STAT_ITEMS.map((item) => (
            <FeatureFlipCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
