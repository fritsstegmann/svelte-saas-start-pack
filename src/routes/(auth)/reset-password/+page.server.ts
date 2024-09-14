import { encodeBase64Url } from 'effect/Encoding';
import type { PageServerLoad } from './$types';
import { APP_KEY } from '$env/static/private';
import { sha512 } from '@noble/hashes/sha512';
import { sha1 } from '@noble/hashes/sha1';
import { hash } from '@node-rs/argon2';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { forgotPasswordTable, usersTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import validation from '$lib/server/middleware/validation';
import { z } from 'zod';

function checkSignature(rawUrl: string) {
    const [url, signature] = rawUrl.split('&signature=');

    const gSignature = generateSignature(url);

    return gSignature === signature;
}

function generateSignature(code: string): string {
    const signature = sha1(sha512(code + APP_KEY) + code);

    return encodeBase64Url(signature.toString());
}

export const load: PageServerLoad = async (event) => {
    if (!checkSignature(event.request.url)) {
        redirect(302, '/signin');
    }

    const code = event.url.searchParams.get('code');

    if (!code) {
        redirect(302, '/signin');
    }

    const passwordReset = (await db.select().from(forgotPasswordTable).where(eq(forgotPasswordTable.code, code))).at(0);

    if (!passwordReset) {
        redirect(302, '/signin');
    }
};

export const actions = {
    default: validation(
        z.object({
            password: z.string().min(10),
            confirmPassword: z.string().min(10),
        }),
        async (event) => {
            try {
                if (!checkSignature(event.request.url)) {
                    redirect(302, '/signin');
                }
                const code = event.url.searchParams.get('code');

                if (!code) {
                    redirect(302, '/signin');
                }

                const passwordReset = (
                    await db.select().from(forgotPasswordTable).where(eq(forgotPasswordTable.code, code))
                ).at(0);

                if (passwordReset) {
                    const { password, confirmPassword } = event.formData;

                    if (password != confirmPassword) {
                        redirect(302, '/signin');
                    }

                    const hPassword = await hash(password, {
                        // recommended minimum parameters
                        memoryCost: 39456,
                        timeCost: 6,
                        outputLen: 32,
                        parallelism: 1,
                    });

                    await db
                        .update(usersTable)
                        .set({
                            password: hPassword,
                        })
                        .where(eq(usersTable.id, passwordReset.userId));
                }
            } catch (e) {
                return fail(422, {
                    fields: {
                        password: event.formData.password,
                        confirmPassword: event.formData.confirmPassword,
                    },
                });
            }
            redirect(302, '/signin');
        }
    ),
} satisfies Actions;