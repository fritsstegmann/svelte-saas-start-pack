import { createClient } from 'redis';
import fs from 'node:fs';
import type { Job } from './job';

const redis = createClient();

await redis.connect();

const files = fs.readdirSync(__dirname + '/jobs');

const jobs = await Promise.all(
    files.map(async (file) => {
        return (await import(`./jobs/${file}`)).default as Job<unknown>;
    })
);

while (true) {
    const jobRequest = await redis.brPop('queue:default', 3);
    if (jobRequest) {
        const jobData = JSON.parse(jobRequest.element);

        const job: Job<unknown> | undefined = jobs
            .filter((job) => job.name === jobData.name)
            .at(0);

        job?.handler(jobData.args);
    }
}
