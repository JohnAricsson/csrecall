"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
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
    <Card className="p-6 sm:p-8 space-y-6 bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600 border-2 border-stone-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
          <KeyRound className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-900">Set New Password</h2>
          <p className="text-xs text-stone-500 font-bold">
            Account: {email || "Unknown user"}
          </p>
        </div>
      </div>

      {(!token || !email) && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-800 text-sm font-medium flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
          <span>
            Invalid or missing reset parameters. Please{" "}
            <Link href="/login" className="underline font-bold text-amber-900">
              request a new password reset link
            </Link>
            .
          </span>
        </div>
      )}

      {success ? (
        <div className="p-5 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-sm font-medium space-y-2">
          <div className="flex items-center gap-2 font-black text-base text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Password Reset Complete!
          </div>
          <p>Your password has been updated. Redirecting you to the sign-in page...</p>
          <Link href="/login" className="inline-block mt-2 font-bold text-violet-700 underline">
            Go to Login now &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#1c1917] focus:outline-none focus:border-violet-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl border-2 border-stone-900 bg-white text-stone-900 font-medium text-sm placeholder-stone-400 shadow-[2px_2px_0px_0px_#1c1917] focus:outline-none focus:border-violet-600 transition-colors"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2 !justify-center"
            disabled={loading || !token || !email}
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-stone-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Neo-brutalist Grid Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1c19170a_1px,transparent_1px),linear-gradient(to_bottom,#1c19170a_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black text-stone-900">⚡ CSRecall</h1>
          </Link>
          <p className="text-stone-500 font-medium mt-1 text-sm">
            Recover Your Arena Access
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-stone-500 font-bold">Loading reset parameters...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
