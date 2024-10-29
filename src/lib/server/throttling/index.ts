import { redis } from '../redis';
import { THROTTLING_SHA } from '$env/static/private';

export class Throttler {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    public async consume(key: string): Promise<boolean> {
        const result: { [key: number]: string } = (await redis.EVALSHA(
            THROTTLING_SHA,
            {
                keys: [`${this.storageKey}:${key}`],
                arguments: [Math.floor(Date.now() / 1000).toString()],
            }
        )) as { [key: number]: string };

        if (result && result[0]) {
            return Boolean(result[0]);
        } else {
            return false;
        }
    }

    public async reset(key: string): Promise<void> {
        await redis.DEL(key);
    }
}
