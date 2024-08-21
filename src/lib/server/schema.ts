import { serial, text, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: serial('id').primaryKey(),
	userName: text('username').unique().notNull(),
	password: text('password').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const userProfilesTable = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').unique().notNull(),
	avatar: text('avatar'),
	userId: integer('userId')
		.notNull()
		.references(() => usersTable.id),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const sessionTable = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('userId')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expiresAt', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
