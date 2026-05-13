import { defineMiddleware } from "astro:middleware";
import { setDatabaseUrl } from "./db/index";

export const onRequest = defineMiddleware(async (context, next) => {
    /**
     * Cloudflare environment variables can be in several places depending on the 
     * environment (Pages vs Workers) and the adapter version.
     * We check the most likely locations in order.
     */
    const runtimeEnv = (context.locals as any).runtime?.env;
    const platformEnv = (context as any).locals?.netty?.env; // Some older adapters
    const directEnv = (context as any).env; // Standard Workers
    
    const url = runtimeEnv?.DATABASE_URL || platformEnv?.DATABASE_URL || directEnv?.DATABASE_URL;

    if (url) {
        setDatabaseUrl(url);
    }

    return next();
});
