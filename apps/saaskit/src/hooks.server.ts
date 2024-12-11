import { RATE_LIMIT_SHA, THROTTLING_SHA } from '$env/static/private';
import { TokenBucket } from '$lib/server/ratelimit';
import { installRateLimit } from '$lib/server/ratelimit/install';
import { redis } from '$lib/server/redis';
import {
    deleteSessionTokenCookie,
    getSessionTokenCookie,
} from '$lib/server/security/cookies';
import { validateSessionToken } from '$lib/server/security/session';
import { validateUserSession } from '$lib/server/svelte';
import { installThrottling } from '$lib/server/throttling/install';
import { type Handle } from '@sveltejs/kit';

await redis.connect();

const rateLimitSha = (await redis.scriptExists(RATE_LIMIT_SHA))[0];

if (!rateLimitSha) {
    await installRateLimit();
}

const throttlingSha = (await redis.scriptExists(THROTTLING_SHA))[0];

if (!throttlingSha) {
    await installThrottling();
}

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

        event.locals.user = {
            id: user.id,
            lastPasswordConfirmAt: user.lastPasswordConfirmAt,
            userName: user.userName,
            twoFaEnabled: user.twoFaEnabled,
        };
        event.locals.session = session;

        validateUserSession({
            locals: event.locals,
            url: event.url,
        });
    }

    return resolve(event);
};
