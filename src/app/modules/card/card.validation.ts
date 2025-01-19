import { z } from "zod";

export const CardValidationSchema = z.object({
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId"), // ObjectId validation
  name: z.string().trim().min(1, "Name is required"),
  image: z.string().url("Invalid image URL"), // Ensures it's a valid URL
  audio: z.string().url("Invalid audio URL"), // Ensures it's a valid URL
});