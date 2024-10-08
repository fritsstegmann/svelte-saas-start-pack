// See https://kit.svelte.dev/docs/types#app

import type { UserId } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: UserId;
				userName: string;
			} | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
	}
}

export {};
