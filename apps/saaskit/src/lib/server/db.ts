import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// There are multiple ways to initialize the client
// Go to one of these pages to find your implementation:
// postgreSQL: https://orm.drizzle.team/docs/get-started-postgresql
// MySQL: https://orm.drizzle.team/docs/get-started-mysql
// SQLite: https://orm.drizzle.team/docs/get-started-sqlite
// The following is an example for supabase:

const client = postgres(DATABASE_URL);

export const db = drizzle(client);
