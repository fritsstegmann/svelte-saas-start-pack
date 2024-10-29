import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/schema';
import { createSession } from '$lib/server/security/session';
import { setSessionTokenCookie } from '$lib/server/security/cookies';
import { redirect, type Actions, fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { generateSecureCode, verifyPassword } from '$lib/server/security/utils';
import { TokenBucket } from '$lib/server/ratelimit';
import type { PageServerLoad } from './$types';
import validate from '$lib/server/middleware/validate';
import { Throttler } from '$lib/server/throttling';

export const load: PageServerLoad = async (event) => {
    const bucket = new TokenBucket('signin', 2, 1);
    if (!(await bucket.consume(event.getClientAddress(), 1))) {
        error(429);
    }
};

export const actions: Actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const bucket = new TokenBucket('signin', 2, 1);
        const throttler = new Throttler('login:throttler');
        if (!(await bucket.consume(getClientAddress(), 1))) {
            return fail(422, {
                errors: {
                    username: ['request limit exceeded, wait a second'],
                },
                fields: {
                    username: '',
                    password: '',
                },
            });
        }

        const data = await validate(
            z.object({
                username: z.string().min(1).max(256),
                password: z.string().min(10).max(256),
            }),
            request
        );

        if (data.isOk) {
            try {
                const user = (
                    await db
                        .select()
                        .from(usersTable)
                        .where(
                            eq(
                                usersTable.userName,
                                data.fields.username.toLowerCase()
                            )
                        )
                ).at(0);

                const validPassword = await verifyPassword(
                    user?.password ?? '',
                    data.fields.password
                );

                if (!validPassword) {
                    if (!(await throttler.consume(data.fields.username))) {
                        return fail(422, {
                            errors: {
                                username: ['Too many requests'],
                            },
                            fields: {
                                username: data.fields.username,
                                password: '',
                            },
                        });
                    }
                    return fail(422, {
                        errors: {
                            username: [
                                'The credentials do not match our records. invalid password',
                            ],
                        },
                        fields: {
                            username: data.fields.username,
                            password: '',
                        },
                    });
                }

                if (!user) {
                    if (!(await throttler.consume(data.fields.username))) {
                        return fail(422, {
                            errors: {
                                username: ['Too many requests'],
                            },
                            fields: {
                                username: data.fields.username,
                                password: '',
                            },
                        });
                    }
                    return fail(422, {
                        errors: {
                            username: [
                                'The credentials do not match our records. missing user',
                            ],
                        },
                        fields: {
                            username: data.fields.username,
                            password: '',
                        },
                    });
                }

                await throttler.reset(data.fields.username);

                await db
                    .update(usersTable)
                    .set({
                        lastPasswordConfirmAt: new Date(),
                    })
                    .where(eq(usersTable.id, user.id));

                const session = await createSession(
                    generateSecureCode(),
                    user.id
                );

                setSessionTokenCookie(cookies, session.id, session.expiresAt);
            } catch {
                if (!(await throttler.consume(data.fields.username))) {
                    return fail(422, {
                        errors: {
                            username: ['Too many requests'],
                        },
                        fields: {
                            username: data.fields.username,
                            password: '',
                        },
                    });
                }
                return fail(422, {
                    errors: {
                        username: ['The credentials do not match our records'],
                    },
                    fields: {
                        username: data.fields.username,
                        password: '',
                    },
                });
            }
        } else {
            if (!(await throttler.consume(data.error.data.fields.username))) {
                return fail(422, {
                    errors: {
                        username: ['Too many requests'],
                    },
                    fields: {
                        username: data.error.data.fields.username,
                        password: '',
                    },
                });
            }
            return data;
        }
        redirect(303, '/');
    },
};
