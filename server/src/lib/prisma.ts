import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // make sure .env has this
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
