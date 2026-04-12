import * as z from "zod";
import { IsActive, Role } from "./user.interface";

// Reusable schema components
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one digit")
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    "Must contain at least one special character",
  );

const phoneSchema = z
  .string()
  .regex(
    /^(?:\+88)?01[3-9]\d{8}$/,
    "Must be a valid Bangladeshi number (e.g., 01712345678)",
  )
  .optional();

// User validation schemas
const createUserZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z.string().toLowerCase().trim(), // if you still want email validation, see note below

  password: passwordSchema,

  phone: phoneSchema,

  address: z
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .trim()
    .optional(),
});

const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .optional(),

  // password: passwordSchema.optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z.string().optional(),
  phone: phoneSchema.optional(),

  address: z
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .trim()
    .optional(),
});

const changePasswordZodSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: passwordSchema,
});

export const userValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  resetPasswordZodSchema, changePasswordZodSchema
};
