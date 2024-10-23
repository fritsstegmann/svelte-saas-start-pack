import { db } from '$lib/server/db';
import validation from '$lib/server/middleware/validation';
import { usersTable } from '$lib/server/schema';
import { createSession } from '$lib/server/security/session';
import { setSessionTokenCookie } from '$lib/server/security/cookies';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { generateSecureCode, verifyPassword } from '$lib/server/security/utils';

export const actions: Actions = {
    default: validation(
        z.object({
            username: z.string().min(1),
            password: z.string().min(10),
        }),
        async ({ formData, cookies }) => {
            try {
                const existingUser = (
                    await db.select().from(usersTable).where(eq(usersTable.userName, formData.username.toLowerCase()))
                ).at(0);

                const validPassword = await verifyPassword(existingUser?.password ?? '', formData.password);

                if (!validPassword) {
                    return fail(422, {
                        errors: {
                            username: ['The credentials do not match our records'],
                        },
                        fields: {
                            username: formData.username,
                            password: '',
                        },
                    });
                }

                if (!existingUser) {
                    return fail(422, {
                        errors: {
                            username: ['The credentials do not match our records'],
                        },
                        fields: {
                            username: formData.username,
                            password: '',
                        },
                    });
                }

                const session = await createSession(generateSecureCode(), existingUser.id);

                setSessionTokenCookie(cookies, session.id, session.expiresAt);
            } catch {
                return fail(422, {
                    errors: {
                        username: ['The credentials do not match our records'],
                    },
                    fields: {
                        username: formData.username,
                        password: '',
                    },
                });
            }
            redirect(303, '/');
        }
    ),
};
