import { APP_KEY } from "$env/static/private";
import { encryptData } from "$lib/server/aes";
import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import { TokenBucket } from "$lib/server/ratelimit";
import { sessionTable, userTotpsTable, usersTable } from "$lib/server/schema";
import { passwordConfirmValid } from "$lib/server/security/confirmPassword";
import {
    validateConfirmedPassword,
    validateUserSession,
} from "$lib/server/svelte";
import { decodeBase64, encodeBase64 } from "@oslojs/encoding";
import { createTOTPKeyURI, verifyTOTP } from "@oslojs/otp";
import { type Actions, error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { renderSVG } from "uqr";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, getClientAddress }) => {
    if (!locals.user) redirect(302, "/signin");
    if (!locals.session) redirect(302, "/signin");

    if (!passwordConfirmValid(locals.user.lastPasswordConfirmAt)) {
        redirect(302, "/confirm-password?redirect=/profile/security");
    }

    const bucket = new TokenBucket("security", 2, 1);
    if (!(await bucket.consume(getClientAddress(), 1))) {
        error(429);
    }

    const totpKey = new Uint8Array(20);
    crypto.getRandomValues(totpKey);
    const encodedKey = encodeBase64(totpKey);

    const keyURI = createTOTPKeyURI(
        "SaasKit",
        locals.user.userName,
        totpKey,
        30,
        6,
    );

    const qrCode = renderSVG(keyURI);

    return {
        encodedKey,
        qrCode,
    };
};

export const actions = {
    verify: async ({ locals, url, getClientAddress, request }) => {
        const { user, session } = validateUserSession({ locals, url });

        validateConfirmedPassword({ locals }, "/profile/security");

        const bucket = new TokenBucket("security", 2, 1);
        if (!(await bucket.consume(getClientAddress(), 1))) {
            error(429);
        }
        const data = await validate(
            z.object({
                code: z.string().min(1).max(6),
                key: z.string().min(1).max(256),
            }),
            request,
        );

        if (data.isOk) {
            if (
                verifyTOTP(
                    decodeBase64(data.fields.key),
                    30,
                    6,
                    data.fields.code,
                )
            ) {
                await db
                    .update(usersTable)
                    .set({
                        twoFaEnabled: true,
                    })
                    .where(eq(usersTable.id, user.id));

                try {
                    await db.insert(userTotpsTable).values({
                        id: user.id,
                        totpSecret: await encryptData(APP_KEY, data.fields.key),
                    });
                } catch {
                    await db
                        .update(userTotpsTable)
                        .set({
                            totpSecret: await encryptData(
                                APP_KEY,
                                data.fields.key,
                            ),
                        })
                        .where(eq(userTotpsTable.id, user.id));
                }

                await db
                    .update(sessionTable)
                    .set({
                        twoFaVerified: true,
                    })
                    .where(eq(sessionTable.id, session.id));
            }

            redirect(302, "/profile/security");
        } else {
            return data.error;
        }
    },
} as Actions;
