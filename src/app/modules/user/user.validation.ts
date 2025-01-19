import { z } from "zod";

export const userSignupValidationSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(7, "Password must be at least 7 characters long"),
});

export const userProfileUpdateValidationSchema = z.object({
  profile_image: z.string().optional(),
  cover_image: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  age: z.number().optional(),
  category: z.string().optional(),
  pet_info: z.string().optional(),
  owner_name: z.string().optional(),
  owner_profile_picture: z.string().optional(),
  user_type: z.enum(["subscriber", "unsubscriber"]).optional(),
  owner_relationship: z
    .enum(["single", "married", "divorced", "widowed", "other"])
    .optional(),
  owner_gender: z.enum(["male", "female", "other"]).optional(),
  owner_email: z.string().email().optional(),
  is_deleted: z.boolean().optional(),
  is_blocked: z.boolean().optional(),
});

export type TUserProfile = z.infer<typeof userProfileUpdateValidationSchema>;

export type TSignUp = z.infer<typeof userSignupValidationSchema>;
