// src/hooks.server.ts
import { TokenBucket } from '$lib/server/ratelimit';
import { deleteSessionTokenCookie, getSessionTokenCookie } from '$lib/server/security/cookies';
import { validateSessionToken } from '$lib/server/security/session';
import { type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    event.locals.session = null;

    const ip = event.getClientAddress();

    const bucket = new TokenBucket('global', 10, 2);
    if (!(await bucket.consume(ip, 1))) {
        return new Response(null, {
            status: 429,
        });
    }

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
