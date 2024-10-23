// src/hooks.server.ts
import { deleteSessionTokenCookie, getSessionTokenCookie } from '$lib/server/security/cookies';
import { validateSessionToken } from '$lib/server/security/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    event.locals.session = null;

    const sessionId = getSessionTokenCookie(event.cookies);

    if (!sessionId) {
        return resolve(event);
    }

    const sessionResult = await validateSessionToken(sessionId);

    if (sessionResult === null) {
        deleteSessionTokenCookie(event.cookies);
    } else {
        const { session, user } = sessionResult;

        event.locals.user = user;
        event.locals.session = session;
    }

    return resolve(event);
};
