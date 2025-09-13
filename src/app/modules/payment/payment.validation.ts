import { z } from "zod";

export const paymentValidationSchema = z.object({
  package_name: z.enum(['monthly', 'yearly', 'single', 'bundle', 'combo']),
  currency: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
})

export const portiaPaymentSchema = z.object({
  price: z
    .number({ invalid_type_error: "price must be a number" })
    .min(0, { message: "price must be >= 0" }),

  payload: z.object({
    name: z.string().min(1, { message: "name is required" }),
    email: z.string().email({ message: "invalid email" }),
    company: z.string().min(1, { message: "company is required" }),
    phone: z
      .string()
      .min(7, { message: "phone is too short" })
      .max(20, { message: "phone is too long" })
      .regex(/^\+?[0-9\- ]+$/, { message: "phone must contain only digits, spaces, dashes and optional leading +" }),
    address: z.string().min(3, { message: "address is required" }),
    quantity: z
      .number({ invalid_type_error: "quantity must be a number" })
      .int({ message: "quantity must be an integer" })
      .min(1, { message: "quantity must be at least 1" }),
  }),
});

export type PortiaPayment = z.infer<typeof portiaPaymentSchema>;
