import type { PageServerLoad } from './$types';
import { hash } from '@node-rs/argon2';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { forgotPasswordTable, usersTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import validation from '$lib/server/middleware/validation';
import { z } from 'zod';
import { checkUrlSignature } from '$lib/server/urlSignature';
import { APP_KEY } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
    if (!checkUrlSignature(event.request.url, APP_KEY)) {
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
                if (!checkUrlSignature(event.request.url, APP_KEY)) {
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
            } catch {
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
