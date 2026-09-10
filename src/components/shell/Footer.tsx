import React from "react";

export function Footer() {
  return (
    <footer className="w-full px-4 sm:px-6 mt-auto">
      <div className="bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_#000] max-w-5xl mx-auto mt-2 mb-0 py-3 px-4 sm:py-4 sm:px-6">
        {/* ── Two Balanced Columns with Clear Vertical Center Alignment ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-8 items-center pb-3 border-b-2 border-black/10">
          {/* ── Left Side: Brand & Identity ── */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="bg-amber-300 text-stone-950 border-2 border-black font-black text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md uppercase tracking-wider inline-block">
              ⚡ CSRECALL
            </span>
            <h3 className="text-stone-900 font-extrabold text-xs sm:text-base md:text-lg mt-1.5 sm:mt-2 leading-snug max-w-sm">
              সংক্ষিপ্ত নোট, ইন্টারভিউ ফাঁদ ও ফ্ল্যাশকার্ড প্র্যাকটিস দিয়ে নিজের
              প্রস্তুতি ঝালিয়ে নিন।{" "}
            </h3>
          </div>

          {/* ── Right Side: Creator & Compact Connect ── */}
          <div className="flex flex-col items-center sm:items-start md:items-end">
            <span className="text-stone-950 font-black text-[10px] sm:text-xs tracking-wider uppercase mb-1.5 sm:mb-2.5">
              👾 CREATOR &amp; CONNECT
            </span>

            {/* Compact Inked Pill Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start md:justify-end gap-1.5 sm:gap-2 md:gap-3">
              {/* GitHub */}
              <a
                href="https://github.com/JohnAricsson"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f0f0f0] hover:bg-stone-200 text-stone-950 border-2 border-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer"
              >
                <span>🐙</span>
                <span>GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/johnaricsson1/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-200 hover:bg-sky-300 text-stone-950 border-2 border-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer"
              >
                <span>💼</span>
                <span>LinkedIn</span>
              </a>

              {/* Portfolio */}
              <a
                href="https://johnaricsson.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-200 hover:bg-emerald-300 text-stone-950 border-2 border-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer"
              >
                <span>🌐</span>
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Row (Compact Copyright & Meta) ── */}
        <div className="pt-2 sm:pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-xs font-bold text-stone-500">
          <p className="text-center sm:text-left">
            © 2026 CSRecall. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Developed for CS Students &amp; Freshers
          </p>
        </div>
      </div>
    </footer>
  );
}
