import { SQL } from 'drizzle-orm';
import type { TableConfig, PgTableWithColumns } from 'drizzle-orm/pg-core';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export function createReposity<T extends TableConfig>(
    db: PostgresJsDatabase,
    s: PgTableWithColumns<T>,
    callbacks: {
        afterInsert: (v: (typeof s.$inferSelect)[]) => void;
        afterUpdate: (v: (typeof s.$inferSelect)[]) => void;
        afterDelete: (v: (typeof s.$inferSelect)[]) => void;
    }
) {
    async function first(
        q: SQL | undefined
    ): Promise<typeof s.$inferSelect | undefined> {
        // @ts-expect-error works but typing errors
        return (await db.select(s).where(q)).at(0);
    }

    async function select(
        q: SQL | undefined
    ): Promise<(typeof s.$inferSelect)[]> {
        // @ts-expect-error works but typing errors
        return db.select(s).where(q);
    }

    async function insert(
        v: typeof s.$inferInsert
    ): Promise<(typeof s.$inferSelect)[]> {
        // @ts-expect-error works but typing errors
        const results = await db.insert(s).values(v).returning();

        callbacks.afterInsert(results);

        return results;
    }

    async function update(
        q: SQL | undefined,
        v: Partial<typeof s.$inferInsert>
    ) {
        // @ts-expect-error works but typing errors
        const results = await db.update(s).set(v).where(q).returning();
        callbacks.afterUpdate(results);
    }

    async function remove(q: SQL | undefined) {
        const results = await db.delete(s).where(q).returning();

        callbacks.afterDelete(results);

        return results;
    }

    return {
        first,
        select,
        insert,
        update,
        remove,
    };
}
