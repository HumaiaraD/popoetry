import React from "react";
import { client } from "@/sanity/lib/client";
import { POST_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupTypeCard } from "./StartupCard";
import { Post } from "@/sanity.types";


interface StartupCardProps {
  post: StartupTypeCard | Post;
}


const UserPosts = async ({ id }: { id: string }) => {
  // Tell fetch what type to return
  const userPosts = await client.fetch<StartupTypeCard[]>(POST_BY_AUTHOR_QUERY, { id });

  return (
    <ul className="space-y-6">
      {userPosts.length === 0 ? (
        <p className="text-14-black text-center">No posts found.</p>
      ) : (
        userPosts.map((post) => <StartupCard key={post._id} post={post} />)
      )}
    </ul>
  );
};


export default UserPosts;