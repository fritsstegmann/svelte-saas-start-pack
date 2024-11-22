import { redis } from '../redis';
import { RATE_LIMIT_SHA } from '$env/static/private';

export class TokenBucket {
    private storageKey: string;

    public max: number;
    public refillIntervalSeconds: number;

    constructor(
        storageKey: string,
        max: number,
        refillIntervalSeconds: number
    ) {
        this.storageKey = storageKey;
        this.max = max;
        this.refillIntervalSeconds = refillIntervalSeconds;
    }

    public async consume(key: string, cost: number): Promise<boolean> {
        const result: { [key: number]: string } = (await redis.EVALSHA(
            RATE_LIMIT_SHA,
            {
                keys: [`${this.storageKey}:${key}`],
                arguments: [
                    this.max.toString(),
                    this.refillIntervalSeconds.toString(),
                    cost.toString(),
                    Math.floor(Date.now() / 1000).toString(),
                ],
            }
        )) as { [key: number]: string };

        if (result && result[0]) {
            return Boolean(result[0]);
        } else {
            return false;
        }
    }
}
