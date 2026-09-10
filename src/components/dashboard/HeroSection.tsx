"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Layers,
  ShieldAlert,
  ChevronDown,
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
    xp: "+15 XP",
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
              className="absolute w-72 sm:w-80 bg-[#fffdf7] border-[3px] border-black rounded-2xl p-5 select-none shadow-[5px_5px_0px_#000] flex flex-col justify-between pointer-events-auto"
              style={{
                backgroundColor: "#fffdf7",
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
  icon: React.ElementType;
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
      className="relative cursor-pointer min-h-[148px] sm:min-h-[155px] select-none group"
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
            "w-full h-full p-3.5 sm:p-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden relative",
            cardBg,
          )}
        >
          {/* Top colored accent line */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1.5 border-b-2 border-black",
              topAccent,
            )}
          />

          <div className="flex items-center justify-between mb-1.5 pt-0.5">
            <div
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]",
                accent,
              )}
            >
              <Icon
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black"
                strokeWidth={2.5}
              />
            </div>
            <span
              className={cn(
                "text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_0px_#000]",
                badgeClass,
              )}
            >
              {badge}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-black tracking-tight">
                {value}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-stone-800 uppercase tracking-wide">
                {unit}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-black text-black mt-0.5 line-clamp-1">
              {title}
            </p>
            <p className="text-[11px] sm:text-xs text-stone-800 font-medium mt-0.5 line-clamp-2 leading-snug">
              {detail}
            </p>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-black/20 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-black">
            <span>Payoff &amp; Tips</span>
            <span className="inline-flex items-center gap-1 text-rose-600 font-black text-[11px]">
              ফ্লিপ করুন ⟳
            </span>
          </div>
        </div>

        {/* ── Back Face (Solid Comic Ivory) ── */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 w-full h-full p-3.5 sm:p-4 rounded-xl bg-[#fffdf7] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-black text-black line-clamp-1">
                {backTitle}
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black bg-yellow-300 px-1.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                {backTag}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-800 font-medium leading-snug">
              {backDetail}
            </p>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-black/20 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-black">
            <span className="text-rose-600">⚡ Arcade Card</span>
            <span className="inline-flex items-center gap-1 text-stone-600 font-bold text-[11px]">
              ফ্লিপ ব্যাক ⟳
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
    title: "12 CHAPTERS",
    detail: "১২টি চ্যাপ্টারের সহজ ও পয়েন্ট-টু-পয়েন্ট নোট",
    backTitle: "গোছানো রোডম্যাপ",
    backDetail:
      "৫০০ পৃষ্ঠার বই না পড়েই শিখুন OOP, Data Structures আর Web-এর মূল বিষয়গুলো সংক্ষেপে।",
    backTag: "Roadmap",
    confettiColors: ["#10b981", "#34d399", "#6ee7b7", "#059669"], // Lime / mint burst
    cardBg: "bg-[#fffdf7]",
    topAccent: "bg-emerald-400",
  },
  {
    icon: Layers,
    accent: "bg-amber-300",
    badge: "200+ Decks",
    badgeClass: "bg-amber-400 text-black",
    value: "200+",
    unit: "Cards",
    title: "200+ CARDS",
    detail: "কোর কনসেপ্ট সহজে মনে রাখার মেমোরি কার্ড",
    backTitle: "দ্রুত রিভিশন সেশন",
    backDetail:
      "কার্ডে ট্যাপ করে উল্টান আর ঝটপট রিভাইজ দিয়ে নিন দরকারি কনসেপ্ট ও ডেফিনিশনগুলো।",
    backTag: "Recall",
    confettiColors: ["#f59e0b", "#fbbf24", "#fde047", "#d97706"], // Solar gold burst
    cardBg: "bg-[#fffdf7]",
    topAccent: "bg-amber-400",
  },
  {
    icon: ShieldAlert,
    accent: "bg-rose-300",
    badge: "60+ Traps",
    badgeClass: "bg-rose-400 text-black",
    value: "200+",
    unit: "Traps",
    title: "200+ TRAPS",
    detail: "ইন্টারভিউতে আসা কঠিন ও ট্রিকি প্রশ্নগুলোর সমাধান",
    backTitle: "ইন্টারভিউ ফাঁদ ও ট্রিকস",
    backDetail:
      "ইন্টারভিউতে যাওয়ার আগেই জেনে নিন ট্রিকি প্রশ্ন, সাধারণ ভুল আর লুকানো সব কনসেপচুয়াল ফাঁদ।",
    backTag: "Defense",
    confettiColors: ["#f43f5e", "#fb7185", "#fda4af", "#e11d48"], // Hot coral burst
    cardBg: "bg-[#fffdf7]",
    topAccent: "bg-rose-400",
  },
  {
    icon: Zap,
    accent: "bg-sky-300",
    badge: "Arcade XP",
    badgeClass: "bg-sky-400 text-black",
    value: "Level Up",
    unit: "XP",
    title: "LEVEL UP XP",
    detail: "টপিক কমপ্লিট করে পয়েন্ট বাড়ান ও র্যাঙ্ক আপ করুন",
    backTitle: "র্যাঙ্ক ও লেভেল আপ",
    backDetail:
      "টপিক শেষ করে নিন +10 XP এবং সম্পূর্ণ চ্যাপ্টার ক্লিয়ার করে +100 XP নিয়ে লেভেল আপ করুন।",
    backTag: "Rank",
    confettiColors: ["#0284c7", "#38bdf8", "#7dd3fc", "#0369a1"],
    cardBg: "bg-[#fffdf7]",
    topAccent: "bg-sky-400",
  },
];

