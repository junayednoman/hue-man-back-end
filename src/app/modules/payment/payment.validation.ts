import { z } from "zod";

export const paymentValidationSchema = z.object({
  package_name: z.enum(['monthly', 'yearly', 'single', 'bundle', 'combo']),
  currency: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
})