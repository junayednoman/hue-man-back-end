import { z } from 'zod';

export const PackageValidationSchema = z.object({
  package_name: z.enum(['monthly', 'yearly']),
  price: z.number().positive('Price must be a positive number'),
  text: z.string().trim().nonempty('Text is required'),
});
