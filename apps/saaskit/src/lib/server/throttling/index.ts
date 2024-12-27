import { THROTTLING_SHA } from "$env/static/private";
import { redis } from "../redis";

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
            },
        )) as { [key: number]: string };

        return result && result[0] !== undefined ? Boolean(result[0]) : false;
    }

    public async reset(key: string): Promise<void> {
        await redis.DEL(key);
    }
}
