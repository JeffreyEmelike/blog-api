import { z } from "zod";

export const createCommentsSchem = z.object({
  body: z.string().min(1, "Comment body is required").max(1000),
});
