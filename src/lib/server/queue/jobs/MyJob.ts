import { defineJob } from '../job';

export default defineJob<{ name: string }>(
    'MyJob',
    async function (p): Promise<void> {
        console.info('running', p.name);
    }
);
