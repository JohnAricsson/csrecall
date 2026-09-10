import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

const ProgressSchema = z.object({
  xp: z.number().int().min(0),
  streakDays: z.number().int().min(0),
  completedChapterIds: z.array(z.string()),
  completedTopics: z.array(z.string()),
  defusedTraps: z.array(z.string()),
  masteredFlashcards: z.array(z.string()),
});

function sanitizeTopics(topics: string[]): string[] {
  return Array.from(
    new Set(topics.map((t) => (t.includes("::") ? t : `chapter-1::${t}`))),
  );
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await UserModel.findOne({
      email: session.user.email.toLowerCase(),
    }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sanitizedTopics = sanitizeTopics(user.completedTopics || []);

    return NextResponse.json({
      ok: true,
      data: {
        xp: user.xp ?? 0,
        streakDays: user.streak ?? 0,
        completedChapterIds: Array.from(user.completedChapters || []),
        completedTopics: sanitizedTopics,
        defusedTraps: Array.from(user.defusedTraps || []),
        masteredFlashcards: Array.from(user.masteredFlashcards || []),
      },
    });
  } catch (err: unknown) {
    console.error("Progress fetch error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch progress",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();

    // ── Dedicated Trap Defusal Action Mutation ──
    if (
      rawBody.action === "defuseTrap" ||
      (rawBody.chapterId && rawBody.topicId && rawBody.trapId) ||
      (rawBody.scopedTrapId && rawBody.scopedTrapId.split("::").length >= 2)
    ) {
      let scopedId = rawBody.scopedTrapId as string;
      if (!scopedId || scopedId.split("::").length < 3) {
        const chapterId = (rawBody.chapterId || "chapter-1") as string;
        const topicId = (rawBody.topicId || "legacy") as string;
        const rawTrapId = (rawBody.trapId || scopedId) as string;
        scopedId = `${chapterId}::${topicId}::${rawTrapId}`;
      }

      await connectDB();
      const user = await UserModel.findOne({
        email: session.user.email.toLowerCase(),
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const alreadyDefused = (user.defusedTraps || []).includes(scopedId);

      if (!alreadyDefused) {
        user.defusedTraps = Array.from(
          new Set([...(user.defusedTraps || []), scopedId]),
        );
        user.xp = (user.xp ?? 0) + 15;
        await user.save();
      }

      return NextResponse.json({
        ok: true,
        data: {
          xp: user.xp,
          streakDays: user.streak,
          completedChapterIds: Array.from(user.completedChapters || []),
          completedTopics: sanitizeTopics(user.completedTopics || []),
          defusedTraps: Array.from(user.defusedTraps || []),
          masteredFlashcards: Array.from(user.masteredFlashcards || []),
        },
      });
    }

    const parsed = ProgressSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid progress payload", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const {
      xp,
      streakDays,
      completedChapterIds,
      completedTopics,
      defusedTraps,
      masteredFlashcards,
    } = parsed.data;

    await connectDB();

    const user = await UserModel.findOne({
      email: session.user.email.toLowerCase(),
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isReset =
      xp === 0 &&
      streakDays === 0 &&
      completedChapterIds.length === 0 &&
      completedTopics.length === 0 &&
      defusedTraps.length === 0 &&
      masteredFlashcards.length === 0;

    if (isReset) {
      user.xp = 0;
      user.streak = 0;
      user.completedChapters = [];
      user.completedTopics = [];
      user.defusedTraps = [];
      user.masteredFlashcards = [];
    } else {
      const mergedChapters = Array.from(
        new Set([...user.completedChapters, ...completedChapterIds]),
      );
      const sanitizedIncoming = sanitizeTopics(completedTopics);
      const sanitizedExisting = sanitizeTopics(user.completedTopics || []);
      const mergedTopics = Array.from(
        new Set([...sanitizedExisting, ...sanitizedIncoming]),
      );
      const mergedTraps = Array.from(
        new Set([...user.defusedTraps, ...defusedTraps]),
      );
      const mergedFlashcards = Array.from(
        new Set([...user.masteredFlashcards, ...masteredFlashcards]),
      );

      user.xp = Math.max(user.xp, xp);
      user.streak = Math.max(user.streak, streakDays);
      user.completedChapters = mergedChapters;
      user.completedTopics = mergedTopics;
      user.defusedTraps = mergedTraps;
      user.masteredFlashcards = mergedFlashcards;
    }

    await user.save();

    return NextResponse.json({
      ok: true,
      data: {
        xp: user.xp,
        streakDays: user.streak,
        completedChapterIds: Array.from(user.completedChapters),
        completedTopics: Array.from(user.completedTopics),
        defusedTraps: Array.from(user.defusedTraps),
        masteredFlashcards: Array.from(user.masteredFlashcards),
      },
    });
  } catch (err: unknown) {
    console.error("Progress sync error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 },
    );
  }
}
