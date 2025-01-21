import { z } from "zod";

export const termsValidationSchema = z.object({
  text: z.string().trim().nonempty("Terms text is required"),
});