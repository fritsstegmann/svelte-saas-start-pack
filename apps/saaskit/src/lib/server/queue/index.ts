import { exit } from "node:process";
import { enqueue } from "quey";
import myJob from "./jobs/MyJob";
import { driver } from "./redisDriver";

await enqueue(driver, myJob, {
    name: "my name",
});

exit(0);
