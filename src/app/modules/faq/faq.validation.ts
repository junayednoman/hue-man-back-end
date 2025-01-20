import { z } from "zod";

export const faqValidationSchema = z.object({
  question: z
    .string()
    .trim()
    .nonempty("Question is required"),
  answer: z
    .string()
    .trim()
    .nonempty("Answer is required"),
})