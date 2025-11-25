import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {

      // Profile fields (safe extraction)
      const githubId = profile?.id?.toString() ?? null;
      const login = profile?.login ?? null;
      const bio = profile?.bio ?? "";

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
        const githubId = profile?.id?.toString();

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
