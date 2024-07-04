import { db } from '$lib/server/db';
import { lucia } from '$lib/server/lucia';
import validation from '$lib/server/middleware/validation';
import { usersTable } from '$lib/server/schema';
import { verify } from '@node-rs/argon2';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const actions: Actions = {
	default: validation(
		z.object({
			username: z.string().min(1),
			password: z.string().min(10)
		}),
		async ({ formData, cookies }) => {
			try {
				const existingUser = (
					await db
						.select()
						.from(usersTable)
						.where(eq(usersTable.username, formData.username.toLowerCase()))
				).at(0);

				const validPassword = await verify(existingUser?.password ?? '', formData.password, {
					memoryCost: 39456,
					timeCost: 6,
					outputLen: 32,
					parallelism: 1
				});

				if (!validPassword) {
					return fail(400, {
						message: 'Incorrect username or password'
					});
				}

				if (!existingUser) {
					return fail(400, {
						message: 'Incorrect username or password'
					});
				}

				const session = await lucia.createSession(existingUser.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);

				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
			} catch {
				return fail(422, {
					errors: {
						username: ['The credentials do not match our records']
					},
					fields: {
						username: formData.username,
						password: ''
					}
				});
			}
			redirect(303, '/app');
		}
	)
};
