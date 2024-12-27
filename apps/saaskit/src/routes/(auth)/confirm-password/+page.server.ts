import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import { userPasswordsTable, usersTable } from "$lib/server/schema";
import {
    deleteSessionTokenCookie,
    getSessionTokenCookie,
} from "$lib/server/security/cookies";
import { verifyPassword } from "$lib/server/security/utils";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) redirect(302, "/signin");
};
export const actions = {
    default: async ({ request, locals, cookies, url }) => {
        if (!locals.user) redirect(302, "/signin");

        const validationResult = await validate(
            z.object({
                password: z.string().min(1).max(256),
            }),
            request,
        );

        if (validationResult.isOk) {
            const { password } = validationResult.fields;

            const result = (
                await db
                    .select({
                        user: usersTable,
                        userPassword: userPasswordsTable,
                    })
                    .from(usersTable)
                    .leftJoin(
                        userPasswordsTable,
                        eq(usersTable.id, userPasswordsTable.id),
                    )
                    .where(eq(usersTable.id, locals.user.id))
            ).at(0);

            if (result?.user && result?.userPassword) {
                const validPassword = await verifyPassword(
                    result.userPassword.password,
                    password,
                );
                if (validPassword) {
                    await db
                        .update(usersTable)
                        .set({
                            lastPasswordConfirmAt: new Date(),
                        })
                        .where(eq(usersTable.id, result.user.id));
                } else {
                    return fail(422, {
                        errors: {
                            password: [
                                "The credentials do not match our records",
                            ],
                        },
                        fields: {
                            password: password,
                        },
                    });
                }

                const redirectUrl = url.searchParams.get("redirect");

                if (redirectUrl) {
                    if (redirectUrl.startsWith("/")) {
                        redirect(302, `http://localhost:5173${redirectUrl}`);
                    } else {
                        redirect(302, `http://localhost:5173/${redirectUrl}`);
                    }
                } else {
                    redirect(302, "/");
                }
            } else {
                const sessionId = getSessionTokenCookie(cookies);

                if (sessionId) {
                    deleteSessionTokenCookie(cookies);
                }
                redirect(302, "/signin");
            }
        } else {
            return validationResult.error;
        }
    },
} satisfies Actions;
