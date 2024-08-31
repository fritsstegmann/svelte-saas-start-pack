import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userProfilesTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, '/signin');

    const profile = (
        await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, event.locals.user.id))
    ).at(0);

    return {
        user: event.locals.user,
        profile,
    };
};

export const actions: Actions = {
    uploadAvatar: async () => {},
    updateProfile: async () => {},
};
