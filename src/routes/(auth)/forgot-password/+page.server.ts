import { APP_KEY } from '$env/static/private';

import { v4 as uuidv4 } from 'uuid';
import { sha512 } from '@noble/hashes/sha512';
import { sha1 } from '@noble/hashes/sha1';
import { add } from 'date-fns';
import validation from '$lib/server/middleware/validation';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { forgotPasswordTable, userProfilesTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { encodeBase64Url } from 'effect/Encoding';
import { redirect } from '@sveltejs/kit';
import { sendMail } from '$lib/server/mail';

function generateSignature(code: string): string {
    const signature = sha1(sha512(code + APP_KEY) + code);

    return encodeBase64Url(signature.toString());
}

export const actions = {
    default: validation(
        z.object({
            email: z.string(),
        }),
        async ({ formData, request }) => {
            const { email } = formData;

            const profile = (await db.select().from(userProfilesTable).where(eq(userProfilesTable.email, email))).at(0);

            if (profile) {
                const userId = profile.userId;
                const code = uuidv4();
                const expiresAt = add(new Date(), {
                    days: 1,
                });

                await db.insert(forgotPasswordTable).values({
                    code,
                    userId,
                    expiresAt,
                });

                const url = `/reset-password?code=${code}&email=${email}`;

                const parsedUrl = new URL(request.url);
                const completeUrl = parsedUrl.protocol + '//' + parsedUrl.host + url;

                const signature = generateSignature(completeUrl);

                await sendMail(
                    'saaskit@example.com',
                    profile.email,
                    'Forgot password email',
                    `<a href="${completeUrl + '&signature=' + signature}">Reset password</a>`
                );

                redirect(302, '/signin');
            }
        }
    ),
} satisfies Actions;
