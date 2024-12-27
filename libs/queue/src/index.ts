import fs from "node:fs";

export function defineJob<T>(name: string, handler: (a: T) => Promise<void>) {
    return {
        name,
        handler,
    };
}

export type Job<T> = ReturnType<typeof defineJob<T>>;

export type QueueDriver = {
    enqueue(queueName: string, data: string): Promise<number>;
    fetch(queueName: string): Promise<string | null>;
};

const defaultQueueName = "default";

export async function enqueue<T>(driver: QueueDriver, job: Job<T>, args: T) {
    const data = {
        name: job.name,
        args: args,
    };
    return driver.enqueue(defaultQueueName, JSON.stringify(data));
}

export async function worker(driver: QueueDriver, directory: string) {
    const jobsDir = `${directory}/jobs`;

    const files = fs.readdirSync(jobsDir);

    const jobs = await Promise.all(
        files.map(async (file) => {
            return (await import(`${directory}/jobs/${file}`))
                .default as Job<unknown>;
        }),
    );

    setInterval(async () => {
        const jobRequest = await driver.fetch(defaultQueueName);
        if (jobRequest) {
            const jobData = JSON.parse(jobRequest);

            const job: Job<unknown> | undefined = jobs
                .filter((job) => job.name === jobData.name)
                .at(0);

            job?.handler(jobData.args);
        }
    }, 3000);
}
