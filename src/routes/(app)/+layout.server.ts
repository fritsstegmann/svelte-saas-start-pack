import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { userProfilesTable } from '$lib/server/schema';
import { validateUserSession } from '$lib/server/svelte';

export const load: LayoutServerLoad = async (event) => {
    const { user } = validateUserSession(event);

    const { pathname } = event.url;

    const profile = (
        await db
            .select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.userId, user.id))
    ).at(0);

    return {
        pathname,
        user,
        profile,
    };
};
