import type { QueueDriver } from 'quey';
import { createClient } from 'redis';
const redis = createClient();

await redis.connect();

export const driver = {
    enqueue: async (queueName: string, data: string) => {
        return await redis.lPush(`queue:${queueName}`, [data]);
    },
    fetch: async (queueName: string): Promise<string | null> => {
        return redis.rPop(`queue:${queueName}`);
    },
} satisfies QueueDriver;
