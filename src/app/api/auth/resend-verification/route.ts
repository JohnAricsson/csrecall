import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required. / ইমেইল প্রদান করা আবশ্যক।" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    await connectDB();

    const user = await UserModel.findOne({ email: cleanEmail });

    if (!user) {
      // Return ok to prevent user enumeration
      return NextResponse.json({
        ok: true,
        message:
          "If an account exists, a verification link has been sent. / আপনার ইমেইলে ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে।",
      });
    }

    if (user.isVerified) {
      return NextResponse.json({
        ok: true,
        alreadyVerified: true,
        message:
          "This account is already verified. You can log in directly. / আপনার অ্যাকাউন্ট ইতোমধ্যে ভেরিফাইড।",
      });
    }

    // Generate fresh 24-hour verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const verificationToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: user.name,
      token: rawToken,
      baseUrl,
    });

    return NextResponse.json({
      ok: true,
      devVerificationUrl:
        !emailResult.ok || process.env.NODE_ENV !== "production"
          ? emailResult.verifyUrl
          : undefined,
      sandboxWarning: !emailResult.ok ? emailResult.error : undefined,
      deliveryWarning: !emailResult.ok ? emailResult.error : undefined,
      message: emailResult.ok
        ? "A fresh verification email has been dispatched. / একটি নতুন ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে।"
        : "A fresh verification link has been generated. Please verify your email.",
    });
  } catch (error: unknown) {
    console.error("[resend-verification error]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
