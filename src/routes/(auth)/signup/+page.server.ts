import { db } from '$lib/server/db';
import validation from '$lib/server/middleware/validation';
import { userProfilesTable, usersTable } from '$lib/server/schema';
import { hash } from '@node-rs/argon2';
import { redirect, type Actions } from '@sveltejs/kit';
import z from 'zod';

export const actions: Actions = {
	default: validation(
		z
			.object({
				name: z.string().min(1, 'User name is a required field'),
				email: z.string().email().min(1, 'Email is a required field'),
				username: z.string().min(3),
				password: z.string().min(10),
				confirmPassword: z.string().min(10)
			})
			.superRefine(({ confirmPassword, password }, ctx) => {
				if (confirmPassword !== password) {
					ctx.addIssue({
						code: 'custom',
						message: 'The passwords did not match'
					});
				}
			}),
		async ({ formData }) => {
			const userData = {
				userName: formData.username,
				password: formData.password
			};

			userData.password = await hash(userData.password, {
				// recommended minimum parameters
				memoryCost: 39456,
				timeCost: 6,
				outputLen: 32,
				parallelism: 1
			});

			const user = (await db.insert(usersTable).values(userData).returning()).at(0);

			if (user) {
				const profileData = {
					name: formData.name,
					email: formData.email,
					avatar: null,
					userId: user.id
				};

				await db.insert(userProfilesTable).values(profileData).returning();

				redirect(302, '/signin');
			}

			redirect(500, '/signup');
		}
	)
};
