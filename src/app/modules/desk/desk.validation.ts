import { z } from "zod";

const zodObjectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId format');

export const deskValidationSchema = z.object({
  card: zodObjectId,
  user: zodObjectId,
  index: z.number(),
});