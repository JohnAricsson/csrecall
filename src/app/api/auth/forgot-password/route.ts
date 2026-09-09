import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    await connectDB();

    const user = await UserModel.findOne({ email: cleanEmail });

    // Always respond with success to avoid email enumeration, but only act if user exists
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "If an account exists with that email, a password reset link has been generated.",
      });
    }

    // Generate raw token and hash it for DB storage
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Token valid for 1 hour
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    const origin = req.headers.get("origin") || process.env.AUTH_URL || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;

    console.log("==================================================");
    console.log(`[PASSWORD RESET] For: ${cleanEmail}`);
    console.log(`[PASSWORD RESET] Reset URL: ${resetUrl}`);
    console.log(`[PASSWORD RESET] Token expires at: ${expires.toISOString()}`);
    console.log("==================================================");

    return NextResponse.json({
      ok: true,
      message: "If an account exists with that email, a password reset link has been generated.",
      // Include resetUrl in development or for convenience testing if needed
      resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (error: any) {
    console.error("[forgot-password error]", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
