import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { ProfileClient } from "./ProfileClient";

export const metadata = {
  title: "Player Profile | CSRecall",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch join date
  await connectDB();
  const userDoc = await UserModel.findOne({ email: session.user.email }).lean();

  const joinDateStr = userDoc?.createdAt
    ? new Date(userDoc.createdAt as Date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <ProfileClient
      user={{
        name: session.user.name || "Player",
        email: session.user.email,
        image: session.user.image,
        joinDate: joinDateStr,
      }}
    />
  );
}
