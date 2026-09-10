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
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Missing reset token or email. Please request a new link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
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
        setError(data.error || "Failed to reset password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6 bg-[#fffdf7] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-400 border-b-2 border-black" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
          <KeyRound className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Set New Password</h2>
          <p className="text-xs text-stone-600 font-bold">
            Account: {email || "Unknown user"}
          </p>
        </div>
      </div>

      {(!token || !email) && (
        <div className="p-4 rounded-xl bg-yellow-100 border-2 border-black text-black text-sm font-bold flex items-start gap-2 shadow-[2px_2px_0px_0px_#000]">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-700" />
          <span>
            Invalid or missing reset parameters. Please{" "}
            <Link href="/login" className="underline font-black text-rose-600">
              request a new password reset link
            </Link>
            .
          </span>
        </div>
      )}

      {success ? (
        <div className="p-5 rounded-xl bg-emerald-100 border-2 border-black text-emerald-950 text-sm font-bold space-y-2 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center gap-2 font-black text-base text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Password Reset Complete!
          </div>
          <p>
            Your password has been updated. Redirecting you to the sign-in
            page...
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 font-black text-rose-600 underline"
          >
            Go to Login now &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-bold text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-rose-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black"
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
              Confirm New Password
            </label>
            <input
              type={showPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl border-2 border-black bg-[#fffdf7] text-black font-bold text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:border-rose-600 transition-colors"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-100 border-2 border-black text-rose-800 text-sm font-black shadow-[2px_2px_0px_0px_#000]">
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="accent"
            className="w-full gap-2 !justify-center shadow-[3px_3px_0px_0px_#000]"
            disabled={loading || !token || !email}
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-700 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black text-white drop-shadow-[2px_2px_0px_#000]">
              ⚡ CS<span className="text-rose-500">RECALL</span>
            </h1>
          </Link>
          <p className="text-yellow-100 font-bold mt-1 text-sm drop-shadow-[1px_1px_0px_#000]">
            Recover Your Arena Access
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-8 text-center text-white font-bold">
              Loading reset parameters...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
