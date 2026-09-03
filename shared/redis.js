import { Redis } from "@upstash/redis";
let _redis = null;
export function getRedis() {
    if (!_redis) {
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (!redisUrl || !redisToken) {
            throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in environment");
        }
        _redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });
    }
    return _redis;
}
export async function pingRedis() {
    try {
        const result = await getRedis().ping();
        return result === "PONG";
    }
    catch {
        return false;
    }
}
// Backward compatibility - lazy getter
export const redis = new Proxy({}, {
    get(target, prop) {
        return getRedis()[prop];
    }
});
