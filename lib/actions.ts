"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string; // optional, added after creating post
};


const stringToBlockContent = (text: string) => [
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text,
        marks: [],
      },
    ],
  },
];

export const createPost = async (
  state: FormState,
  form: FormData,
  post: string, // markdown content from MDEditor
) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  // Extract form fields
  const { title, category } = Object.fromEntries(form);

  // Generate slug
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const newPost = {
      _type: "post",
      title,
      category,
      body: stringToBlockContent(post), // ✅ convert string to blockContent
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
    };

    // Create the document in Sanity
    const result = await writeClient.create(newPost);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS", // match frontend check
    });
  } catch (error) {
    console.error("Error creating post:", error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
