import { z } from "zod";

const subscriptionPaymentSchema = z.object({
  package_id: z.string().trim().nonempty("Package id is required"),
  billing_interval: z.enum(["monthly", "yearly"]),
  currency: z.string().trim().length(3).optional(),
  web: z.boolean().optional(),
});

const productPaymentSchema = z.object({
  package_name: z.enum(["single", "bundle", "combo"]),
  currency: z.string().trim().length(3).optional(),
  price: z.number().positive("Price must be a positive number"),
  web: z.boolean().optional(),
  address: z.record(z.unknown()).optional(),
});

export const paymentValidationSchema = z.union([
  subscriptionPaymentSchema,
  productPaymentSchema,
]);

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
