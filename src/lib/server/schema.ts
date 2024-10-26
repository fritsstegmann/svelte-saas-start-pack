import { sql } from 'drizzle-orm';
import { serial, text, timestamp, pgTable, boolean, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userName: text('userName').unique().notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const userProfilesTable = pgTable('user_profiles', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    emailVerified: boolean('emailVerified').default(false).notNull(),
    avatar: text('avatar'),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const sessionTable = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp('expiresAt', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const emailValidationTable = pgTable('email_validations', {
    id: text('id').primaryKey().unique(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    email: text('email').notNull(),
    code: text('code').unique(),
    expiresAt: timestamp('expiresAt', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const forgotPasswordTable = pgTable('forgot_passwords', {
    id: text('id').primaryKey().unique(),
    email: text('email').notNull(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
    expiresAt: timestamp('expiresAt', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});
