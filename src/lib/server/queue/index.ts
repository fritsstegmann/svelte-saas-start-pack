import { exit } from 'process';
import myJob from './jobs/MyJob';
import type { Job } from './job';
import { redis } from '../redis';

export async function enqueue<T>(job: Job<T>, args: T) {
    const data = {
        name: job.name,
        args: args,
    };
    await redis.lPush('queue:default', [JSON.stringify(data)]);
}

await enqueue(myJob, {
    name: 'test',
});

exit(0);
