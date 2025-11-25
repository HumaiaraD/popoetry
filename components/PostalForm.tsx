"use client";

import React, { useState, useActionState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Send } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { formSchema } from "@/lib/validation";
import { createPost } from "@/lib/actions";
import { toast } from "sonner";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
};


const PostalForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [post, setPost] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      // Use state for MDEditor content
      formData.set("post", post);

      const formValues = {
        title: formData.get("title") as string,
        post: formData.get("post") as string, 
        category: formData.get("category") as string,
      };

      // Validate using Zod
      await formSchema.parseAsync(formValues);

      // Call your createPost action
      const result = await createPost(prevState, formData, post);

      if (result.status === "SUCCESS") {
        toast(
          <div>
            <strong>Success</strong>
            <p>Your post has been created successfully</p>
          </div>
        );

        router.push(`/postals/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        // Map errors to strings
      setErrors(
        Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(", ") : "",
        ])
      ))

        toast(
          <div>
            <strong>Error</strong>
            <p>Please check your inputs and try again.</p>
          </div>
        );

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast(
          <div>
            <strong>Error</strong>
            <p>An unexpected error has occured.</p>
          </div>
        );

      return { ...prevState, error: "Unexpected error", status: "ERROR" };
    }
  };

  const [_, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="max-w-2xl mx-auto bg-white my-10 space-y-8 px-6">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Poem Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Category (Tech, Health, Education...)"
        />
        {errors.category && <p className="startup-form_error">{errors.category}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="post" className="startup-form_label">
          Body
        </label>
        <MDEditor
          value={post}
          onChange={(value) => setPost(value || "")}
          id="post"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Write your poem here...",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.post && <p className="startup-form_error">{errors.post}</p>}
      </div>

      <Button type="submit" className="bg-black rounded-full p-5 min-h-[70px] w-full font-bold text-white text-[18px]" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Your Poem"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default PostalForm;
