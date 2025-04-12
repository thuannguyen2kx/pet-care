// src/validation/service.validation.ts
import { z } from "zod";
import { Specialty } from "../enums/employee.enum";

// Schema for validating service ID
export const serviceIdSchema = z
  .string({
    required_error: "Service ID is required",
    invalid_type_error: "Service ID must be a string",
  })
  .min(1, "Service ID cannot be empty");

// Schema for creating a new service
export const createServiceSchema = z.object({
  name: z
    .string({ required_error: "Service name is required" })
    .min(3, "Service name must be at least 3 characters"),

  description: z.string().optional(),

  price: z
    .coerce.number({ required_error: "Price is required" })
    .min(0, "Price must be a positive number or zero"),

  duration: z
    .coerce.number({ required_error: "Duration is required" })
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 minute"),

  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category cannot be empty"),

  applicablePetTypes: z.array(z.string()).optional(),

  applicablePetSizes: z.array(z.string()).optional(),

  images: z.array(z.string().url("Each image must be a valid URL")).optional(),

  isActive: z.coerce.boolean().optional().default(true),
});

// Schema for updating an existing service
export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(3, "Service name must be at least 3 characters")
    .optional(),

  description: z.string().optional(),

  price: z
    .number()
    .min(0, "Price must be a positive number or zero")
    .optional(),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 minute")
    .optional(),

  category: z.nativeEnum(Specialty).optional(),

  applicablePetTypes: z.array(z.string()).optional(),

  applicablePetSizes: z.array(z.string()).optional(),

  images: z
    .array(
      z.object({
        url: z.string().url("Each image must be a valid URL"),
        publicId: z.string(),
      })
    )
    .optional(),

  isActive: z.boolean().optional(),
});