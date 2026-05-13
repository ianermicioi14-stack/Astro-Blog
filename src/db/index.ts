import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: any = null;

function initDb() {
    if (_db) return _db;

    const databaseUrl = import.meta.env?.DATABASE_URL || process?.env?.DATABASE_URL;

    console.log("Initializing database... URL present:", !!databaseUrl);

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is missing. Please set it in your Cloudflare dashboard or .env file.");
    }

    const sql = neon(databaseUrl);
    _db = drizzle(sql, { schema });
    return _db;
}

// Export a proxy that initializes the database on the first property access.
// This prevents the application from crashing on load if the environment variable is missing,
// as long as the database isn't actually used during the GET request.
export const db = new Proxy({} as any, {
    get(_, prop) {
        const instance = initDb();
        return instance[prop];
    }
});

console.log("⚡ Database module loaded (lazy-init ready)");