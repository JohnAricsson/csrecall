"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check, Lightbulb } from "lucide-react";
import type {
  Chapter,
  Topic,
  CodeSnippet,
  ComparisonTable,
} from "@/lib/schema";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet.code]);

  return (
    <div className="rounded-xl border-2 border-stone-900 overflow-hidden shadow-[3px_3px_0px_0px_#1c1917]">
      {/* Header bar with developer terminal chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          {/* Mac-style traffic light dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <Badge variant="violet" className="text-[10px] py-0 px-2 font-mono">
            {snippet.language.toUpperCase()}
          </Badge>
        </div>

        {snippet.explanation && (
          <span className="text-stone-400 text-xs font-medium truncate max-w-[50%] hidden sm:inline">
            {snippet.explanation}
          </span>
        )}

        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
            "border border-stone-700",
            copied
              ? "bg-emerald-600 text-white border-emerald-500"
              : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white",
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" strokeWidth={2.5} />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" strokeWidth={2.5} />
              Copy ⚡
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="bg-[#0d1117] text-emerald-400 text-xs sm:text-sm font-mono p-4 sm:p-5 overflow-x-auto leading-relaxed">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

// ─── Bangla TL;DR callout ─────────────────────────────────────────────────────

function BanglaTldr({ text }: { text: string }) {
  return (
    <div className="flex gap-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/60 to-amber-50 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#78350f]">
      <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-stone-900 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000] flex-shrink-0 text-lg">
        💡
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase tracking-widest text-amber-800 mb-1 flex items-center gap-1.5">
          <span>🇧🇩</span>
          <span>সহজ কথায় (TL;DR):</span>
        </p>
        <p className="text-stone-900 font-bold text-sm sm:text-base leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function ComparisonTableBlock({ table }: { table: ComparisonTable }) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] bg-white">
      <table className="w-full text-sm min-w-max border-collapse">
        <caption className="text-left px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-sm border-b-2 border-stone-900">
          ⚡ {table.title}
        </caption>
        <thead>
          <tr className="bg-stone-900 text-white">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-5 py-3 text-left font-black text-xs uppercase tracking-wider whitespace-nowrap border-r border-stone-800 last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr
              key={ri}
              className={cn(
                "transition-colors hover:bg-violet-50/50",
                ri % 2 === 0 ? "bg-white" : "bg-stone-50/80",
              )}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-5 py-3 text-stone-800 font-medium border-t border-stone-200 border-r border-stone-200 last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Q&A Reveal Item ─────────────────────────────────────────────────────────

function QAItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_#1c1917] bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-white hover:bg-stone-50 transition-colors text-left cursor-pointer"
      >
        <span className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
          ❓ {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-stone-600" strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-emerald-50/80 border-t-2 border-stone-900">
              <p className="text-sm sm:text-base text-stone-800 font-semibold leading-relaxed">
                ✅ {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useGameStore } from "@/stores/gameStore";
import { CheckCircle2 } from "lucide-react";

// ─── Topic Card ────────────────────────────────────────────────────────────────

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  const { completedTopics, completeTopic } = useGameStore();
  const isCompleted = completedTopics.includes(topic.id);

  return (
    <div className="p-0">
      <Card className="p-6 sm:p-7 space-y-6 relative overflow-hidden border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917]">
        {/* Top colored accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600" />

        {/* Topic header */}
        <div className="flex items-start gap-3.5 pt-1">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-600 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
            <span className="text-white text-xs font-black">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-stone-900 text-xl md:text-2xl leading-tight pr-4">
              {topic.title}
            </h3>
            {topic.explanation && (
              <p className="text-stone-800 text-base md:text-lg mt-2 leading-relaxed whitespace-pre-line font-normal">
                {topic.explanation}
              </p>
            )}
          </div>
          {isCompleted && (
            <div className="flex-shrink-0 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border-2 border-emerald-400 text-xs font-black flex items-center gap-1 shadow-[1px_1px_0px_0px_#064e3b]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </div>
          )}
        </div>

        {/* Key points */}
        {topic.keyPoints && topic.keyPoints.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/90 border-2 border-stone-200">
            <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
              Key Insights
            </p>
            <ul className="space-y-2">
              {topic.keyPoints.map((pt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-base md:text-lg text-stone-800 font-medium"
                >
                  <span className="text-violet-600 font-black flex-shrink-0 text-sm mt-1">
                    ✦
                  </span>
                  <span className="leading-snug">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TL;DR */}
        {topic.tldr && <BanglaTldr text={topic.tldr} />}

        {/* Code snippets */}
        {topic.codeSnippets && topic.codeSnippets.length > 0 && (
          <div className="space-y-3">
            {topic.codeSnippets.map((s, i) => (
              <CodeBlock key={i} snippet={s} />
            ))}
          </div>
        )}

        {/* Comparison tables */}
        {topic.comparisons && topic.comparisons.length > 0 && (
          <div className="space-y-4">
            {topic.comparisons.map((t, i) => (
              <ComparisonTableBlock key={i} table={t} />
            ))}
          </div>
        )}

        {/* Q&A */}
        {topic.questions && topic.questions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-stone-500">
              💡 Concept Check &amp; Q&amp;A
            </p>
            {topic.questions.map((q, i) => (
              <QAItem key={i} question={q.question} answer={q.answer} />
            ))}
          </div>
        )}

        {/* Action Bar */}
        {!isCompleted && (
          <div className="pt-4 border-t-2 border-stone-100 flex justify-end">
            <button
              onClick={() => completeTopic(topic.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_#064e3b] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#064e3b] active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Completed (+10 XP)
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Learn Mode ───────────────────────────────────────────────────────────────

interface LearnModeProps {
  chapter: Chapter;
}

export function LearnMode({ chapter }: LearnModeProps) {
  let globalTopicIndex = 0;

  return (
    <div className="space-y-8">
      {chapter.sections.map((section) => (
        <section key={section.id}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-0.5 bg-stone-200" />
            <Badge variant="violet">{section.title}</Badge>
            <div className="flex-1 h-0.5 bg-stone-200" />
          </div>

          {/* Topics */}
          <div className="space-y-4">
            {section.topics
              .filter((topic) => {
                // Remove flashcards topics or trap checklist topics
                if (topic.flashcards && topic.flashcards.length > 0)
                  return false;
                if (
                  topic.title.includes("CHECKLIST") ||
                  topic.title.includes("FLASHCARDS")
                )
                  return false;
                return true;
              })
              .map((topic) => {
                const idx = globalTopicIndex++;
                return <TopicCard key={topic.id} topic={topic} index={idx} />;
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
