import { z } from 'zod';

const ApplicationValidationSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email_address: z.string().email('Invalid email address').min(1, 'Email is required'),
  about_yourself: z.string().min(1, 'About yourself is required'),
  promotion_methods: z.object({
    social_media: z.boolean(),
    blogs_or_newsletters: z.boolean(),
    professional_events: z.boolean(),
    other: z.string().optional(),
  }),
  payout_method: z.enum(['PayPal', 'Bank Transfer']),
  currently_using_hue_man: z.boolean(),
});

export default ApplicationValidationSchema;