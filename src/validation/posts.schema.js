import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  body: z.string().trim().min(1, "body is required"),
  status: z.enum(["draft", "public"]).optional(),
});