// ─── Hero Section Component ───────────────────────────────────────────────────

export function HeroSection() {
  const handleScrollToQuestMap = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("quest-map");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-2 pb-4 sm:pt-3 sm:pb-6">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-1 sm:pt-2">
        {/* ── Row 1: Headline + 2D Revolving Orbit Showcase ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center mb-3 sm:mb-4">
          {/* Left: text + CTAs */}
          <div>
            {/* Arena badge */}
            <motion.div
              className="inline-flex items-center gap-1.5 mb-1.5 px-3 py-0.5 rounded-full border-2 border-black bg-yellow-300 text-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] rotate-[-1deg]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              CS INTERVIEW PLAYGROUND
            </motion.div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-[3px_3px_0px_#000]">
              CRACK THE INTERVIEW{" "}
              <span className="inline-block mt-1 mb-2 px-3 py-1 bg-yellow-300 text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-xl rotate-[-1deg]">
                LEVEL UP YOUR MEMORY
              </span>
            </h1>

            {/* Subtitle */}
            <motion.div
              className="bg-black/35 border-2 border-black/60 rounded-xl p-2.5 sm:p-3 text-stone-100 font-medium max-w-lg mt-2.5 mb-3.5 backdrop-blur-xs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-base md:text-lg font-semibold text-stone-100 leading-relaxed">
                বই না পড়ে কয়েক মিনিটেই রিভাইজ করুন OOP, মেমোরি আর কোডিংয়ের কোর
                কনসেপ্ট। সাথে থাকছে দ্রুত পড়ার ফ্ল্যাশকার্ড এবং ট্রিকি ইন্টারভিউ
                ট্র্যাপস।
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <a
                href="#quest-map"
                onClick={handleScrollToQuestMap}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto py-2.5 px-5 text-sm sm:text-base font-black cursor-pointer shadow-[3px_3px_0px_0px_#000]"
                >
                  Start Quest
                  <ArrowRight className="w-5 h-5 ml-1" strokeWidth={3} />
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right: 2D Revolving Orbit Showcase */}
          <motion.div
            className="hidden lg:flex justify-center scale-90 md:scale-95 origin-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <HeroOrbitShowcase />
          </motion.div>
        </div>

        {/* ── Row 2: 3D Flip Feature Cards with Distinct Comic Colorways ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-2 sm:mt-3">
          {STAT_ITEMS.map((item) => (
            <FeatureFlipCard key={item.title} {...item} />
          ))}
        </div>

        {/* ── Bouncing Arcade Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-3 sm:mt-4 flex justify-center pb-2"
        >
          <a
            href="#quest-map"
            onClick={handleScrollToQuestMap}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer select-none"
            aria-label="Scroll to Quest Map"
          >
            <span>⚡ EXPLORE QUEST MAP</span>
            <span className="text-stone-900 font-bold">• চ্যাপ্টার ম্যাপ</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="inline-flex"
            >
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
