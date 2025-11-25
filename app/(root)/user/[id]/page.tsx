import React from "react";
import { auth } from "@/auth";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import UserPosts from "@/components/UserPosts";
import { Suspense } from "react";
import StartupCardSkeleton from "@/components/StartupCardSkeleton";

export const dynamic = "force-dynamic"; 

const Page = async ( {params} : {params: {id: string}}) => {

    const id = params.id;
    const session = await auth();

    const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
    if (!user) return <div>User not found</div>;

    const imageUrl = user.image ? urlFor(user.image).width(250).height(250).url() : null;


    return (
        <>
        <section className="flex flex-col items-center justify-center p-4">
            <div className="profilecard">
                <div className="profiletitle">
                    <h3 className="text-18-black uppercase text-center line-clamp-1">
                        {user.name}
                    </h3>
                </div>

 {imageUrl && (
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="profile_image"
          />
        )}
                {/*<div className="profile_bio">
                    <p className="text-14-black text-center line-clamp-3">
                        {user.bio || "No bio available."}
                    </p>
                </div>*/}

                <div className="profile_details">
                    <p className="text-14-black">Username: {user.username}</p>
                    <p className="text-14-black">Email: {user.email}</p>
                </div>
            </div>
            <div className="profile_actions">
                {session?.user?.id === user._id && (
                    <button className="edit_profile_button">
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-5 lg:mt-5">
                <p className="text-30-bold">
                    {session?.id === id ? "Your" : "All"} Posts
                </p>
                <ul className="flex flex-col gap-5">
                    <Suspense fallback={<StartupCardSkeleton />}>
                    <UserPosts id={id} />
                    </Suspense>
                </ul>
            </div>
        </section>
        </>
    )
}

export default Page;