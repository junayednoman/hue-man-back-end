import { z } from "zod";

export const categoryCreateValidationSchema = z.object({
  name: z.string().trim(),
  parent: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId").optional(),
});

export const updateCategoryValidationSchema = z.object({
  name: z.string().trim().optional(),
});

export const createManyCategoriesValidationSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().trim(),
      image: z.string(),
    })
  ),
});