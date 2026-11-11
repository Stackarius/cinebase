import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Neon exposes a pooled URL for the app and a direct URL for migrations.
    // Prefer DIRECT_URL for Prisma Migrate/introspection when it is set.
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});
