import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";


type GitProfile = {
  id: number;
  login: string;
  bio: string | null;
  email: string | null;
  avatar_url: string;
  name: string | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    profile(profile) {
        return {
          id: profile.id?.toString(),
          sub: profile.id?.toString(),
          login: profile.login,
          bio: profile.bio,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
  })
  ],
  callbacks: {
    async signIn({ user, profile }) {

      const gitprofile = profile as GitProfile || null;

      // Profile fields (safe extraction)
      const githubId = gitprofile?.id?.toString() ?? null;
      const login = gitprofile?.login ?? null;
      const bio = gitprofile?.bio ?? "";

      if (!githubId) return false; // fail safe

      // Check if user already exists
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: githubId,
        });

      // Create new user if missing
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: githubId,
          name: user?.name ?? "",
          username: login,
          email: user?.email ?? "",
          image: user?.image ?? "",
          bio,
        });
      }

      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const gitprofile = profile as GitProfile || null;
        const githubId = gitprofile?.id?.toString();

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: githubId,
          });

        token.id = user?._id;
      }

      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
