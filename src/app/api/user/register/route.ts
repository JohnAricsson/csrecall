import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await UserModel.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 },
    );
  }
}
