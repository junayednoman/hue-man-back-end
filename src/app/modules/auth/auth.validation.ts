import { z } from 'zod';

export const loginUserValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
password: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export const emailValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
  otp: z.string().nonempty("OTP is required"),
  verify_email: z.boolean().optional(),
});

export const resetForgottenPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .nonempty("Email is required"),
password: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export const createNewPasswordValidationSchema = z.object({
  oldPassword: z.string().nonempty("Old Password is required"),
  newPassword: z
    .string()
    .min(7, "Password must be at least 7 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
