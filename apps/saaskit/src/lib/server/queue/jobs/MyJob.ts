import { defineJob } from "quey";

export default defineJob<{ name: string }>(
    "MyJob",
    async (p): Promise<void> => {
        console.info("running", p.name);
    },
);
