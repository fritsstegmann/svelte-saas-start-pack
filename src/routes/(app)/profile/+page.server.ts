import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userProfilesTable } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import validation from '$lib/server/middleware/validation';
import { z } from 'zod';

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
    uploadAvatar: validation(z.object({}), async ({ files }) => {
        const avatar = files['avatar'] as File;

        const bytes = new Uint8Array(await avatar.arrayBuffer());
        console.info('uploadAvatar', bytes);
    }),
    updateProfile: async () => {},
};
