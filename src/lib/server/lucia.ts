import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessionTable, usersTable } from './schema';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, usersTable);
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	}
});
