import { REDIS_URL } from '$env/static/private';
import { createClient } from 'redis';

export const redis = await createClient({
    url: REDIS_URL,
}).connect();
