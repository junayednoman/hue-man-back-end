import { z } from "zod";

export const categoryCreateValidationSchema = z.object({
  name: z.string().trim(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateCategoryValidationSchema = z.object({
  name: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
