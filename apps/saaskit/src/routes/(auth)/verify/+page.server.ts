import { db } from "$lib/server/db";
import { userProfilesTable } from "$lib/server/schema";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) redirect(302, "/signin");

    const profile = (
        await db
            .select()
            .from(userProfilesTable)
            .where(eq(userProfilesTable.userId, event.locals.user.id))
    ).at(0);

    return {
        user: event.locals.user,
        profile,
    };
};
