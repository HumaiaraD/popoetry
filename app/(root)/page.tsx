import Image from "next/image";
import SearchBar from "../../components/SearchBar";
import StartupCard, { StartupTypeCard } from "../../components/StartupCard";
import { queryAllAuthors } from "../../sanity/lib/queries"; // ✅ update if needed
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export const revalidate = 0; // Always fetch fresh data

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query;
  const params = { search: query || null };

  const session = await auth();
  console.log(session?.user?.id);

  const { data: posts } = await sanityFetch({
    query: queryAllAuthors,
    params,
  });

  return (
    <>
      <section className="pattern black-container">
        <h1 className="text-white text-8xl font-extrabold font-serif">PoPoetry</h1>
        <p className="text-white text-5xl text-center m-4">
          A place where poetry lives like a blog,
          <br />
          and reads like a book.
        </p>

        <p className="sub-heading">Submit your poems to the platform.</p>
        <SearchBar query={query} />
      </section>

      <section className="section-container">
        <p className="text-30-semibold">
          {query ? `Searching for "${query}"` : `All Poems`}
        </p>

        <ul className="mt-7 card-grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="text-center text-20-regular">No poems found.</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
