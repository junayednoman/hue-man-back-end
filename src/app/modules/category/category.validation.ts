import { z } from "zod";

export const categoryCreateValidationSchema = z.object({
  name: z.string().trim(),
  parent: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId").optional(),
  index: z.number(),
});

export const updateCategoryValidationSchema = z.object({
  name: z.string().trim().optional(),
  index: z.number().optional(),
});

export const createManyCategoriesValidationSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().trim(),
      image: z.string(),
    })
  ),
});