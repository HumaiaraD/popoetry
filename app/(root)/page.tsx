import SearchBar from "../../components/SearchBar";
import StartupCard, { StartupTypeCard } from "../../components/StartupCard";
import { queryAllAuthors } from "../../sanity/lib/queries";
import { auth } from "@/auth";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {

  // get query from search params
  const query = searchParams?.query || null;
  const sanityParams = { search: query };

  // async calls
  const session = await auth();

  console.log(session?.id);

  const { data: posts } = await sanityFetch({
    query: queryAllAuthors,
    params: sanityParams,
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
        <SearchBar query={Array.isArray(query) ? query[0] : (query ?? "")} />
      </section>

      <section className="section-container">
        <p className="text-30-semibold">
          {query ? `Searching for "${query}"` : `All Poems`}
        </p>

        <ul className="mt-7 card-grid">
          {posts.length > 0 ? (
            posts.map((post: StartupTypeCard) => <StartupCard key={post._id} post={post} />)
          ) : (
            <li className="text-center text-20-regular">No poems found.</li>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
