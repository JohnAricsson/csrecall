"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isInvalidLink = !token.trim() || !email.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isInvalidLink) {
      setError("লিংকটি সঠিক নয় বা মেয়াদোত্তীর্ণ।");
      return;
    }

    if (newPassword.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("উভয় পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword }),
      });

      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setError("কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 max-w-md w-full mx-auto space-y-6 relative overflow-hidden">
      {/* Top colored accent line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

      {/* Brand Pill & Header */}
      <div className="space-y-3 pt-1">
        <div className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] text-black">
          ⚡ CSRECALL CREDENTIALS
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0 mt-0.5">
            <KeyRound className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
              নতুন পাসওয়ার্ড দিন
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1 leading-snug">
              আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন।
            </p>
          </div>
        </div>

        {email && (
          <div className="text-xs font-bold text-stone-700 bg-amber-50 border border-stone-300 rounded-lg px-3 py-1.5 truncate">
            Target Account:{" "}
            <span className="font-black text-black">{email}</span>
          </div>
        )}
      </div>

      {/* Invalid Link Error Banner */}
      {isInvalidLink && (
        <div className="p-4 rounded-xl bg-rose-100 border-2 border-black text-black text-xs sm:text-sm font-bold space-y-2 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-700" />
            <span>লিংকটি সঠিক নয় বা মেয়াদোত্তীর্ণ।</span>
          </div>
          <p className="text-stone-700 text-xs">
            Please{" "}
            <Link
              href="/login"
              className="underline font-black text-rose-600 hover:text-rose-700"
            >
              request a new password reset link
            </Link>{" "}
            from the sign-in page.
          </p>
        </div>
      )}

      {/* Success State */}
      {success ? (
        <div className="p-5 rounded-xl bg-emerald-100 border-2 border-black text-emerald-950 text-sm font-bold space-y-3 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center gap-2 font-black text-base text-emerald-950">
            <CheckCircle2
              className="w-6 h-6 text-emerald-700 flex-shrink-0"
              strokeWidth={2.5}
            />
            <span>পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!</span>
          </div>
          <p className="text-emerald-900 text-xs sm:text-sm font-medium">
            ২ সেকেন্ডের মধ্যে লগইন পেজে নিয়ে যাওয়া হচ্ছে...
          </p>
          <Link
            href="/login"
            className="inline-block pt-1 font-black text-xs sm:text-sm text-black underline underline-offset-2 hover:text-stone-700"
          >
            সরাসরি লগইন করুন
          </Link>
        </div>
      ) : (
        /* Form */
        !isInvalidLink && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                নতুন পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters • কমপক্ষে ৮ অক্ষর"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-bold text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-rose-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black cursor-pointer"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                নিশ্চিত করুন
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter password • পুনরায় লিখুন"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-bold text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-rose-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black cursor-pointer"
                  aria-label={
                    showConfirmPw
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-rose-100 border-2 border-black text-rose-800 text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_#000]">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 border-2 border-black font-black text-xs sm:text-sm text-black rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-center uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </button>
          </form>
        )
      )}

      <div className="text-center pt-2 border-t-2 border-black/10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-700 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> লগইন-এ ফিরে যান
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[2px_2px_0px_#000]">
              ⚡ CS<span className="text-rose-500">RECALL</span>
            </h1>
          </Link>
          <p className="text-yellow-100 font-bold mt-1 text-xs sm:text-sm drop-shadow-[1px_1px_0px_#000]">
            পাসওয়ার্ড পুনরুদ্ধার করুন
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-8 text-center bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] text-black font-black text-sm">
              লোড হচ্ছে...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
