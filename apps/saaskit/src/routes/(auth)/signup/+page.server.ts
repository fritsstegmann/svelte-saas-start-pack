import { missingInput } from "$i18n/messages";
import { db } from "$lib/server/db";
import validate from "$lib/server/middleware/validate";
import userRepository from "$lib/server/repositories/userRepository";
import {
    userPasswordsTable,
    userProfilesTable,
    usersTable,
} from "$lib/server/schema";
import { hashPassword } from "$lib/server/security/utils";
import { type Actions, error, fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import z from "zod";

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await validate(
            z
                .object({
                    name: z.string({
                        message: missingInput(),
                    }),
                    email: z
                        .string({
                            message: missingInput(),
                        })
                        .email()
                        .refine(async (current) => {
                            const count = (
                                await db
                                    .select()
                                    .from(userProfilesTable)
                                    .where(eq(userProfilesTable.email, current))
                            ).length;

                            return count < 1;
                        }, "Email has been taken"),
                    username: z
                        .string({
                            message: missingInput(),
                        })
                        .min(3)
                        .refine(async (current) => {
                            const count = (
                                await db
                                    .select()
                                    .from(usersTable)
                                    .where(eq(usersTable.userName, current))
                            ).length;

                            return count < 1;
                        }, "User name has been taken"),
                    password: z
                        .string({
                            message: missingInput(),
                        })
                        .min(10),
                    confirmPassword: z
                        .string({
                            message: missingInput(),
                        })
                        .min(10),
                })
                .superRefine(({ confirmPassword, password }, ctx) => {
                    if (confirmPassword !== password) {
                        ctx.addIssue({
                            path: ["confirmPassword"],
                            code: "custom",
                            message: "The passwords did not match",
                        });
                    }
                }),
            request,
        );

        if (data.isOk) {
            const userData = {
                userName: data.fields.username,
                password: data.fields.password,
            };

            const user = (
                await userRepository.insert({
                    userName: data.fields.username,
                })
            ).at(0);

            if (user) {
                const profileData = {
                    name: data.fields.name,
                    email: data.fields.email,
                    avatar: null,
                    userId: user.id,
                };

                await db
                    .insert(userProfilesTable)
                    .values(profileData)
                    .returning();

                await db
                    .insert(userPasswordsTable)
                    .values({
                        id: user.id,
                        password: await hashPassword(userData.password),
                    })
                    .returning();

                redirect(302, "/signin");
            }
        } else {
            return data.error;
        }
    },
};
