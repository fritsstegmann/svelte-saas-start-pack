import { lucia } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const actions: import('./$types').Actions = {
	default: async (event) => {
		if (!event.locals.user) redirect(302, '/signin');

		const sessionId = event.cookies.get(lucia.sessionCookieName);
		if (sessionId) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	}
};
