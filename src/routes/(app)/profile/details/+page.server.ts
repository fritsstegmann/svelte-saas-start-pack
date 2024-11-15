import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userProfilesTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import validate from '$lib/server/middleware/validate';
import { validateUserSession } from '$lib/server/svelte';

export const load: PageServerLoad = async ({ locals, url }) => {
    const { user } = validateUserSession({ locals, url });

    const profile = (
        await db
            .select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.userId, user.id))
    ).at(0);

    return {
        user,
        profile,
    };
};

export const actions: Actions = {
    uploadAvatar: async ({ request, locals, url }) => {
        const { user } = validateUserSession({ locals, url });

        const v = await validate(z.object({}), request);

        if (!v.isOk) {
            return v.error;
        }

        const avatar = v.files['avatar'] as File;

        const bytes = new Uint8Array(await avatar.arrayBuffer());

        const hash = createHash('sha256');
        hash.update(bytes);
        const hashResult = hash.digest('hex');

        const client = new S3Client({
            endpoint: 'http://127.0.0.1:8333',
        });

        const putObject = new PutObjectCommand({
            Bucket: 'avatar',
            Key: hashResult,
            Body: bytes,
        });

        await client.send(putObject);

        await db
            .update(userProfilesTable)
            .set({
                avatar: 'avatar/' + hashResult,
            })
            .where(eq(userProfilesTable.userId, user.id));
    },
    updateProfile: async ({ request, locals, url }) => {
        const { user } = validateUserSession({ locals, url });

        const v = await validate(
            z.object({
                name: z.string().min(1).max(256),
            }),
            request
        );

        if (!v.isOk) {
            return v.error;
        }

        await db
            .update(userProfilesTable)
            .set({
                name: v.fields.name,
            })
            .where(eq(userProfilesTable.userId, user.id));

        return {
            message: {
                type: 'success',
                message: 'Successfully updated profile',
            } as { type: string; message: string } | undefined,
        };
    },
};