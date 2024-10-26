import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { userProfilesTable } from '$lib/server/schema';

export const load: LayoutServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, '/signin');

    const { pathname } = event.url;

    const profile = (
        await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, event.locals.user.id))
    ).at(0);

    return {
        pathname,
        user: event.locals.user,
        profile,
    };
};
