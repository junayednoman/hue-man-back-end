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
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  parent_id: z.string().optional(),
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
