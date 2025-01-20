import { z } from "zod";

export const userSignupValidationSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(7, "Password must be at least 7 characters long"),
});

// Zod Validation Schema
export const userUpdateValidationSchema = z.object({
  name: z.string().trim().optional(),
  age: z.number().nullable().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).nullable().optional(),
  is_deleted: z.boolean().optional().optional(),
  is_blocked: z.boolean().optional().optional(),
});

module.exports.userSchemaZod = userUpdateValidationSchema;

export type TUserProfileUpdate = z.infer<typeof userUpdateValidationSchema>;

export type TSignUp = z.infer<typeof userSignupValidationSchema>;
