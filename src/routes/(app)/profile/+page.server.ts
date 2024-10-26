import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { emailValidationTable, userProfilesTable, usersTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createHash } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import validate from '$lib/server/middleware/validate';
import { sendEmailVerificationCode } from '$lib/server/security/verifyEmail';
import { generateHashFromCode as generateHashFromCode, hashPassword, verifyPassword } from '$lib/server/security/utils';

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
    verifyEmail: async ({ request, locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const profile = (
            await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, locals.user.id))
        ).at(0);

        if (profile) {
            const v = await validate(
                z.object({
                    code: z.string().min(6),
                }),
                request
            );

            if (v.isOk) {
                const hashedCode = generateHashFromCode(v.fields.code);

                const verifyEmail = (
                    await db.select().from(emailValidationTable).where(eq(emailValidationTable.code, hashedCode))
                ).at(0);

                if (verifyEmail) {
                    await db
                        .update(userProfilesTable)
                        .set({
                            emailVerified: true,
                        })
                        .where(eq(userProfilesTable.id, profile.id));

                    await db.delete(emailValidationTable).where(eq(emailValidationTable.id, verifyEmail.id));
                    return {
                        message: {
                            type: 'success',
                            message: 'Email has succesfully been verified',
                        } as { type: string; message: string } | undefined,
                    };
                } else {
                    return {
                        message: {
                            type: 'error',
                            message: 'Invalid verification code',
                        } as { type: string; message: string } | undefined,
                    };
                }
            }
        }
    },
    getVerifyEmailCode: async ({ locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const profile = (
            await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, locals.user.id))
        ).at(0);

        if (profile) {
            await sendEmailVerificationCode(profile.email, locals.user.id);
        }
    },
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

        const validPassword = await verifyPassword(existingUser?.password ?? '', v.fields.oldPassword);

        if (!validPassword) {
            return fail(400, {
                errors: {
                    oldPassword: ['Invalid password'],
                },
                fields: v.fields,
            });
        }

        const newPassword = await hashPassword(v.fields.newPassword);

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
