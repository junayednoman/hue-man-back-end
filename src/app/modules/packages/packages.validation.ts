import { z } from 'zod';
import { packageKeys } from './packages.interface';

export const PackageValidationSchema = z.object({
  key: z.enum(packageKeys),
  name: z.string().trim().nonempty('Package name is required'),
  monthly_price: z.number().nonnegative('Monthly price cannot be negative'),
  yearly_price: z.number().nonnegative('Yearly price cannot be negative'),
  sub_user_limit: z.number().int().nonnegative('Sub-user limit cannot be negative'),
  is_active: z.boolean().optional(),
});
