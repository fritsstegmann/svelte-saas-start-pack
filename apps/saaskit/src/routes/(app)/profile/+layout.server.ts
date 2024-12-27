import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ url, locals }) => {
    if (!locals.user) redirect(302, "/signin");

    const { pathname } = url;

    return {
        pathname,
    };
};
