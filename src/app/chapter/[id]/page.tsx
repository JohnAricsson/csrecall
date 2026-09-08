import { getChapterById, getAllChapters } from "@/lib/chapters";
import { notFound } from "next/navigation";
import { ChapterArena } from "@/components/chapter/ChapterArena";

// ─── Metadata & Static Params ────────────────────────────────────────────────

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map((chapter) => ({
    id: chapter.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = getChapterById(id);
  return {
    title: chapter ? chapter.title : "Chapter Not Found",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Chapter Arena page — Server Component.
 * Resolves the dynamic [id] param, looks up the chapter from the static
 * JSON registry, and passes it to the client-side arena shell.
 */
export default async function ChapterPage({ params }: Props) {
  const { id } = await params;
  const chapter = getChapterById(id);

  if (!chapter) notFound();

  return <ChapterArena chapter={chapter} />;
}
