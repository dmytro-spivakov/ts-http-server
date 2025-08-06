import { db } from "../index.js";
import { eq, asc } from "drizzle-orm";
import { NewChirp, Chirp, chirps } from "../schema.js";

export async function createChrip(chirp: NewChirp) {
	const [result] = await db
		.insert(chirps)
		.values(chirp)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function getChirps(): Promise<Chirp[]> {
	const result = await db
		.select()
		.from(chirps)
		.orderBy(asc(chirps.createdAt));

	return result;
}

export async function getChirpById(chirpID: string): Promise<Chirp> {
	const [result] = await db
		.select()
		.from(chirps)
		.where(eq(chirps.id, chirpID))
		.limit(1);
	return result;
}
