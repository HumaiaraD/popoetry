import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatDate } from "../lib/utils";
import { Author, Post } from "../sanity.types";

export type StartupTypeCard = Omit<Post, "author"> & { author?: Author };

interface StartupCardProps {
  post: StartupTypeCard;
}

const StartupCard = ({ post }: StartupCardProps) => {
  const {
    _createdAt,
    author,
    views = 0,
    _id,
    body,
    categories = [],
    title = "Untitled",
  } = post;

  // fallback category
  const category = (categories as any)?.[0]?.title || "Uncategorized";

  // get text snippet safely
 // Get first text block

const getSnippet = (body: any) => {
  if (!body) return "No description available.";

  if (typeof body === "string") {
    // If it's a string (Markdown), just take first 100 chars
    return body.slice(0, 100) + (body.length > 100 ? "..." : "");
  }

  if (Array.isArray(body)) {
    // If it's blocks
    const textBlocks = body
      .filter((b) => b._type === "block" && Array.isArray(b.children))
      .map((b) => b.children.map((c: any) => c.text).join(" "))
      .join(" ");

    return textBlocks.slice(0, 100) + (textBlocks.length > 100 ? "..." : "");
  }

  return "No description available.";
};
const snippet = getSnippet(body);

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
        <Link href={`/?query=${category.toLowerCase()}`}>
          <p className="text-16-medium hover:underline">{category}</p>
        </Link>
        <Button className="bg-black text-white hover:bg-slate-600" asChild>
          <Link href={`/postals/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartupCard;
