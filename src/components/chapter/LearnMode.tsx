"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check, CheckCircle2, Lock } from "lucide-react";
import type {
  Chapter,
  Topic,
  CodeSnippet,
  ComparisonTable,
} from "@/lib/schema";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import { isTopicCompleted, isLearnableTopic } from "@/lib/topicUtils";

// ─── Universal Line-by-Line Parsing Engine ────────────────────────────────────

function FormattedExplanation({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="my-4 space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // 1. Sub-Item / Arrow Lines (→, ->, or starting with - or * or •)
        if (/^(→|->|-|\*|•)\s*/.test(trimmed)) {
          const cleanLine = trimmed.replace(/^(→|->|-|\*|•)\s*/, "");
          const colonIndex = cleanLine.indexOf(":");

          if (colonIndex !== -1) {
            const tag = cleanLine.slice(0, colonIndex).trim();
            const desc = cleanLine.slice(colonIndex + 1).trim();

            return (
              <div
                key={idx}
                className="bg-amber-50/70 border-2 border-black rounded-xl p-2.5 sm:p-3 md:p-3.5 my-2 shadow-[2px_2px_0px_0px_#000]"
              >
                <span className="bg-amber-300 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-md border border-black uppercase tracking-wide inline-block mr-2">
                  {tag}
                </span>
                <span className="font-normal sm:font-medium text-stone-900 text-xs sm:text-sm md:text-base leading-relaxed">
                  {desc}
                </span>
              </div>
            );
          } else {
            return (
              <div
                key={idx}
                className="bg-amber-50/70 border-2 border-black rounded-xl p-2.5 sm:p-3 md:p-3.5 my-2 shadow-[2px_2px_0px_0px_#000]"
              >
                <span className="font-normal sm:font-medium text-stone-900 text-xs sm:text-sm md:text-base leading-relaxed">
                  {cleanLine}
                </span>
              </div>
            );
          }
        }

        // 2. Definition / Note Lines (Term: Definition without arrows)
        const defMatch = trimmed.match(
          /^([A-Z][A-Za-z0-9\s/_\-()]{1,35}):\s*(.+)$/,
        );
        if (defMatch) {
          const term = defMatch[1].trim();
          const definition = defMatch[2].trim();

          return (
            <div
              key={idx}
              className="bg-sky-50/80 border-2 border-dashed border-black/70 rounded-xl p-2.5 sm:p-3 md:p-3.5 my-2 text-stone-800 font-normal text-xs sm:text-sm md:text-base shadow-[2px_2px_0px_0px_#000] flex items-start gap-2.5"
            >
              <span className="text-sky-600 font-black text-base md:text-lg shrink-0 mt-0.5">
                📌
              </span>
              <div className="leading-relaxed">
                <span className="font-bold text-stone-950 mr-1.5">{term}:</span>
                <span className="text-stone-800 text-xs sm:text-sm md:text-base font-normal sm:font-medium">
                  {definition}
                </span>
              </div>
            </div>
          );
        }

        // 3. Standard Narrative Paragraphs
        return (
          <p
            key={idx}
            className="text-sm sm:text-base md:text-[17px] font-normal text-stone-800 leading-relaxed my-1.5 sm:my-2"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ─── Code Terminal ────────────────────────────────────────────────────────────

function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet.code]);

  return (
    <div className="bg-stone-950 border-[3px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000]">
      {/* Header bar with arcade terminal chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-b-2 border-black">
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-black" />
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-black" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-black" />
          </div>
          <span className="bg-yellow-300 text-black px-2 py-0.5 rounded border border-black text-[10px] font-black uppercase tracking-wider">
            {snippet.language.toUpperCase()}
          </span>
        </div>

        {snippet.explanation && (
          <span className="text-stone-300 text-xs font-bold truncate max-w-[50%] hidden sm:inline">
            {snippet.explanation}
          </span>
        )}

        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]",
            copied
              ? "bg-emerald-400 text-black"
              : "bg-yellow-300 hover:bg-yellow-200 text-black",
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" strokeWidth={3} />
              Copy ⚡
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="text-emerald-400 font-mono text-sm leading-relaxed p-4 sm:p-5 overflow-x-auto bg-[#0d1117] max-sm:text-[11px] max-sm:p-2.5">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

// ─── Bengali TL;DR Comic Bubble ───────────────────────────────────────────────

function BanglaTldr({ text }: { text: string }) {
  return (
    <div className="bg-amber-100 border-[3px] border-black rounded-2xl p-3 sm:p-4 md:p-4 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
        {/* Lightbulb Badge */}
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md border-2 border-black bg-amber-300 flex items-center justify-center text-xs shrink-0 shadow-[1.5px_1.5px_0px_0px_#000]">
          💡
        </div>
        {/* TL;DR Pill */}
        <span className="bg-rose-500 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
          সহজ কথায় (TL;DR)
        </span>
      </div>
      <p className="text-xs sm:text-sm md:text-[15px] font-medium leading-relaxed text-stone-900">
        {text}
      </p>
    </div>
  );
}

// ─── Comparison Battles ───────────────────────────────────────────────────────

function ComparisonTableBlock({ table }: { table: ComparisonTable }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] bg-[#fffdf7] max-sm:overflow-x-auto max-sm:my-2">
      <table className="w-full table-fixed text-xs sm:text-sm md:text-base border-collapse max-sm:min-w-[480px]">
        <caption className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 bg-yellow-300 text-stone-900 font-black text-sm sm:text-base border-b-2 border-black wrap-break-word">
          ⚡ {table.title}
        </caption>
        <thead>
          <tr className="bg-sky-200 text-stone-900 border-b-2 border-black">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-2 sm:px-3.5 py-2.5 sm:py-3 text-left align-top font-black text-[10px] sm:text-xs uppercase tracking-wider whitespace-normal wrap-break-word border-r-2 border-black last:border-r-0"
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
                "transition-colors hover:bg-amber-50/50",
                ri % 2 === 0 ? "bg-[#fffdf7]" : "bg-[#f7f4ec]",
              )}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-2 sm:px-3.5 py-2.5 sm:py-3 text-stone-900 font-normal sm:font-medium text-xs sm:text-sm align-top wrap-break-word whitespace-normal border-t-2 border-stone-300 border-r-2 last:border-r-0"
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

