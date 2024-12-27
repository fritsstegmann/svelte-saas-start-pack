import { APP_KEY } from "$env/static/private";
import { decryptData } from "$lib/server/aes";
import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import { TokenBucket } from "$lib/server/ratelimit";
import { sessionTable, userTotpsTable, usersTable } from "$lib/server/schema";
import { decodeBase64 } from "@oslojs/encoding";
import { verifyTOTP } from "@oslojs/otp";
import { type Actions, error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, getClientAddress }) => {
    if (!locals.user) redirect(302, "/signin");
    if (!locals.session) redirect(302, "/signin");

    const bucket = new TokenBucket("security", 2, 1);
    if (!(await bucket.consume(getClientAddress(), 1))) {
        error(429);
    }
};

export const actions = {
    default: async ({ locals, getClientAddress, request }) => {
        if (!locals.user) redirect(302, "/signin");
        if (!locals.session) redirect(302, "/signin");

        const bucket = new TokenBucket("security", 2, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }
        const data = await validate(
            z.object({
                code: z.string().min(1).max(6),
            }),
            request,
        );

        if (data.isOk) {
            const userTotp = (
                await db
                    .select()
                    .from(userTotpsTable)
                    .where(eq(usersTable.id, locals.user.id))
            ).at(0);

            if (userTotp?.totpSecret) {
                const totp = await decryptData(APP_KEY, userTotp.totpSecret);

                if (verifyTOTP(decodeBase64(totp), 30, 6, data.fields.code)) {
                    await db
                        .update(sessionTable)
                        .set({
                            twoFaVerified: true,
                        })
                        .where(eq(sessionTable.id, locals.session.id));
                } else {
                    return fail(422, {
                        fields: {
                            code: data.fields.code,
                        },
                        errors: {
                            code: ["Invalid code"],
                        },
                    });
                }
            }

            redirect(302, "/");
        } else {
            return data.error;
        }
    },
} as Actions;
