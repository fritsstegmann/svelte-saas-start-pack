import { createClient } from 'redis';
const redis = createClient();

await redis.connect();

export const driver = {
    enqueue: async (queueName: string, data: string) => {
        return await redis.lPush(queueName, [data]);
    },
    fetch: async (): Promise<string | null> => {
        return redis.rPop('queue:default');
    },
};
