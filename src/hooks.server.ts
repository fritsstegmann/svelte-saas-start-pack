// src/hooks.server.ts
import { db } from '$lib/server/db';
import { lucia } from '$lib/server/lucia';
import { usersTable } from '$lib/server/schema';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	if (user) {
		const dbUser =
			(
				await db
					.select({ id: usersTable.id, userName: usersTable.userName })
					.from(usersTable)
					.where(eq(usersTable.id, user.id))
			).pop() ?? null;

		event.locals.user = dbUser;
	}

	event.locals.session = session;
	return resolve(event);
};
