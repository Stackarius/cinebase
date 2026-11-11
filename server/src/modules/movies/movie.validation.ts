import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});

export const searchMoviesSchema = z.object({
  query: z.string().trim().min(1, "Search query is required"),
  page: z.coerce.number().int().min(1).default(1),
});

export const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});