import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import { TokenBucket } from "$lib/server/ratelimit";
import userRepository from "$lib/server/repositories/userRepository";
import { userPasswordsTable, usersTable } from "$lib/server/schema";
import { setSessionTokenCookie } from "$lib/server/security/cookies";
import { createSession } from "$lib/server/security/session";
import { generateSecureCode, verifyPassword } from "$lib/server/security/utils";
import { Throttler } from "$lib/server/throttling";
import { type Actions, error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";
import * as m from "../../../paraglide/messages";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const bucket = new TokenBucket("security", 2, 1);
    if (!(await bucket.consume(event.getClientAddress(), 1))) {
        error(429);
    }
};

export const actions: Actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const bucket = new TokenBucket("security", 2, 1);
        const throttler = new Throttler("signin");

        if (!(await bucket.consume(getClientAddress(), 1))) {
            return fail(422, {
                errors: {
                    username: [m.tooManyRequests()],
                },
                fields: {
                    username: "",
                    password: "",
                },
            });
        }

        const data = await validate(
            z.object({
                username: z
                    .string({
                        message: m.missingInput(),
                    })
                    .min(1)
                    .max(256),
                password: z
                    .string({
                        message: m.missingInput(),
                    })
                    .min(10)
                    .max(256),
            }),
            request,
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
                                data.fields.username.toLowerCase(),
                            ),
                        )
                ).at(0);

                const userDb = (
                    await db
                        .select()
                        .from(userPasswordsTable)
                        .where(eq(userPasswordsTable.id, user?.id ?? ""))
                ).at(0);

                const validPassword = await verifyPassword(
                    userDb?.password ?? "",
                    data.fields.password,
                );

                if (!validPassword) {
                    if (!(await throttler.consume(data.fields.username))) {
                        return fail(422, {
                            errors: {
                                username: ["Too many requests"],
                            },
                            fields: {
                                username: data.fields.username,
                                password: "",
                            },
                        });
                    }
                    return fail(422, {
                        errors: {
                            username: [m.invalidCredentials()],
                        },
                        fields: {
                            username: data.fields.username,
                            password: "",
                        },
                    });
                }

                if (!user) {
                    if (!(await throttler.consume(data.fields.username))) {
                        return fail(422, {
                            errors: {
                                username: [m.tooManyRequests()],
                            },
                            fields: {
                                username: data.fields.username,
                                password: "",
                            },
                        });
                    }
                    return fail(422, {
                        errors: {
                            username: [m.tooManyRequests()],
                        },
                        fields: {
                            username: data.fields.username,
                            password: "",
                        },
                    });
                }

                await throttler.reset(data.fields.username);

                const session = await createSession(
                    generateSecureCode(),
                    user.id,
                );

                await userRepository.update(eq(usersTable.id, user.id), {
                    lastPasswordConfirmAt: new Date(),
                });

                setSessionTokenCookie(cookies, session.id, session.expiresAt);
            } catch {
                if (!(await throttler.consume(data.fields.username))) {
                    return fail(422, {
                        errors: {
                            username: [m.tooManyRequests()],
                        },
                        fields: {
                            username: data.fields.username,
                            password: "",
                        },
                    });
                }
                return fail(422, {
                    errors: {
                        username: ["The credentials do not match our records"],
                    },
                    fields: {
                        username: data.fields.username,
                        password: "",
                    },
                });
            }
        } else {
            if (!(await throttler.consume(data.error.data.fields.username))) {
                return fail(422, {
                    errors: {
                        username: [m.tooManyRequests()],
                    },
                    fields: {
                        username: data.error.data.fields.username,
                        password: "",
                    },
                });
            }
            return data.error;
        }
        redirect(303, "/");
    },
};
