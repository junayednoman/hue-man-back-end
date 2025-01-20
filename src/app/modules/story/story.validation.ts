import { z } from 'zod';

const slideValidationSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Description is required'),
});

const storyValidationSchema = z.array(
  z.object({
    image: z.string().min(1, 'Image is required'),
    title: z.string().min(1, 'Title is required'),
    slides: z.array(slideValidationSchema).min(1, 'At least one slide is required'),
  })
);

export { slideValidationSchema, storyValidationSchema };
