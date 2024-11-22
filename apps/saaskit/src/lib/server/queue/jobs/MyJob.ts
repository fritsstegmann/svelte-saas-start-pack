import { defineJob } from 'quey';

export default defineJob<{ name: string }>(
    'MyJob',
    async function (p): Promise<void> {
        console.info('running', p.name);
    }
);
