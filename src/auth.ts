import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";

const config: NextAuthConfig = {
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name as string,
          email: profile.email as string,
          image: (profile.picture as string) ?? null,
        };
      },
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        // 1. Always query MongoDB using .lean() to prevent Mongoose proxy getters
        const user = await UserModel.findOne({
          email: (credentials.email as string).toLowerCase().trim(),
        })
          .select("+password")
          .lean();

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        // 2. Normalize the return payload into pure serializable primitives only
        return {
          id: user._id.toString(),
          name: user.name ?? "",
          email: user.email,
          image: user.avatarUrl ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await connectDB();
        await UserModel.findOneAndUpdate(
          { email: profile.email.toLowerCase().trim() },
          {
            $setOnInsert: {
              name: profile.name,
              email: profile.email.toLowerCase().trim(),
              avatarUrl: (profile as { picture?: string }).picture ?? undefined,
              xp: 0,
              streak: 0,
              completedChapters: [],
              completedTopics: [],
              defusedTraps: [],
              masteredFlashcards: [],
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();
      }
      return true;
    },

    async jwt({ token, user }) {
      // 3. Keep the JWT token payload minimal (only standard claims: id, name, email, image)
      if (user) {
        token.id = user.id;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
        if ((user as any).image) token.picture = (user as any).image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
