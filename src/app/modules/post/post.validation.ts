import { z } from "zod";

export const createPostValidationSchema = z.object({
  location: z.string().trim().min(1, "Location is required"), // Non-empty string
  category: z.string().min(1, "Category ID is required"), // ObjectId as string
  caption: z.string().trim().optional().nullable(), // Optional and nullable
  author: z.string().min(1, "Author ID is required"), // ObjectId as string
});
