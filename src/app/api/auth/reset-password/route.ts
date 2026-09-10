import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = (await req.json()) as {
      token?: string;
      email?: string;
      newPassword?: string;
    };

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Token, email, and new password are required. / টোকেন, ইমেইল এবং নতুন পাসওয়ার্ড আবশ্যক।",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters. / পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
        },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();

    const user = await UserModel.findOne({
      email: cleanEmail,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired password reset link. / লিংকটি সঠিক নয় বা এর মেয়াদ শেষ হয়ে গেছে।",
        },
        { status: 400 },
      );
    }

    // Hash new password with 12 salt rounds and clear token fields
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(
      `[PASSWORD RESET] Successfully updated password for: ${cleanEmail}`,
    );

    return NextResponse.json({
      ok: true,
      message:
        "Password updated successfully! / পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
    });
  } catch (error: unknown) {
    console.error("[reset-password error]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 },
    );
  }
}
