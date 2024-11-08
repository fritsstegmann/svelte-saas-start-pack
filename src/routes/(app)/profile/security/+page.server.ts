import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
    changeEmailRequestTable,
    emailValidationTable,
    userProfilesTable,
    usersTable,
} from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import validate from '$lib/server/middleware/validate';
import { sendEmailVerificationCode } from '$lib/server/security/verifyEmail';
import {
    generateHashFromCode as generateHashFromCode,
    generateShortCode,
    hashPassword,
    verifyPassword,
} from '$lib/server/security/utils';
import { TokenBucket } from '$lib/server/ratelimit';
import { passwordConfirmValid } from '$lib/server/security/confirmPassword';
import { sendMail } from '$lib/server/mail';
import {
    validateConfirmedPassword,
    validateUserSession,
} from '$lib/server/svelte';

export const load: PageServerLoad = async ({ locals, url }) => {
    const { user } = validateUserSession({ locals, url });

    validateConfirmedPassword({ locals }, '/profile/security');

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
    changeEmail: async ({ request, locals, url, getClientAddress }) => {
        const { user } = validateUserSession({ locals, url });

        const bucket = new TokenBucket('security', 1, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }

        validateConfirmedPassword({ locals }, '/profile/security');

        const profile = (
            await db
                .select()
                .from(userProfilesTable)
                .where(eq(userProfilesTable.userId, user.id))
        ).at(0);

        if (profile) {
            const v = await validate(
                z.object({
                    code: z.string().min(7),
                }),
                request
            );
            if (v.isOk) {
                const hashedCode = generateHashFromCode(v.fields.code);

                const changeEmail = (
                    await db
                        .select()
                        .from(changeEmailRequestTable)
                        .where(eq(changeEmailRequestTable.id, hashedCode))
                ).at(0);

                if (changeEmail) {
                    await db
                        .update(userProfilesTable)
                        .set({
                            email: changeEmail?.email,
                            emailVerified: true,
                        })
                        .where(eq(userProfilesTable.id, profile.id));

                    await db
                        .delete(changeEmailRequestTable)
                        .where(eq(changeEmailRequestTable.id, hashedCode));
                } else {
                    return {
                        message: {
                            type: 'error',
                            message: 'Invalid verification code',
                        } as { type: string; message: string } | undefined,
                    };
                }
            }
        } else {
            return {
                message: {
                    type: 'error',
                    message: 'Invalid verification code',
                } as { type: string; message: string } | undefined,
            };
        }
    },
    getEmailChangeCode: async ({ request, locals, url, getClientAddress }) => {
        const { user } = validateUserSession({ locals, url });

        const bucket = new TokenBucket('security', 1, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }

        validateConfirmedPassword({ locals }, '/profile/security');

        const v = await validate(
            z.object({
                email: z.string().min(1).max(256).email(),
            }),
            request
        );

        if (v.isOk) {
            const shortCode = generateShortCode();

            await db.insert(changeEmailRequestTable).values({
                id: generateHashFromCode(shortCode),
                email: v.fields.email,
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 15),
            });

            await sendMail(
                'saaskit@example.com',
                v.fields.email,
                'Change email code',
                `Verifcation code for email: ${shortCode}`
            );

            const profile = (
                await db
                    .select()
                    .from(userProfilesTable)
                    .where(eq(userProfilesTable.userId, user.id))
            ).at(0);

            if (profile) {
                await sendMail(
                    'saaskit@example.com',
                    profile.email,
                    'Change email code',
                    `An email address change has been requested`
                );
            }
        } else {
            return v.error;
        }
    },
    verifyEmail: async ({ request, locals, getClientAddress }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const bucket = new TokenBucket('verifyEmail', 1, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }

        if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
            redirect(302, '/confirm-password?redirect=/profile/security');
        }

        const profile = (
            await db
                .select()
                .from(userProfilesTable)
                .where(eq(userProfilesTable.userId, locals.user.id))
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
                    await db
                        .select()
                        .from(emailValidationTable)
                        .where(eq(emailValidationTable.id, hashedCode))
                ).at(0);

                if (verifyEmail) {
                    await db
                        .update(userProfilesTable)
                        .set({
                            emailVerified: true,
                        })
                        .where(eq(userProfilesTable.id, profile.id));

                    await db
                        .delete(emailValidationTable)
                        .where(eq(emailValidationTable.id, verifyEmail.id));
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
    getVerifyEmailCode: async ({ locals, getClientAddress }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const bucket = new TokenBucket('getVerifyEmailCode', 1, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }

        if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
            redirect(302, '/confirm-password?redirect=/profile/security');
        }

        const profile = (
            await db
                .select()
                .from(userProfilesTable)
                .where(eq(userProfilesTable.userId, locals.user.id))
        ).at(0);

        if (profile) {
            await sendEmailVerificationCode(profile.email, locals.user.id);
        }
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

        const existingUser = (
            await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, locals.user.id))
        ).at(0);

        if (!existingUser) {
            redirect(307, '/signout');
        }

        const validPassword = await verifyPassword(
            existingUser?.password ?? '',
            v.fields.oldPassword
        );

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
    updateEmail: async ({ getClientAddress, request, locals }) => {
        if (!locals.user) {
            redirect(302, '/signin');
        }

        const bucket = new TokenBucket('updateEmail', 2, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }

        if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
            redirect(302, '/confirm-password?redirect=/profile/security');
        }

        const v = await validate(
            z.object({
                email: z.string().min(1).max(256),
            }),
            request
        );

        if (!v.isOk) {
            return v.error;
        }

        await db
            .update(userProfilesTable)
            .set({
                email: v.fields.email,
            })
            .where(eq(userProfilesTable.userId, locals.user.id));

        return {
            message: {
                type: 'success',
                message: 'Successfully updated email',
            } as { type: string; message: string } | undefined,
        };
    },
};
