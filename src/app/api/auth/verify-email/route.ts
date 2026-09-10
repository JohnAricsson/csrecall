import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { token, email } = (await req.json()) as {
      token?: string;
      email?: string;
    };

    if (!token || !email) {
      return NextResponse.json(
        {
          error:
            "Token and email are required. / টোকেন এবং ইমেইল প্রদান করা আবশ্যক।",
        },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();

    const user = await UserModel.findOne({
      email: cleanEmail,
      verificationToken: hashedToken,
    });

    if (!user) {
      // Check if user is already verified
      const existingUser = await UserModel.findOne({ email: cleanEmail });
      if (existingUser?.isVerified) {
        return NextResponse.json({
          ok: true,
          alreadyVerified: true,
          message:
            "Email is already verified. / আপনার ইমেইল ইতোমধ্যে ভেরিফাইড।",
        });
      }

      return NextResponse.json(
        {
          error:
            "Invalid or expired verification link. / ভেরিফিকেশন লিঙ্কটি সঠিক নয় বা এর মেয়াদ শেষ হয়ে গেছে।",
        },
        { status: 400 },
      );
    }

    // Check expiration
    if (
      user.verificationTokenExpires &&
      new Date(user.verificationTokenExpires).getTime() < Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "Verification link has expired. Please request a new verification email. / এই লিঙ্কের মেয়াদ শেষ হয়ে গেছে। দয়া করে নতুন লিঙ্ক চেয়ে পাঠান।",
        },
        { status: 400 },
      );
    }

    // Mark user as verified and clear tokens
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return NextResponse.json({
      ok: true,
      message:
        "Email verified successfully! You can now sign in. / ইমেইল ভেরিফিকেশন সম্পন্ন হয়েছে! এখন লগইন করুন।",
    });
  } catch (error: unknown) {
    console.error("[verify-email error]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { error: "Missing token or email." },
      { status: 400 },
    );
  }

  return POST(
    new NextRequest(req.url, {
      method: "POST",
      body: JSON.stringify({ token, email }),
      headers: { "Content-Type": "application/json" },
    }),
  );
}
