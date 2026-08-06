import { z } from 'zod';

export const subscriptionValidationSchema = z.object({
  package_id: z.string().trim().nonempty('Package id is required'),
  billing_interval: z.enum(['monthly', 'yearly']),
  web: z.boolean().optional(),
});
