import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required. / ইমেইল এবং পাসওয়ার্ড আবশ্যক।",
        },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address. / একটি সঠিক ইমেইল প্রদান করুন।",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters. / পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Clean up any stale unverified accounts whose tokens have expired
    await UserModel.deleteMany({
      isVerified: false,
      verificationTokenExpires: { $lt: new Date() },
    });

    const existing = await UserModel.findOne({ email });
    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. / এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।",
          },
          { status: 409 },
        );
      }

      // If user exists but is unverified, update their details and send a fresh verification email
      const rawToken = crypto.randomBytes(32).toString("hex");
      const verificationToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      const hashed = await bcrypt.hash(password, 12);
      existing.password = hashed;
      if (name) existing.name = name;
      existing.isVerified = false;
      existing.verificationToken = verificationToken;
      existing.verificationTokenExpires = verificationTokenExpires;
      await existing.save();

      const baseUrl =
        process.env.NEXTAUTH_URL ||
        process.env.AUTH_URL ||
        req.headers.get("origin") ||
        "http://localhost:3000";

      const emailResult = await sendVerificationEmail({
        email,
        name: existing.name,
        token: rawToken,
        baseUrl,
      });

      return NextResponse.json(
        {
          ok: true,
          requiresVerification: true,
          devVerificationUrl:
            !emailResult.ok || process.env.NODE_ENV !== "production"
              ? emailResult.verifyUrl
              : undefined,
          sandboxWarning: !emailResult.ok ? emailResult.error : undefined,
          deliveryWarning: !emailResult.ok ? emailResult.error : undefined,
          message: emailResult.ok
            ? "A verification link has been sent to your email. Please verify before signing in."
            : "Account updated! Please verify your email before signing in.",
        },
        { status: 200 },
      );
    }

    // Create new unverified user with 24-hour verification token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const verificationToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const hashed = await bcrypt.hash(password, 12);
    await UserModel.create({
      name: name || undefined,
      email,
      password: hashed,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const emailResult = await sendVerificationEmail({
      email,
      name,
      token: rawToken,
      baseUrl,
    });

    return NextResponse.json(
      {
        ok: true,
        requiresVerification: true,
        devVerificationUrl:
          !emailResult.ok || process.env.NODE_ENV !== "production"
            ? emailResult.verifyUrl
            : undefined,
        sandboxWarning: !emailResult.ok ? emailResult.error : undefined,
        deliveryWarning: !emailResult.ok ? emailResult.error : undefined,
        message: emailResult.ok
          ? "Account created! A verification link has been sent to your email. Please verify before signing in."
          : "Account created! Please verify your email before signing in.",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("[register error]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
