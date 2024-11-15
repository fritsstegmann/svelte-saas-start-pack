import { createTOTPKeyURI, verifyTOTP } from '@oslojs/otp';
import { encodeBase64, decodeBase64 } from '@oslojs/encoding';
import { renderSVG } from 'uqr';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { passwordConfirmValid } from '$lib/server/security/confirmPassword';
import { TokenBucket } from '$lib/server/ratelimit';
import validate from '$lib/server/middleware/validate';
import { z } from 'zod';
import { sessionTable, usersTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, getClientAddress }) => {
    if (!locals.user) redirect(302, '/signin');
    if (!locals.session) redirect(302, '/signin');

    if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
        redirect(302, '/confirm-password?redirect=/profile/security');
    }

    const bucket = new TokenBucket('security', 2, 1);
    if (!(await bucket.consume(getClientAddress(), 1))) {
        error(429);
    }

    const totpKey = new Uint8Array(20);
    crypto.getRandomValues(totpKey);
    const encodedKey = encodeBase64(totpKey);

    const keyURI = createTOTPKeyURI(
        'SaasKit',
        locals.user.userName,
        totpKey,
        30,
        6
    );

    const qrCode = renderSVG(keyURI);

    return {
        encodedKey,
        qrCode,
    };
};

export const actions = {
    verify: async ({ locals, getClientAddress, request }) => {
        if (!locals.user) redirect(302, '/signin');
        if (!locals.session) redirect(302, '/signin');

        if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
            redirect(302, '/confirm-password?redirect=/profile/security');
        }

        const bucket = new TokenBucket('security', 2, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }
        const data = await validate(
            z.object({
                code: z.string().min(1).max(6),
                key: z.string().min(1).max(256),
            }),
            request
        );

        if (data.isOk) {
            if (
                verifyTOTP(
                    decodeBase64(data.fields.key),
                    30,
                    6,
                    data.fields.code
                )
            ) {
                await db
                    .update(usersTable)
                    .set({
                        totpSecret: data.fields.key,
                        twoFaEnabled: true,
                    })
                    .where(eq(usersTable.id, locals.user.id));

                await db
                    .update(sessionTable)
                    .set({
                        twoFaVerified: true,
                    })
                    .where(eq(sessionTable.id, locals.session.id));
            }

            redirect(302, '/profile/security');
        } else {
            return data.error;
        }
    },
} as Actions;