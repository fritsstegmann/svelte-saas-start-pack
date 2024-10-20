import { APP_KEY } from '$env/static/private';

import { add } from 'date-fns';
import validation from '$lib/server/middleware/validation';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { forgotPasswordTable, userProfilesTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { sendMail } from '$lib/server/mail';
import { createUrlWithSignature } from '$lib/server/urlSignature';
import { generateHashFromCode, generateSecureCode } from '$lib/server/security/utils';

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

                const code = generateSecureCode();
                const expiresAt = add(new Date(), {
                    minutes: 1,
                });

                await db.insert(forgotPasswordTable).values({
                    code: generateHashFromCode(code),
                    email,
                    userId,
                    expiresAt,
                });

                const url = `/reset-password?code=${code}&email=${email}`;

                const parsedUrl = new URL(request.url);
                let completeUrl = parsedUrl.protocol + '//' + parsedUrl.host + url;

                completeUrl = createUrlWithSignature(completeUrl, APP_KEY);

                await sendMail(
                    'saaskit@example.com',
                    profile.email,
                    'Forgot password email',
                    `<a href="${completeUrl}">Reset password</a>`
                );

                redirect(302, '/signin');
            }
        }
    ),
} satisfies Actions;
