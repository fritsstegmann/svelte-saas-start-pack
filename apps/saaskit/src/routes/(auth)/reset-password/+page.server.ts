import { APP_KEY } from "$env/static/private";
import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import { forgotPasswordTable, usersTable } from "$lib/server/schema";
import { generateHashFromCode, hashPassword } from "$lib/server/security/utils";
import { checkUrlSignature } from "$lib/server/urlSignature";
import { type Actions, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    if (!checkUrlSignature(event.request.url, APP_KEY)) {
        redirect(302, "/signin");
    }

    const code = event.url.searchParams.get("code");

    if (!code) {
        redirect(302, "/signin");
    }

    const passwordReset = (
        await db
            .select()
            .from(forgotPasswordTable)
            .where(eq(forgotPasswordTable.id, code))
    ).at(0);

    if (!passwordReset) {
        redirect(302, "/signin");
    }
};

export const actions = {
    default: async ({ request, url }) => {
        const data = await validate(
            z.object({
                password: z.string().min(10),
                confirmPassword: z.string().min(10),
            }),
            request,
        );

        if (data.isOk) {
            if (!checkUrlSignature(request.url, APP_KEY)) {
                redirect(302, "/signin");
            }

            const code = url.searchParams.get("code");
            const email = url.searchParams.get("email");

            if (!code) {
                redirect(302, "/signin");
            }

            if (!email) {
                redirect(302, "/signin");
            }

            const hashedCode = generateHashFromCode(code);

            const passwordReset = (
                await db
                    .select()
                    .from(forgotPasswordTable)
                    .where(
                        and(
                            eq(forgotPasswordTable.email, email),
                            eq(forgotPasswordTable.id, hashedCode),
                        ),
                    )
            ).at(0);

            if (passwordReset) {
                const { password, confirmPassword } = data.fields;

                if (password !== confirmPassword) {
                    redirect(302, "/signin");
                }

                // TODO: fix this

                await db
                    .update(usersTable)
                    .set({
                        password: await hashPassword(password),
                    })
                    .where(eq(usersTable.id, passwordReset.userId));

                await db
                    .delete(forgotPasswordTable)
                    .where(eq(forgotPasswordTable.id, passwordReset.id));
            }
        } else {
            return data.error;
        }
        redirect(302, "/signin");
    },
} satisfies Actions;
