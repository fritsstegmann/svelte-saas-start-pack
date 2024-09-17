import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userProfilesTable, usersTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import validate from '$lib/server/middleware/validate';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, '/signin');

    const profile = (
        await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, event.locals.user.id))
    ).at(0);

    return {
        user: event.locals.user,
        profile,
    };
};

export const actions: Actions = {
    uploadAvatar: async ({ request, locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

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
            .where(eq(userProfilesTable.userId, locals.user.id));
    },
    updatePassword: async ({ request, locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const v = await validate(
            z
                .object({
                    oldPassword: z.string().min(10),
                    newPassword: z.string().min(10),
                    confirmPassword: z.string().min(10),
                })
                .superRefine(({ confirmPassword, newPassword }, ctx) => {
                    if (confirmPassword !== newPassword) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['newPassword'],
                            message: 'The passwords did not match',
                        });
                    }
                }),
            request
        );

        if (v.isOk == false) {
            return v.error;
        }

        const existingUser = (await db.select().from(usersTable).where(eq(usersTable.id, locals.user.id))).at(0);

        if (!existingUser) {
            redirect(307, '/signout');
        }

        const validPassword = await verify(existingUser?.password ?? '', v.fields.oldPassword, {
            memoryCost: 39456,
            timeCost: 6,
            outputLen: 32,
            parallelism: 1,
        });

        if (!validPassword) {
            return fail(400, {
                errors: {
                    oldPassword: ['Invalid password'],
                },
                fields: v.fields,
            });
        }

        const newPassword = await hash(v.fields.newPassword, {
            memoryCost: 39456,
            timeCost: 6,
            outputLen: 32,
            parallelism: 1,
        });

        await db
            .update(usersTable)
            .set({
                password: newPassword,
            })
            .where(eq(usersTable.id, locals.user.id));

        return {
            message: {
                type: 'success',
                message: 'Successfully updated password',
            } as { type: string; message: string } | undefined,
        };
    },
    updateProfile: async ({ request, locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const v = await validate(
            z.object({
                name: z.string(),
                email: z.string(),
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
                email: v.fields.email,
            })
            .where(eq(userProfilesTable.userId, locals.user.id));

        return {
            message: {
                type: 'success',
                message: 'Successfully updated profile',
            } as { type: string; message: string } | undefined,
        };
    },
};
