import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { POST_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import View from "@/components/View";
import MarkdownIt from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";



// Initialize markdown-it once (server-side)
const md = new MarkdownIt();

type SanityBody = (PortableTextBlock | Record<string, unknown>)[] | string | undefined;

type PortableTextBlock = {
  _type: string;
  children?: { _type: string; text: string }[];
};


// Helper to convert Sanity Portable Text body to plain string
const getBodyString = (body: SanityBody): string => {
  if (!body) return "";

  if (typeof body === "string") return body;

  if (!Array.isArray(body)) return "";

   return body
    .filter((b): b is PortableTextBlock => b._type === "block" && Array.isArray(b.children))
    .map((b) =>
      b.children
        ?.map((c) => c.text) // extract text safely
        .filter(Boolean)      // remove empty strings or undefined
        .join(" ") ?? ""      // join children text
    )
    .filter(Boolean)          // remove empty blocks
    .join("\n");              // join blocks with line breaks
};


export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch post and playlist in parallel
 const post = await client.fetch(POST_BY_ID_QUERY, { id });


  if (!post) return notFound();

  // Map playlist items to StartupTypeCard
 

  // Render post body as HTML
const bodyString = getBodyString(post.body ?? "");
const parsedContent = md.render(bodyString);


  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="pattern black-container py-10 text-center">
        <h1 className="text-6xl font-bold text-white">{post.title}</h1>
        <p className="text-white mt-4">{post.author?.name}</p>
        <p className="text-white">{formatDate(post._createdAt)}</p>
      </section>

      {/* Body */}
      <section className="min-h-screen py-10">
        <div className="space-y-5 max-w-4xl mx-auto">
          {/* Author info */}
          <div className="flex-between gap-5">
            <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
              <div>
                <p className="text-20-medium font-italic">{post.title}</p>
                <p className="text-20-medium font-italic">{post.author?.name}</p>
                <p className="text-16-medium text-gray-600">@{post.author?.name}</p>
              </div>
            </Link>

            {/* Category */}
            <div className="category-tag">
              {post.categories?.[0] || "Uncategorized"}
            </div>
          </div>

          {/* Client-side View counter */}
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id= {id} />
          </Suspense>

          {/* Server-rendered Markdown body */}
          <div
            className="prose prose-invert whitespace-pre-line leading-relaxed mt-6"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        </div>


        {/* Poem of the Day */}
       {/* {poemOfTheDay.length > 0 && (
          <div className="flex flex-col items-center justify-center mt-10">
            <h2 className="text-2xl text-center font-bold mb-4">Best of Poetry</h2>
            <ul>
              {poemOfTheDay.map((poem) => (
                <li key={poem._id} className="mt-7 w-80 h-5 mb-6">
                  <StartupCard post={poem} />
                </li>
              ))}
            </ul>
          </div>
        )}*/}
      </section>
    </main>
  );
};

export default Page;
