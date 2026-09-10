"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";

const MARQUEE_ITEMS = [
  "⚡ DATA STRUCTURES & ALGORITHMS",
  "🏗️ SOFTWARE DESIGN",
  "🧩 OOP & DESIGN PATTERNS",
  "🗄️ DATABASES & SQL",
  "🌐 APIs & WEB DEVELOPMENT",
  "🔐 AUTHENTICATION & SECURITY",
  "🧪 TESTING & DEBUGGING",
  "🚀 GIT & CI/CD",
];

export default function LoginPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "register") {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "Registration failed.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-3 pb-6 px-4 flex flex-col justify-between overflow-x-hidden">
      {/* ── Main Split-Screen Container ── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center my-auto">
        {/* ── Left Column: The Interview Arena Showcase ── */}
        <div className="flex flex-col justify-center space-y-3 py-1">
          {/* Brand & Headline */}
          <div>
            <div className="inline-block bg-yellow-300 text-black border-2 border-black px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] mb-1">
              ⚡ CSRECALL ARCADE
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mt-1 drop-shadow-[2px_2px_0px_#000]">
              MASTER THE BASIC
              <br />
              <span className="inline-block bg-yellow-300 px-3 py-1 mt-1 mb-2 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] rounded-xl text-black rotate-[-1deg] text-xl sm:text-2xl font-black">
                CRACK THE INTERVIEW
              </span>
            </h1>
            <p className="text-white font-medium text-sm sm:text-base leading-relaxed max-w-lg mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              ইন্টারভিউয়ের ট্রিকি ফাঁদ, কমন ভুল আর কোর কনসেপ্ট সহজে আয়ত্ত করার
              হাই-ইনটেনসিটি আর্কেড অ্যারিনা। রিভাইজ করুন এবং স্কোর ট্র্যাক করুন।
            </p>
          </div>

          {/* 3 Staggered Floating Cards */}
          <div className="space-y-2 max-w-lg">
            {/* Card 1: Trap Defused */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="py-2 px-3 rounded-2xl bg-[#fffdf7] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-400 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <ShieldAlert className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-yellow-300 text-black border border-black text-[10px] font-black shadow-[1px_1px_0px_0px_#000]">
                    ⚡ +15 XP
                  </span>
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider">
                    Trap Defused
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-black mt-0.5 truncate">
                  Defused: JavaScript Event Loop Trap
                </p>
              </div>
              <span className="text-black bg-emerald-300 px-2 py-0.5 rounded border border-black text-[10px] font-black shadow-[1px_1px_0px_0px_#000]">
                ✓ Defused
              </span>
            </motion.div>

            {/* Card 2: Trap Defusal */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4.8,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="py-2 px-3 rounded-2xl bg-[#fffdf7] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000] text-lg">
                🪤
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-200 text-stone-950 border-2 border-black font-black text-[10px] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000]">
                    TRAP DEFUSAL
                  </span>
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider">
                    OOP & CONCURRENCY
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-black mt-0.5 truncate">
                  Shallow vs Deep Copy Trap
                </p>
              </div>
              <span className="bg-emerald-300 text-stone-950 border-2 border-black font-black text-[10px] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#000] flex-shrink-0">
                Defused (+20 XP)
              </span>
            </motion.div>

            {/* Card 3: Flashcard */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="py-2 px-3 rounded-2xl bg-[#fffdf7] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-300 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <Layers className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-sky-300 text-black border border-black text-[10px] font-black shadow-[1px_1px_0px_0px_#000]">
                    🃏 Flashcard
                  </span>
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider">
                    OS Internals
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-black mt-0.5 truncate">
                  Difference between Process and Thread?
                </p>
              </div>
              <span className="text-[11px] font-black text-rose-600">
                Review &rarr;
              </span>
            </motion.div>
          </div>

          {/* Marquee Ticker */}
          <div className="my-2 sm:my-3">
            <div className="overflow-hidden rounded-xl border-[2.5px] border-black bg-black py-1.5 shadow-[3px_3px_0px_0px_#000]">
              <motion.div
                animate={{ x: [0, -750] }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="flex items-center gap-4 whitespace-nowrap text-[10px] font-black text-yellow-300 uppercase tracking-wider"
              >
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 py-1 px-2.5"
                  >
                    {item}
                    <span className="text-stone-500">/</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Comic Authentication Card ── */}
        <div className="w-full max-w-md mx-auto">
          <Card className="p-4 sm:p-5 bg-[#fffdf7] border-[3px] border-black shadow-[5px_5px_0px_0px_#000] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-yellow-400 border-b-2 border-black" />

            {/* Tabs */}
            <div className="flex rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000] mb-3">
              {(["signin", "register"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setError("");
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-black transition-colors cursor-pointer ${
                    tab === t
                      ? "bg-yellow-300 text-black border-r-2 border-black last:border-r-0"
                      : "bg-[#fffdf7] text-stone-700 hover:bg-yellow-50 border-r-2 border-black last:border-r-0"
                  }`}
                >
                  {t === "signin" ? "🔑 Sign In" : "✨ Create Account"}
                </button>
              ))}
            </div>

            {/* Google */}
            <Button
              variant="ghost"
              type="button"
              onClick={() => void signIn("google", { callbackUrl: "/profile" })}
              className="w-full gap-2 !justify-center cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_#000] py-2 px-3 text-xs font-black mb-3 h-auto"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-stone-300" />
              <span className="text-stone-500 text-[10px] font-black uppercase tracking-wider">
                or with email
              </span>
              <div className="flex-1 h-px bg-stone-300" />
            </div>

            {/* Form */}
            <form onSubmit={handleCredentials} className="space-y-2.5">
              {tab === "register" && (
                <div>
                  <label className="block text-[11px] font-black text-stone-700 uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-9 sm:h-10 py-1.5 px-3 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-medium text-xs sm:text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black text-stone-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full h-9 sm:h-10 py-1.5 px-3 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-medium text-xs sm:text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-black text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  {tab === "signin" && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={
                      tab === "register" ? "Min. 6 characters" : "Your password"
                    }
                    className="w-full h-9 sm:h-10 py-1.5 px-3 pr-10 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-medium text-xs sm:text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPw ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-medium">
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full gap-2 !justify-center cursor-pointer shadow-[2px_2px_0px_0px_#000] py-2 sm:py-2.5 text-xs sm:text-sm font-black mt-3 h-auto"
                disabled={loading}
              >
                {tab === "signin" ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />{" "}
                    {loading ? "Signing in…" : "➜ SIGN IN"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />{" "}
                    {loading ? "Creating…" : "➜ CREATE ACCOUNT"}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        defaultEmail={email}
      />
    </div>
  );
}
