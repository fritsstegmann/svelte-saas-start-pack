import { db } from '$lib/server/db';
import validate from '$lib/server/middleware/validate';
import {
    userPasswordsTable,
    userProfilesTable,
    usersTable,
} from '$lib/server/schema';
import { hashPassword } from '$lib/server/security/utils';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await validate(
            z
                .object({
                    name: z.string().min(1, 'User name is a required field'),
                    email: z
                        .string()
                        .email()
                        .min(1, 'Email is a required field')
                        .refine(async (current) => {
                            const count = (
                                await db
                                    .select()
                                    .from(usersTable)
                                    .where(eq(usersTable.userName, current))
                            ).length;

                            return count < 1;
                        }, 'Email has been taken'),
                    username: z
                        .string()
                        .min(3)
                        .refine(async (current) => {
                            const count = (
                                await db
                                    .select()
                                    .from(usersTable)
                                    .where(eq(usersTable.userName, current))
                            ).length;

                            return count < 1;
                        }, 'User name has been taken'),
                    password: z.string().min(10),
                    confirmPassword: z.string().min(10),
                })
                .superRefine(({ confirmPassword, password }, ctx) => {
                    if (confirmPassword !== password) {
                        ctx.addIssue({
                            code: 'custom',
                            message: 'The passwords did not match',
                        });
                    }
                }),

            request
        );

        if (data.isOk) {
            const userData = {
                userName: data.fields.username,
                password: data.fields.password,
            };

            try {
                const user = (
                    await db
                        .insert(usersTable)
                        .values({
                            userName: data.fields.username,
                        })
                        .returning()
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

                    redirect(302, '/signin');
                }
            } catch {
                return fail(400, {
                    fields: data.fields,
                });
            }
        } else {
            return data.error;
        }

        return redirect(500, '/signup');
    },
};
