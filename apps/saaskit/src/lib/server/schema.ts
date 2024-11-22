import { sql } from 'drizzle-orm';
import { text, timestamp, pgTable, boolean, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userName: text('userName').unique().notNull(),
    twoFaEnabled: boolean('twoFaEnabled').default(false).notNull(),
    lastPasswordConfirmAt: timestamp('lastPasswordConfirmAt'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const userPasswordsTable = pgTable('user_passwords', {
    id: uuid('id')
        .primaryKey()
        .unique()
        .references(() => usersTable.id),
    password: text('password').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const userTotpsTable = pgTable('user_totps', {
    id: uuid('id')
        .primaryKey()
        .unique()
        .references(() => usersTable.id),
    totpSecret: text('totpSecret').unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const userProfilesTable = pgTable('user_profiles', {
    id: uuid('id')
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    emailVerified: boolean('emailVerified').default(false).notNull(),
    avatar: text('avatar'),
    userId: uuid('userId')
        .unique()
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
    twoFaVerified: boolean('twoFaVerified').default(false).notNull(),
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

export const changeEmailRequestTable = pgTable('change_email_requests', {
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
