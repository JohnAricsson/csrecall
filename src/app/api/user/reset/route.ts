import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await UserModel.findOneAndUpdate(
      { email: session.user.email.toLowerCase().trim() },
      {
        completedChapters: [],
        completedTopics: [],
        defusedTraps: [],
        masteredFlashcards: [],
        xp: 0,
        streak: 0,
      },
    );

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[user reset error]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
