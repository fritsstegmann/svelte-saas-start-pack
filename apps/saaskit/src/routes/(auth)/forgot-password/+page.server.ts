import { APP_KEY } from "$env/static/private";

import { db } from "$lib/server/db";
import { sendMail } from "$lib/server/mail";
import validate from "$lib/server/middleware/validate";
import { forgotPasswordTable, userProfilesTable } from "$lib/server/schema";
import {
    generateHashFromCode,
    generateSecureCode,
} from "$lib/server/security/utils";
import { createUrlWithSignature } from "$lib/server/urlSignature";
import { redirect } from "@sveltejs/kit";
import { add } from "date-fns";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ request }) => {
        const validationResult = await validate(
            z.object({
                email: z.string(),
            }),
            request,
        );

        if (validationResult.isOk) {
            const { email } = validationResult.fields;
            const profile = (
                await db
                    .select()
                    .from(userProfilesTable)
                    .where(eq(userProfilesTable.email, email))
            ).at(0);

            if (profile) {
                const userId = profile.userId;

                const code = generateSecureCode();
                const expiresAt = add(new Date(), {
                    minutes: 1,
                });

                await db.insert(forgotPasswordTable).values({
                    id: generateHashFromCode(code),
                    email,
                    userId,
                    expiresAt,
                });

                const url = `/reset-password?code=${code}&email=${email}`;

                const parsedUrl = new URL(request.url);
                let completeUrl = `${parsedUrl.protocol}//${parsedUrl.host}${url}`;

                completeUrl = createUrlWithSignature(completeUrl, APP_KEY);

                await sendMail(
                    "saaskit@example.com",
                    profile.email,
                    "Forgot password email",
                    `<a href="${completeUrl}">Reset password</a>`,
                );

                redirect(302, "/signin");
            }
        } else {
            return validationResult.error;
        }
    },
} satisfies Actions;
