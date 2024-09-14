import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { redirect } from '@sveltejs/kit';

export async function GET(event) {
    if (!event.locals.user) {
        redirect(302, '/signin');
    }

    const client = new S3Client({
        endpoint: 'http://127.0.0.1:8333',
    });

    const getObject = new GetObjectCommand({
        Bucket: 'avatar',
        Key: event.params.hash,
    });

    const result = await client.send(getObject);

    const bodyData = await result.Body?.transformToByteArray();

    return new Response(bodyData);
}
