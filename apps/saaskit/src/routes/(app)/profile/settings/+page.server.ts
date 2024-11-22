import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validateUserSession } from '$lib/server/svelte';

export const load: PageServerLoad = async ({ locals, url }) => {
    validateUserSession({ locals, url });

    return {};
};

export const actions: Actions = {};
