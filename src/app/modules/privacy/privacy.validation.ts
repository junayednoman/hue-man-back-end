import { z } from "zod";

export const privacyValidationSchema = z.object({
  text: z.string().trim().nonempty("Privacy text is required"),
});