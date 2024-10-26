import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

const guestPaths = ['/signin', '/signup', '/signout', '/forgot-password', '/reset-password'];

export const load = async (event: LayoutServerLoadEvent) => {
    const { pathname: pathName } = event.url;
    if (!guestPaths.includes(event.url.pathname)) {
        if (!event.locals.user) redirect(302, '/signin');
    }

    return {
        pathName,
        username: event.locals.user?.userName,
    };
};
