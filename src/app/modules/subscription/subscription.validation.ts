import { z } from 'zod';

export const subscriptionValidationSchema = z.object({
  package_name: z.enum(['monthly', 'yearly']),
  amount: z.number().positive('Amount must be a positive number'),
});
