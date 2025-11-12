import React from "react";
import { client } from "@/sanity/lib/client";
import { POST_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import StartupCard, { StartupTypeCard } from "./StartupCard";

const UserPosts = async ({ id }: { id: string }) => {

    const userPosts = await client.fetch(POST_BY_AUTHOR_QUERY, { id });
    return (
        <>
            {userPosts.length === 0 ? (
                <p className="text-14-black text-center">No posts found.</p>
            ) : (
                userPosts.map((post: StartupTypeCard) => (
                    <StartupCard
                        key={post._id}
                        post={post}
                    />
                ))                                              
            )}
        </>
    )
}

export default UserPosts;

{/*{post.mainImage && (
                            <img
                                src={urlFor(post.mainImage).width(400).height(250).url()}
                                alt={post.title}
                                className="post_image"
                            />
                        )}*/}