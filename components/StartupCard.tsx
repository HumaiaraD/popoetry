"use client"
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatDate } from "../lib/utils";
import { Author, Post } from "../sanity.types";


// Map Sanity types to TypeScript for your card
export type StartupTypeCard = Omit<Post, 'author'> & {
  author?: Author | null;
  //categories?: { _id: string; title: string; slug: { current: string } }[];
  body?: { _type: string; children: { text: string }[] }[];
};

interface StartupCardProps {
  post: StartupTypeCard;
}

const StartupCard = ({ post }: StartupCardProps) => {
  const {
    _createdAt,
    author,
    views = 0,
    _id,
    title,
  } = post;

  // fallback category
 //const category = post.categories?.[0]?.title || "Uncategorized";

const getSnippet = (body?: { _type: string; children: { text: string }[] }[]) => {
  if (!body || body.length === 0) return "No description available.";

  // Flatten all text from blocks
  const text = body
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text).join(" "))
    .join(" ");

  return text.length > 100 ? text.slice(0, 100) + "..." : text;
};

const snippet = getSnippet(post.body);


  return (
    <li className="border-6 border-black rounded-2xl p-5 group hover:bg-gray-200 hover:border-gray-300 transition-colors duration-300">
      {/* Header */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-black" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      {/* Author + Title */}
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          {author?._id ? (
            <h1 className="text-md line-clamp-1 hover:underline">
              {author.name || "Anonymous"}
            </h1>
          ) : (
            <p className="text-md line-clamp-1 text-gray-300">Anonymous</p>
          )}

          
            <h3 className="text-[26px] line-clamp-1 font-semibold hover:underline">
              {title}
            </h3>
          
        </div>
      </div>

      {/* Body snippet */}
      <Link href={`/postals/${_id}`}>
        <p className="startup-card_desc line-clamp-2 mt-3 text-gray-700">
          {snippet}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex-between gap-3 mt-5">
        
        <Button className="bg-black text-white hover:bg-slate-600" asChild>
          <Link href={`/postals/${_id}`}>Read poem</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartupCard;
