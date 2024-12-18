import { verifyTOTP } from '@oslojs/otp';
import { decodeBase64 } from '@oslojs/encoding';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { TokenBucket } from '$lib/server/ratelimit';
import validate from '$lib/server/middleware/validate';
import { z } from 'zod';
import { sessionTable, usersTable, userTotpsTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import userRepository from '$lib/server/repositories/userRepository';
import { decryptData } from '$lib/server/aes';
import { APP_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, getClientAddress }) => {
    if (!locals.user) redirect(302, '/signin');
    if (!locals.session) redirect(302, '/signin');

    const bucket = new TokenBucket('security', 2, 1);
    if (!(await bucket.consume(getClientAddress(), 1))) {
        error(429);
    }
};

export const actions = {
    default: async ({ locals, getClientAddress, request }) => {
        if (!locals.user) redirect(302, '/signin');
        if (!locals.session) redirect(302, '/signin');

        const bucket = new TokenBucket('security', 2, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }
        const data = await validate(
            z.object({
                code: z.string().min(1).max(6),
            }),
            request
        );

        if (data.isOk) {
            const userTotp = (
                await db
                    .select()
                    .from(userTotpsTable)
                    .where(eq(usersTable.id, locals.user.id))
            ).at(0);

            if (userTotp && userTotp.totpSecret) {
                const totp = await decryptData(APP_KEY, userTotp.totpSecret);

                if (verifyTOTP(decodeBase64(totp), 30, 6, data.fields.code)) {
                    await db
                        .update(sessionTable)
                        .set({
                            twoFaVerified: true,
                        })
                        .where(eq(sessionTable.id, locals.session.id));
                } else {
                    return fail(422, {
                        fields: {
                            code: data.fields.code,
                        },
                        errors: {
                            code: ['Invalid code'],
                        },
                    });
                }
            }

            redirect(302, '/');
        } else {
            return data.error;
        }
    },
} as Actions;
