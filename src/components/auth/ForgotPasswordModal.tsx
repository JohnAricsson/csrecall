"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultEmail = "",
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(
          data.error ||
            "Failed to process request. / অনুরোধ সম্পন্ন করা যায়নি।",
        );
      } else {
        setSubmittedEmail(email.trim());
        setSuccess(true);
      }
    } catch {
      setError(
        "Network error. Please try again. / নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md"
          >
            <Card className="p-6 sm:p-8 space-y-5 bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
              {/* Top colored accent line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

              {/* Header row */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-black">
                    Reset Password • পাসওয়ার্ড রিসেট
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">
                    We&apos;ll send a secure reset link to your email
                  </p>
                </div>
              </div>

              {success ? (
                /* Bilingual Confirmation Card */
                <div className="space-y-5">
                  <div className="p-5 rounded-xl bg-emerald-100 border-2 border-black text-emerald-950 text-sm font-bold flex items-start gap-3 shadow-[3px_3px_0px_0px_#000]">
                    <CheckCircle2
                      className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <div className="space-y-1.5">
                      <p className="font-black text-base text-emerald-950">
                        Check Your Inbox! • ইমেইল চেক করুন
                      </p>
                      <p className="text-emerald-900 font-medium text-xs sm:text-sm leading-relaxed">
                        We&apos;ve dispatched a secure reset link to{" "}
                        <span className="font-black text-black underline">
                          {submittedEmail}
                        </span>
                        . Check your inbox and spam folder.
                      </p>
                      <p className="text-emerald-950 font-bold text-xs sm:text-sm leading-relaxed">
                        <span className="font-black text-black">
                          {submittedEmail}
                        </span>{" "}
                        ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। আপনার
                        ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 border-2 border-black font-black text-xs sm:text-sm rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-center text-black"
                  >
                    DONE & BACK TO LOGIN • লগইন-এ ফিরে যান
                  </button>
                </div>
              ) : (
                /* Email Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
                      Account Email • আপনার ইমেইল
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-bold text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-rose-600 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl bg-rose-100 border-2 border-black text-rose-800 text-sm font-black shadow-[2px_2px_0px_0px_#000]">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      className="flex-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="accent"
                      disabled={loading}
                      className="flex-1 cursor-pointer"
                    >
                      {loading
                        ? "Sending... • পাঠানো হচ্ছে..."
                        : "Send Reset Link →"}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
