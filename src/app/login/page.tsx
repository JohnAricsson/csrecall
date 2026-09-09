"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Flame,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Mail,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const MARQUEE_ITEMS = [
  "⚡ CONCURRENCY & THREADS",
  "🪤 PROMISE RESOLUTION GOTCHAS",
  "🛡️ DATABASE INDEXING & B-TREES",
  "👑 DISTRIBUTED CONSENSUS",
  "🔥 TIME COMPLEXITY PITFALLS",
  "🃏 VIRTUAL MEMORY & PAGING",
  "🎯 OOP INHERITANCE TRAPS",
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
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess(false);
    setDevResetUrl(null);
    setForgotLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail || email }),
      });
      const data = (await res.json()) as { error?: string; resetUrl?: string };

      if (!res.ok) {
        setForgotError(data.error || "Failed to process request.");
      } else {
        setForgotSuccess(true);
        if (data.resetUrl) {
          setDevResetUrl(data.resetUrl);
        }
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-stone-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-x-hidden">
      {/* ── Background: Technical Dot-Grid Pattern with Radial Fade Mask ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-80"
      />

      {/* Ambient glowing atmosphere strictly behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-10 w-96 h-96 bg-violet-400/20 blur-[130px] rounded-full -z-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-amber-400/20 blur-[130px] rounded-full -z-10"
      />

      {/* ── Main Split-Screen Container ── */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* ── Left Column: The Interview Arena Showcase ── */}
        <div className="flex flex-col justify-center space-y-8 py-2">
          {/* Brand header */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-black text-2xl text-stone-900 hover:text-violet-600 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 bg-violet-600 rounded-xl border-2 border-stone-900 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000] group-hover:-translate-y-0.5 transition-transform">
                <Zap className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="tracking-tight">CSRecall</span>
            </Link>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-stone-900 tracking-tight leading-[1.08] mt-6">
              Master the{" "}
              <span className="text-violet-600 underline decoration-wavy decoration-amber-400">
                Gotchas
              </span>
              .<br />
              Crack the{" "}
              <span className="bg-amber-300 px-2.5 py-0.5 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#000] rounded-xl inline-block my-1 text-stone-900">
                Interview
              </span>
              .
            </h1>
            <p className="text-stone-600 font-semibold text-base sm:text-lg max-w-lg mt-4 leading-relaxed">
              The high-intensity training arena for CS fundamentals. Defuse real
              interview traps, cement core concepts with rapid flashcards, and
              track your mastery score.
            </p>
          </div>

          {/* 3 Staggered Floating Cards */}
          <div className="space-y-3.5 max-w-lg">
            {/* Card 1: Trap Defused */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#000] flex items-center gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-100 border-2 border-stone-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-400 font-black text-xs">
                    ⚡ +30 XP
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Trap Defused
                  </span>
                </div>
                <p className="font-black text-sm text-stone-900 mt-1 truncate">
                  Defused: JavaScript Event Loop Trap
                </p>
              </div>
              <span className="text-emerald-500 font-black text-sm">
                ✓ Defused
              </span>
            </motion.div>

            {/* Card 2: Streak */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4.8,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#000] flex items-center gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-100 border-2 border-stone-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <Flame className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-400 font-black text-xs">
                    🔥 5-Day Streak
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Consistency Bonus
                  </span>
                </div>
                <p className="font-black text-sm text-stone-900 mt-1 truncate">
                  System Design Sprint Active
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-2" />
            </motion.div>

            {/* Card 3: Flashcard */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4.2,
                ease: "easeInOut",
                delay: 1.2,
              }}
              className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#000] flex items-center gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-100 border-2 border-stone-900 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_#000]">
                <Layers className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-900 border border-violet-400 font-black text-xs">
                    🃏 Flashcard
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    OS Internals
                  </span>
                </div>
                <p className="font-black text-sm text-stone-900 mt-1 truncate">
                  Difference between Process and Thread?
                </p>
              </div>
              <span className="text-xs font-bold text-violet-600">
                Review &rarr;
              </span>
            </motion.div>
          </div>

          {/* Marquee Ticker */}
          <div className="pt-2">
            <div className="overflow-hidden rounded-xl border-2 border-stone-900 bg-stone-900 py-2.5 shadow-[3px_3px_0px_0px_#000]">
              <motion.div
                animate={{ x: [0, -750] }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="flex items-center gap-6 whitespace-nowrap text-xs font-black text-amber-300 uppercase tracking-wider"
              >
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2">
                    {item}
                    <span className="text-stone-600">/</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Neo-Brutalist Authentication Card ── */}
        <div className="w-full max-w-md mx-auto">
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-2 border-stone-900 shadow-[6px_6px_0px_0px_#1c1917] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-amber-400" />

            {/* Tabs */}
            <div className="flex rounded-xl border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_#1c1917] pt-0.5">
              {(["signin", "register"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setError("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-black transition-colors cursor-pointer ${
                    tab === t
                      ? "bg-violet-600 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-50"
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
              className="w-full gap-2 !justify-center cursor-pointer border-2 border-stone-900 shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4">
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

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                or with email
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleCredentials} className="space-y-4">
              {tab === "register" && (
                <div>
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-violet-600 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-violet-600 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  {tab === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotSuccess(false);
                        setForgotError("");
                        setDevResetUrl(null);
                        setShowForgotModal(true);
                      }}
                      className="text-xs font-black text-violet-600 hover:text-violet-800 transition-colors cursor-pointer hover:underline"
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
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-violet-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2 !justify-center cursor-pointer border-2 border-stone-900 shadow-[3px_3px_0px_0px_#000]"
                disabled={loading}
              >
                {tab === "signin" ? (
                  <>
                    <LogIn className="w-4 h-4" />{" "}
                    {loading ? "Signing in…" : "Sign In"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />{" "}
                    {loading ? "Creating…" : "Create Account"}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 sm:p-8 space-y-5 bg-white border-2 border-stone-900 shadow-[6px_6px_0px_0px_#000]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                    <Mail className="w-5 h-5 text-stone-900" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-stone-900">
                      Reset Password
                    </h3>
                    <p className="text-xs text-stone-500 font-bold">
                      We'll generate a secure reset link for your account
                    </p>
                  </div>
                </div>

                {forgotSuccess ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-800 text-sm font-medium flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-950">
                          Reset link generated!
                        </p>
                        <p className="mt-1">
                          If an account exists with{" "}
                          <strong>{forgotEmail}</strong>, instructions to reset
                          your password have been issued.
                        </p>
                      </div>
                    </div>

                    {devResetUrl && (
                      <div className="p-3 bg-stone-100 rounded-xl border border-stone-300 text-xs break-all space-y-1">
                        <span className="font-bold text-stone-700 block">
                          Development Link:
                        </span>
                        <a
                          href={devResetUrl}
                          className="text-violet-600 underline font-semibold"
                        >
                          Click here to open password reset form &rarr;
                        </a>
                      </div>
                    )}

                    <Button
                      variant="primary"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full cursor-pointer"
                    >
                      Done & Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                        Account Email
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-violet-600 transition-colors"
                      />
                    </div>

                    {forgotError && (
                      <div className="px-4 py-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-sm font-medium">
                        ⚠️ {forgotError}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowForgotModal(false)}
                        className="flex-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={forgotLoading}
                        className="flex-1 cursor-pointer"
                      >
                        {forgotLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
