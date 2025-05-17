import { z } from 'zod';

export const subscriptionValidationSchema = z.object({
  package_name: z.string().trim().nonempty('Package name is required'),
  amount: z.number().positive('Amount must be a positive number'),
  duration: z.number().positive('Duration must be a positive number'),
  web: z.boolean().optional(),
});
