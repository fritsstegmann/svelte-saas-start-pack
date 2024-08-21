import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export const load = async (event: LayoutServerLoadEvent) => {
	console.info('event.request.url', event.url.pathname);

	if (event.url.pathname != '/signin') {
		if (!event.locals.user) redirect(302, '/signin');
	}

	return {
		username: event.locals.user?.userName
	};
};
