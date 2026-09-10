"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MailCheck,
  Send,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const isMissingParams = !token || !email;
  const [status, setStatus] = useState<
    "verifying" | "success" | "alreadyVerified" | "error"
  >(isMissingParams ? "error" : "verifying");
  const [errorMessage, setErrorMessage] = useState(
    isMissingParams ? "ভেরিফিকেশন লিংকটি অসম্পূর্ণ বা অবৈধ। " : "",
  );
  const [resendEmail, setResendEmail] = useState(email);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!token || !email) {
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          alreadyVerified?: boolean;
          error?: string;
          message?: string;
        };

        if (!isMounted) return;

        if (res.ok) {
          if (data.alreadyVerified) {
            setStatus("alreadyVerified");
          } else {
            setStatus("success");
          }
        } else {
          setStatus("error");
          setErrorMessage(
            data.error || "ভেরিফিকেশন ব্যর্থ হয়েছে বা লিংকের মেয়াদ শেষ।",
          );
        }
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          "সার্ভারে যোগাযোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        );
      }
    }

    void verify();

    return () => {
      isMounted = false;
    };
  }, [token, email]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        alreadyVerified?: boolean;
        error?: string;
        message?: string;
      };

      if (res.ok) {
        setResendSuccess(true);
        setResendMsg(
          data.alreadyVerified
            ? "আপনার অ্যাকাউন্ট ইতোমধ্যে ভেরিফাইড! আপনি সরাসরি লগইন করতে পারেন।"
            : "নতুন ভেরিফিকেশন লিংক পাঠানো হয়েছে! অনুগ্রহ করে আপনার ইনবক্স চেক করুন।",
        );
      } else {
        setResendMsg(data.error || "লিংক পাঠাতে ব্যর্থ হয়েছে।");
      }
    } catch {
      setResendMsg("সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <Card className="bg-[#fffdf7] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 max-w-md w-full mx-auto space-y-6 relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />

      {/* Brand Badge */}
      <div className="pt-1">
        <div className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] text-black">
          ⚡ CSRECALL VERIFICATION
        </div>
      </div>

      {/* Loading State */}
      {status === "verifying" && (
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-300 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
            <Loader2
              className="w-7 h-7 animate-spin text-black"
              strokeWidth={3}
            />
          </div>
          <h2 className="text-xl font-black text-black">
            ইমেইল যাচাই করা হচ্ছে…
          </h2>
        </div>
      )}

      {/* Success State */}
      {(status === "success" || status === "alreadyVerified") && (
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-300 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                {status === "alreadyVerified"
                  ? "ইতোমধ্যে ভেরিফাইড!"
                  : "ইমেইল ভেরিফিকেশন সফল!"}
              </h2>
            </div>
          </div>

          <div className="p-4 bg-emerald-100 border-2 border-black rounded-xl text-xs sm:text-sm text-stone-900 font-semibold leading-relaxed shadow-[2px_2px_0px_0px_#000]">
            ✅ আপনার ইমেইল সফলভাবে নিশ্চিত হয়েছে। এখন আপনার অ্যাকাউন্ট দিয়ে লগইন
            করুন।
          </div>

          <Button
            variant="accent"
            onClick={() => router.push("/login")}
            className="w-full py-3 text-sm font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
          >
            <span>লগইন করুন (Sign In)</span>
            <ArrowRight className="w-4 h-4" strokeWidth={3} />
          </Button>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-300 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-black" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                ভেরিফিকেশন ব্যর্থ
              </h2>
            </div>
          </div>

          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs sm:text-sm text-rose-800 font-bold leading-relaxed shadow-[2px_2px_0px_0px_#000]">
            ⚠️ {errorMessage}
          </div>

          {/* Resend Form */}
          <div className="bg-[#fcfaf2] border-2 border-black rounded-xl p-4 space-y-3 shadow-[2px_2px_0px_0px_#000]">
            <p className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <MailCheck className="w-4 h-4 text-stone-800" />
              <span>নতুন ভেরিফিকেশন লিংক চান?</span>
            </p>

            <form onSubmit={handleResend} className="space-y-2.5">
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold text-stone-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:bg-amber-50"
              />
              <Button
                type="submit"
                disabled={resendLoading}
                className="w-full py-2 text-xs font-black flex items-center justify-center gap-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>পাঠানো হচ্ছে…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>নতুন লিংক পাঠান (Resend Link)</span>
                  </>
                )}
              </Button>
            </form>

            {resendMsg && (
              <p
                className={`text-xs font-bold p-2 rounded-lg border border-black ${
                  resendSuccess
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-rose-100 text-rose-900"
                }`}
              >
                {resendMsg}
              </p>
            )}
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-black text-stone-700 hover:text-black underline underline-offset-4 cursor-pointer"
            >
              <span>← লগইন পেইজে ফিরে যান (Back to Login)</span>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <Card className="p-8 max-w-md w-full mx-auto text-center border-[3px] border-black rounded-2xl bg-[#fffdf7] shadow-[6px_6px_0px_0px_#000]">
            <p className="text-sm font-bold text-stone-800">
              লোড হচ্ছে... (Loading...)
            </p>
          </Card>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
