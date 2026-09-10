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
        { error: "Token, email, and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
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
        { error: "Invalid or expired password reset link." },
        { status: 400 },
      );
    }

    // Hash new password and clear reset fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
        "Password reset successful! You can now log in with your new password.",
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
