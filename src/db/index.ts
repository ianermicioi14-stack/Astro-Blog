import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: any = null;
let _runtimeUrl: string | null = null;

/**
 * Sets the database URL at runtime. 
 * This is called by middleware to pass Cloudflare environment variables.
 */
export function setDatabaseUrl(url: string) {
    _runtimeUrl = url;
}

function initDb() {
    if (_db) return _db;

    // Priority: 1. Runtime URL (Cloudflare), 2. Meta Env (Dev), 3. Process Env
    const databaseUrl = _runtimeUrl || import.meta.env?.DATABASE_URL || process?.env?.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing. Please set it in your Cloudflare dashboard, .dev.vars, or .env file.");
    }

    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
    return _db;
}

// Export a proxy that initializes the database on the first property access.
export const db = new Proxy({} as any, {
    get(_, prop) {
        const instance = initDb();
        return instance[prop];
    }
});