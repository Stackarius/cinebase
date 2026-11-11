import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Provide at least one field to update",
  }
);