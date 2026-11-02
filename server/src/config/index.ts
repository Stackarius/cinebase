/**
 * copyright (c) 2026 Stackrius
 * @license Apache-2.0
*/

/**
 * Node Modules
 */

import dotenv from "dotenv";
import {z} from "zod"

dotenv.config();

const commonSchema = z.object({
    PORT: z.string().optional(),
    NODE_ENV: z.string().optional(),
    DATABASE_URL: z.string(),
    TMDB_ACCESS_TOKEN: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
});

export const env = commonSchema.parse(process.env);
