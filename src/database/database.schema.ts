import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
});

export const databaseSchema = {
    users,
};