import { RedisClientType, createClient } from "redis";

const globalClient = global as unknown as {redis: RedisClientType};

const param = {
    password: process.env.REDIS_PASSWORD!,
    url: `redis://${process.env.REDIS_ENDPOINT}`
}

if (process.env.NODE_ENV !== "production") {
    globalClient.redis = createClient(param);
}

let redis = globalClient.redis || createClient(param);

const initRedis = async () => {
    if (!redis) {
        redis = createClient(param);
    }
    if (!redis.isReady) {
        await redis.connect();
    }
    return redis;
}

export default initRedis;