"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Target, Trophy, Sparkles } from "lucide-react";
import type { Chapter } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { useHydration } from "@/hooks/useHydration";
import { isTopicCompleted, getLearnableTopics } from "@/lib/topicUtils";

// ─── Title Case Helper ────────────────────────────────────────────────────────

function toTitleCase(title: string): string {
  const ACRONYMS = new Set([
    "OOP",
    "OS",
    "SQL",
    "CPU",
    "RAM",
    "CAP",
    "I/O",
    "API",
    "REST",
    "HTTP",
    "TCP",
    "IP",
    "DNS",
    "ACID",
    "JVM",
  ]);
  return title
    .split(" ")
    .map((word) => {
      if (!word) return "";
      const cleanWord = word.replace(/[^a-zA-Z0-9/]/g, "").toUpperCase();
      if (ACRONYMS.has(cleanWord)) {
        return word.replace(cleanWord, cleanWord);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

interface NextMoveWidgetProps {
  chapters?: Chapter[];
}

export function NextMoveWidget({ chapters = [] }: NextMoveWidgetProps) {
  const hydrated = useHydration();
  const { status } = useSession();
  const completedChapterIds = useGameStore((s) => s.completedChapterIds);
  const completedTopics = useGameStore((s) => s.completedTopics);

  if (!hydrated) return null;

  const isAuthenticated = status === "authenticated";

  // Calculate progress for each chapter
  const chapterProgressList = chapters.map((chapter) => {
    const isCompleted = completedChapterIds.includes(chapter.id);
    const learnableTopics = getLearnableTopics(chapter);
    const totalTopics = learnableTopics.length;
    const finishedTopics = learnableTopics.filter((t) =>
      isTopicCompleted(completedTopics, chapter.id, t.id),
    ).length;

    const progress = isCompleted
      ? 100
      : totalTopics > 0
        ? Math.round((finishedTopics / totalTopics) * 100)
        : 0;

    return {
      chapter,
      progress,
      isCompleted,
    };
  });

  // ─── Condition Hierarchy & Dynamic Evaluation Logic ─────────────────────────

  // Priority 1: Resume In-Progress Chapter (progress > 0% and < 100%)
  const inProgressChapters = chapterProgressList.filter(
    (c) => c.progress > 0 && c.progress < 100,
  );
  const highestInProgress =
    inProgressChapters.length > 0
      ? inProgressChapters.sort((a, b) => b.progress - a.progress)[0]
      : null;

  // Priority 3: Arena Mastered (All chapters at 100%)
  const allMastered =
    chapters.length > 0 &&
    chapterProgressList.every((c) => c.isCompleted || c.progress === 100);

  // Priority 2: Next Unlocked Chapter (First chapter with 0% progress)
  const nextUnlocked =
    chapterProgressList.find((c) => !c.isCompleted && c.progress === 0) || null;

  let missionData: {
    icon: typeof Zap;
    iconBg: string;
    iconColor: string;
    pillText: string;
    pillBg: string;
    rewardText: string;
    headline: string;
    subtitle: string;
    buttonText: string;
    href: string;
  };

  if (highestInProgress) {
    // Priority 1: Resume In-Progress Chapter
    const ch = highestInProgress.chapter;
    const formattedTitle = toTitleCase(ch.title);
    missionData = {
      icon: Zap,
      iconBg: "bg-yellow-300",
      iconColor: "text-black",
      pillText: "⚡ চলমান মিশন (ACTIVE)",
      pillBg: "bg-yellow-300 text-black",
      rewardText: "পুরস্কার: +100 XP",
      headline: `Chapter ${ch.chapterNumber}: ${formattedTitle} সম্পন্ন করুন (${highestInProgress.progress}% সম্পন্ন)`,
      subtitle: `চ্যাপ্টার ${ch.chapterNumber}-এ ফিরে গিয়ে বাকি টপিকগুলো শেষ করুন এবং ব্যাজ ও XP আনলক করুন!`,
      buttonText: "সম্পন্ন করুন →",
      href: `/chapter/${ch.id}?mode=learn`,
    };
  } else if (isAuthenticated && allMastered) {
    // Priority 3: Arena Mastered (Authenticated user with all 12 chapters 100%)
    missionData = {
      icon: Trophy,
      iconBg: "bg-amber-300",
      iconColor: "text-black",
      pillText: "🏆 এরিনা মাস্টার (ARENA MASTER)",
      pillBg: "bg-amber-300 text-black",
      rewardText: "পুরস্কার: +100 XP",
      headline: "সবগুলো কোয়েস্ট লেভেল সম্পন্ন হয়েছে!",
      subtitle:
        "অভিনন্দন! আপনি সবগুলো মডিউল শেষ করেছেন। রিকল ধারালো রাখতে ফ্ল্যাশকার্ড দিয়ে প্র্যাকটিস চালিয়ে যান।",
      buttonText: "প্র্যাকটিস শুরু করুন →",
      href: `/chapter/chapter-1?mode=practice`,
    };
  } else if (isAuthenticated && nextUnlocked) {
    // Priority 2: Next Unlocked Chapter (Authenticated user starting next chapter)
    const ch = nextUnlocked.chapter;
    const formattedTitle = toTitleCase(ch.title);
    missionData = {
      icon: Target,
      iconBg: "bg-sky-300",
      iconColor: "text-black",
      pillText: "🎯 পরবর্তী টার্গেট (NEXT)",
      pillBg: "bg-sky-300 text-black",
      rewardText: "পুরস্কার: +100 XP",
      headline: `Chapter ${ch.chapterNumber}: ${formattedTitle} শুরু করুন`,
      subtitle:
        "পরবর্তী এরিনাতে প্রবেশ করে কোর কনসেপ্ট ও ইন্টারভিউ ট্র্যাপের মুখোমুখি হোন।",
      buttonText: "চ্যাপ্টার শুরু করুন →",
      href: `/chapter/${ch.id}?mode=learn`,
    };
  } else {
    // Priority 4: Unauthenticated Guest Fallback (or Guest starting out)
    const ch1 = chapters.find((c) => c.chapterNumber === 1);
    const ch1Title = ch1
      ? toTitleCase(ch1.title)
      : "Programming Concepts & OOP";
    missionData = {
      icon: Sparkles,
      iconBg: "bg-emerald-300",
      iconColor: "text-black",
      pillText: "👋 স্বাগতম (WELCOME RECRUIT)",
      pillBg: "bg-emerald-300 text-black",
      rewardText: "পুরস্কার: +100 XP",
      headline: `Chapter 1: ${ch1Title} দিয়ে শুরু করুন`,
      subtitle:
        "ফ্রি চ্যাপ্টার দিয়ে প্রস্তুতি নিন অথবা সম্পূর্ণ প্রগ্রেস সেভ ও ফ্ল্যাশকার্ড ডেক আনলক করতে সাইন ইন করুন।",
      buttonText: "শুরু করুন →",
      href: `/chapter/${ch1?.id || "chapter-1"}?mode=learn`,
    };
  }

  const IconComponent = missionData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] p-3.5 sm:p-5 md:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Mission Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-black ${missionData.iconBg} flex items-center justify-center shadow-[2px_2px_0px_0px_#000]`}
        >
          <IconComponent
            className={`w-5 h-5 sm:w-6 sm:h-6 ${missionData.iconColor}`}
            strokeWidth={2.5}
          />
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000] ${missionData.pillBg}`}
            >
              {missionData.pillText}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-200 text-black px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
              {missionData.rewardText}
            </span>
          </div>

          <h3 className="font-black text-black text-sm sm:text-base md:text-xl tracking-tight leading-snug">
            {missionData.headline}
          </h3>

          <p className="text-xs sm:text-sm md:text-base font-medium text-stone-700 max-w-xl leading-relaxed">
            {missionData.subtitle}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex-shrink-0 md:self-center mt-2 md:mt-0 w-full md:w-auto">
        <Link href={missionData.href} className="w-full md:w-auto block">
          <Button
            variant="primary"
            size="md"
            className="w-full md:w-auto font-black shadow-[3px_3px_0px_0px_#000] border-2 border-black hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform flex items-center gap-2 justify-center py-2.5 sm:py-3 text-xs sm:text-sm md:text-base"
          >
            <span>{missionData.buttonText}</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
