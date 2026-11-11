import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {env} from "./index"

const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({
    adapter,
})