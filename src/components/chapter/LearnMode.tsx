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
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-700">
        <Badge variant="violet" className="text-[10px]">
          {snippet.language.toUpperCase()}
        </Badge>
        {snippet.explanation && (
          <span className="text-stone-400 text-xs font-medium truncate max-w-[60%]">
            {snippet.explanation}
          </span>
        )}
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all",
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
      <pre className="bg-stone-950 text-emerald-400 text-sm font-mono p-4 overflow-x-auto leading-relaxed">
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

// ─── Bangla TL;DR callout ─────────────────────────────────────────────────────

function BanglaTldr({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-amber-100 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
      <Lightbulb
        className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
        strokeWidth={2.5}
      />
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">
          🇧🇩 সহজ করে:
        </p>
        <p className="text-stone-800 font-semibold text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTableBlock({ table }: { table: ComparisonTable }) {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917]">
      <table className="w-full text-sm min-w-max">
        <caption className="text-left px-4 py-2.5 bg-violet-600 text-white font-black text-sm rounded-t-[10px]">
          {table.title}
        </caption>
        <thead>
          <tr className="bg-stone-900 text-white">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left font-black text-xs uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-stone-50"}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2.5 text-stone-700 font-medium border-t border-stone-200"
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
    <div className="rounded-xl border-2 border-stone-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white hover:bg-stone-50 transition-colors text-left"
      >
        <span className="font-bold text-stone-800 text-sm leading-snug">
          ❓ {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-stone-400" strokeWidth={2.5} />
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
            <div className="px-4 py-3 bg-emerald-50 border-t-2 border-emerald-200">
              <p className="text-sm text-stone-700 font-medium leading-relaxed">
                ✅ {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, index }: { topic: Topic; index: number }) {
  return (
    <div className="p-0">
      <Card className="p-6 space-y-5">
        {/* Topic header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-600 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
            <span className="text-white text-xs font-black">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-black text-stone-900 text-xl md:text-2xl leading-tight">
              {topic.title}
            </h3>
            {topic.explanation && (
              <p className="text-stone-800 text-base md:text-lg mt-1.5 leading-relaxed whitespace-pre-line">
                {topic.explanation}
              </p>
            )}
          </div>
        </div>

        {/* Key points */}
        {topic.keyPoints && topic.keyPoints.length > 0 && (
          <ul className="space-y-1.5 pl-1">
            {topic.keyPoints.map((pt, i) => (
              <li
                key={i}
                className="flex gap-2 text-base md:text-lg text-stone-800 font-medium"
              >
                <span className="text-violet-500 flex-shrink-0 mt-0.5">▸</span>
                {pt}
              </li>
            ))}
          </ul>
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
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-stone-400">
              Mystery Q&amp;A
            </p>
            {topic.questions.map((q, i) => (
              <QAItem key={i} question={q.question} answer={q.answer} />
            ))}
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
