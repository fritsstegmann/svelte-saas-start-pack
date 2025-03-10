import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
    if (!locals.user) redirect(302, "/signin");

    redirect(302, "/profile/details");
};
