import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_BY_SLUG_QUERY, POST_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import View from "@/components/View";
import MarkdownIt from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryType } from "@/sanity/schemaTypes/categoryType";
import { StartupTypeCard } from "@/components/StartupCard";
import StartupCard from "@/components/StartupCard";

// Initialize markdown-it once (server-side)
const md = new MarkdownIt();

const getBodyString = (body: any) => {
  if (!body) return "";

  if (typeof body === "string") return body;

  if (Array.isArray(body)) {
    // Join all block children text
    return body
      .filter((b) => b._type === "block" && Array.isArray(b.children))
      .map((b) => b.children.map((c: any) => c.text).join(" "))
      .join("\n");
  }

  return "";
};

export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [ post, { select: poemOfTheDay}] = await Promise.all([
            client.fetch(POST_BY_ID_QUERY, { id }),
                  client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "poem-of-the-day" }),
  ])


  //  Fetch post from Sanity
  if (!post) return notFound();

  //  Render markdown (server-side)
  const parsedContent = md.render(getBodyString(post.body));
  return (
    <>
      {/* Header section */}
      <main className="min-h-screen">
      <section className=" pattern black-container">
        <h1 className="text-6xl font-bold text-white text-center">"{post.title}"</h1>
        <p className="text-white p-6">{post.author?.name}</p>
        <p className="text-white">{formatDate(post?._createdAt)}</p>
      </section>

      {/* Body section */}
      <section className="min-h-screen">
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          {/* Author info */}
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >

              <div>
                <p className="text-20-medium font-italic">{post.title}</p>
                <p className="text-20-medium font-italic">{post.author?.name}</p>
                <p className="text-16-medium text-gray-600">
                  @{post.author?.name}
                </p>
              </div>
            </Link>

            
         <div className="category-tag">
          <div>
            {post.categories?.[0]?.title || "Uncategorized"}
          </div>
        </div>

                  </div>


          {/* ✅ Client-side View counter (wrapped in Suspense) */}
          <Suspense fallback={<Skeleton className="view_skeleton" />}>
            <View id={id} />
          </Suspense>

          {/* ✅ Server-rendered Markdown body */}
          <div
            className="prose prose-invert whitespace-pre-line leading-relaxed mt-6"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          /></div>


          <hr className="divider" />

      {poemOfTheDay && (
        <div className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-2xl text-center font-bold mb-4">Best of Poetry</h2>
          <ul>
            {poemOfTheDay.map((poem: StartupTypeCard) => (
              <li key={poem._id} className="mt-7 w-80 h-5 mb-6">
                <StartupCard post={poem} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <br />
      <br />
      </section>
      </main>

      
    </>
  );
};

export default Page;
