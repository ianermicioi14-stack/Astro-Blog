import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = import.meta.env?.DATABASE_URL || process?.env?.DATABASE_URL;

if (!databaseUrl) {
    // In production Cloudflare Workers, environment variables are often on the context,
    // but Astro's cloudflare adapter should populate process.env if configured.
    // We throw a more descriptive error.
    throw new Error("DATABASE_URL is missing. Please set it in your Cloudflare dashboard or .env file.");
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

console.log("⚡ Database initialized");