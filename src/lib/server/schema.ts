import { serial, text, timestamp, pgTable, integer, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    userName: text('username').unique().notNull(),
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
    emailValidated: boolean('email_validated').default(false).notNull(),
    avatar: text('avatar'),
    userId: integer('userId')
        .notNull()
        .references(() => usersTable.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const sessionTable = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: integer('userId')
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
    id: serial('id').primaryKey(),
    userId: integer('userId')
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
    id: serial('id').primaryKey(),
    code: text('code').unique(),
    email: text('email').notNull(),
    userId: integer('userId')
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
