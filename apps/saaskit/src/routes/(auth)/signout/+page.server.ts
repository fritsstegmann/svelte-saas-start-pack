import {
    deleteSessionTokenCookie,
    getSessionTokenCookie,
} from "$lib/server/security/cookies";
import { redirect } from "@sveltejs/kit";

export const actions: import("./$types").Actions = {
    default: async (event) => {
        if (!event.locals.user) redirect(302, "/signin");

        const sessionId = getSessionTokenCookie(event.cookies);

        if (sessionId) {
            deleteSessionTokenCookie(event.cookies);
        }
    },
};
