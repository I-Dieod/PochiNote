// src/lib/config/redisClient.ts

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not defined in environment variables");
}

export const redisClient = createClient({
    url: redisUrl,
});

(async () => {
    try {
        await redisClient.connect();
        console.log(`Connected to Redis at ${redisUrl}`);
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();