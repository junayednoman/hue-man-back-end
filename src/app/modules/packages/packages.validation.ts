import { z } from 'zod';

export const PackageValidationSchema = z.object({
  package_name: z.string().trim().nonempty('Package name is required'),
  price: z.number().positive('Price must be a positive number'),
  text: z.string().trim().nonempty('Text is required'),
  duration: z.number().positive('Duration must be a positive number'),
});