// ─── Concept Check Accordions (Q&A) ──────────────────────────────────────────

function QAItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_#000] bg-[#fffdf7]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2.5 sm:gap-3.5 py-2 px-2.5 sm:py-2.5 sm:px-4 bg-[#fffdf7] hover:bg-[#f7f4ec] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-yellow-300 border-2 border-black flex items-center justify-center text-xs sm:text-sm font-black shrink-0 shadow-[1px_1px_0px_0px_#000]">
            ?
          </span>
          <span className="text-xs sm:text-sm md:text-base font-bold leading-snug text-stone-900 pr-2">
            {question}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="shrink-0"
        >
          <ChevronDown
            className="w-4 h-4 text-stone-900 shrink-0"
            strokeWidth={3}
          />
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
            <div className="p-2.5 sm:p-3.5 bg-violet-50/70 border-t-2 border-black flex items-start gap-2">
              <span className="text-xs shrink-0 mt-0.5">✅</span>
              <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-stone-800 font-normal sm:font-medium">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Topic Card ────────────────────────────────────────────────────────────────

interface TopicCardProps {
  topic: Topic;
  chapterId: string;
  index: number;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

function TopicCard({
  topic,
  chapterId,
  index,
  isGuest,
  onRequireAuth,
}: TopicCardProps) {
  const { completedTopics, completeTopic } = useGameStore();
  const isCompleted = isTopicCompleted(completedTopics, chapterId, topic.id);

  return (
    <div className="bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-3.5 pb-4 sm:p-5 sm:pb-5 md:p-6 md:pb-6 mb-5 sm:mb-6 text-stone-900 relative overflow-hidden flex flex-col gap-3 sm:gap-4">
      {/* Top colored accent line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

      {/* Topic header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-violet-600 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <span className="text-white text-sm sm:text-base font-black">
              {index + 1}
            </span>
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-stone-900 leading-snug uppercase">
            {topic.title}
          </h3>
        </div>
        {isCompleted && (
          <div className="self-start sm:self-auto text-[10px] sm:text-xs md:text-sm py-1 px-2.5 sm:px-3 sm:py-1.5 shrink-0 bg-emerald-300 text-black rounded-lg border-2 border-black font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]">
            <CheckCircle2
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              strokeWidth={3}
            />
            <span>✓ শেষ করা হয়েছে (+১০ XP)</span>
          </div>
        )}
      </div>

      {topic.explanation && <FormattedExplanation text={topic.explanation} />}

      {/* Key points / Takeaways */}
      {topic.keyPoints && topic.keyPoints.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-700">
            ✦ মূল বিষয়বস্তু (KEY TAKEAWAYS)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {topic.keyPoints.map((pt, i) => (
              <div
                key={i}
                className="bg-[#fffdf7] border-2 border-black rounded-xl p-2 sm:p-2.5 md:p-3 shadow-[2px_2px_0px_0px_#000] font-normal sm:font-medium text-xs sm:text-sm md:text-[14px] text-stone-800 leading-normal flex items-start gap-2.5"
              >
                <span className="text-amber-500 font-black flex-shrink-0 text-sm sm:text-base mt-0.5">
                  ✦
                </span>
                <span className="leading-snug">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bengali TL;DR Comic Bubble */}
      {topic.tldr && (
        <div>
          <BanglaTldr text={topic.tldr} />
        </div>
      )}

      {/* Code snippets */}
      {topic.codeSnippets && topic.codeSnippets.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {topic.codeSnippets.map((s, i) => (
            <CodeBlock key={i} snippet={s} />
          ))}
        </div>
      )}

      {/* Comparison tables */}
      {topic.comparisons && topic.comparisons.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {topic.comparisons.map((t, i) => (
            <ComparisonTableBlock key={i} table={t} />
          ))}
        </div>
      )}

      {/* Concept Check Accordions (Q&A) */}
      {topic.questions && topic.questions.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3 mb-0">
          <p className="text-xs sm:text-sm font-black text-stone-800 mb-1.5 uppercase tracking-wider">
            ❓ নিজেকে যাচাই করুন (Concept Check)
          </p>
          {topic.questions.map((q, i) => (
            <QAItem key={i} question={q.question} answer={q.answer} />
          ))}
        </div>
      )}

      {/* Complete Action Button */}
      {!isCompleted && (
        <div className="pt-4 sm:pt-5 border-t-2 border-black/20 flex justify-end">
          {isGuest ? (
            <button
              onClick={onRequireAuth}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-600 border-[3px] border-black cursor-pointer font-black text-sm sm:text-base rounded-xl shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4 text-stone-600" />
              <span>🔒 লগইন করে +১০ XP নিন</span>
            </button>
          ) : (
            <button
              onClick={() => completeTopic(topic.id, chapterId)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black border-[3px] border-black font-black text-sm sm:text-base rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={3} />
              <span>✓ সম্পন্ন হয়েছে (+১০ XP)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Learn Mode ───────────────────────────────────────────────────────────────

interface LearnModeProps {
  chapter: Chapter;
  isGuest?: boolean;
  onRequireAuth?: () => void;
}

export function LearnMode({ chapter, isGuest, onRequireAuth }: LearnModeProps) {
  let globalTopicIndex = 0;

  return (
    <div className="space-y-6 sm:space-y-7">
      {chapter.sections.map((section) => (
        <section key={section.id}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="flex-1 h-0.5 bg-yellow-400/30" />
            <Badge
              variant="amber"
              className="text-sm sm:text-base py-1.5 px-4 shadow-[3px_3px_0px_0px_#000] uppercase tracking-wide font-black"
            >
              {section.title}
            </Badge>
            <div className="flex-1 h-0.5 bg-yellow-400/30" />
          </div>

          {/* Topics */}
          <div>
            {section.topics.filter(isLearnableTopic).map((topic) => {
              const idx = globalTopicIndex++;
              return (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  chapterId={chapter.id}
                  index={idx}
                  isGuest={isGuest}
                  onRequireAuth={onRequireAuth}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
