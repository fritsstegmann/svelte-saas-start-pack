import { exit } from 'process';
import { enqueue } from 'quey';
import { driver } from './redisDriver';
import myJob from './jobs/MyJob';

await enqueue(driver, myJob, {
    name: 'my name',
});

exit(0);
