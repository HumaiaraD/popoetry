import { defineLive } from "next-sanity/live";
import { client } from './client';

export const { sanityFetch: _sanityFetch, SanityLive } = defineLive({
  client,
});

// Wrap to make generic type more flexible
export async function sanityFetch<T = any>(args: Parameters<typeof _sanityFetch>[0]): Promise<{ data: T }> {
  const result = await _sanityFetch(args);
  return result as { data: T };
}
