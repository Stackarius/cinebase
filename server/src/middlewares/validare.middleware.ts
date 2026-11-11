import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (
  schema: z.ZodType,
  source: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input =
      source === "query" ? req.query : source === "params" ? req.params : req.body;
    const result = schema.safeParse(input);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const localName =
      source === "query"
        ? "validatedQuery"
        : source === "params"
          ? "validatedParams"
          : "validatedBody";
    res.locals[localName] = result.data;

    next();
  };
};