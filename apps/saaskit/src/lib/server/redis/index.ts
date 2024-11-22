import { createClient } from 'redis';

export const redis = await createClient({
    url: import.meta.env.REDIS_URL,
}).connect();
