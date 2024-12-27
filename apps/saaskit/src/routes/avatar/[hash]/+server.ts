import { validateUserSession } from "$lib/server/svelte";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ServerLoadEvent } from "@sveltejs/kit";

export async function GET(event: ServerLoadEvent) {
    validateUserSession(event);

    const client = new S3Client({
        endpoint: "http://127.0.0.1:8333",
    });

    const getObject = new GetObjectCommand({
        Bucket: "avatar",
        Key: event.params.hash,
    });

    const result = await client.send(getObject);

    const bodyData = await result.Body?.transformToByteArray();

    return new Response(bodyData);
}
