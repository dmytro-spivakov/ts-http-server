import { pgTable, timestamp, varchar, uuid, foreignKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	email: varchar("email", { length: 256 }).unique().notNull(),
	hashedPassword: varchar("hashed_password").notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;
export type User = Required<NewUser>;

export const chirps = pgTable("chirps", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	body: varchar("body", { length: 140 }).notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
});

export type NewChirp = typeof chirps.$inferInsert;
export type Chirp = Required<NewChirp>;
