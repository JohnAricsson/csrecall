import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/models/User";

const config: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

        await dbConnect();

        // 1. Always query MongoDB using .lean() to prevent Mongoose proxy getters
        const email = (credentials.email as string).toLowerCase().trim();
        const user = await UserModel.findOne({ email })
          .select("+password")
          .lean();

        if (!user) {
          console.warn(
            `[auth] Login failed: No account exists with email "${email}". Please create an account first.`,
          );
          return null;
        }

        if (!user.password) {
          console.warn(
            `[auth] Login failed: Account "${email}" was registered via Google OAuth without a password.`,
          );
          return null;
        }

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.password,
        );

        if (!valid) {
          console.warn(
            `[auth] Login failed: Incorrect password for "${email}".`,
          );
          return null;
        }

        console.log(
          `[auth] Login successful for user: "${email}" (${user._id})`,
        );

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
        await dbConnect();
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
          { upsert: true, new: true, setDefaultsOnInsert: true },
        ).lean();
      }
      return true;
    },

    async jwt({ token, user }) {
      // 3. Keep the JWT token payload minimal (only standard claims: id, name, email, image)
      if (user) {
        token.id = typeof user.id === "string" ? user.id : String(user.id);
        token.name = typeof user.name === "string" ? user.name : "";
        token.email = typeof user.email === "string" ? user.email : "";
        token.picture = (user as { image?: string | null }).image
          ? String((user as { image?: string | null }).image)
          : null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id =
          typeof token.id === "string" ? token.id : String(token.sub ?? "");
        session.user.name = typeof token.name === "string" ? token.name : "";
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.image =
          typeof token.picture === "string" ? token.picture : null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  logger: {
    error(error) {
      // In Auth.js, CredentialsSignin is expected when a user enters wrong credentials or has no account.
      // We log helpful dev guidance directly in authorize, so suppress redundant noisy callstack here.
      if (error.name === "CredentialsSignin") {
        return;
      }
      console.error("[auth][error]", error);
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
