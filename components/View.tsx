import "server-only";


import React from "react";
import Ping from "./Ping";
import { POST_VIEWS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/env";
import { writeClient } from "@/sanity/lib/write-client"
import { after } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;


interface PostViews {
    _id: string,
    views: number,
}

const View = async ({ id }: { id: string }) => {
  const { views: totalViews = 0 } = await client
    .withConfig({ useCdn: false })
    .fetch<PostViews>(POST_VIEWS_QUERY, { id });

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit(),
  );

    return (
        <>
            <div className="view-container">
                <div className="absolute top-2 right-2">
                    <Ping />
                </div>

                <p className="view-text text-black">
                    <span className="text-black"> Views :{totalViews} </span>
                </p>
            </div>
        </>
    )
}

export default View;