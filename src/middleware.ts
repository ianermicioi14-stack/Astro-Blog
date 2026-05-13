import { defineMiddleware } from "astro:middleware";
import { setDatabaseUrl } from "./db/index";

export const onRequest = defineMiddleware(async (context, next) => {
    // In Astro's Cloudflare adapter, environment variables are provided
    // via the runtime object in locals.
    const runtime = (context.locals as any).runtime;
    
    if (runtime?.env?.DATABASE_URL) {
        setDatabaseUrl(runtime.env.DATABASE_URL);
    }

    return next();
});
