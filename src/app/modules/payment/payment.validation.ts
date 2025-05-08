import { z } from "zod";

export const paymentValidationSchema = z.object({
  package_name: z.string().trim().nonempty('Package name is required'),
  currency: z.string().optional(),
})