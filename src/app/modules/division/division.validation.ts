import * as z from "zod";

const createDivisionZodSchema = z.object({
  name: z
    .string()
    .min(2, "division name must be at least 2 characters")
    .max(100, "division name cannot exceed 100 characters")
    .trim(),
  thumbnail: z.string().optional(),
  description: z
    .string()
    .max(500, "description cannot exceed 500 characters")
    .trim()
    .optional(),
});

const updateDivisionSchema = z.object({
    name: z.string().min(1).optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
});



export const divisionValidation = {
  createDivisionZodSchema,updateDivisionSchema
};
