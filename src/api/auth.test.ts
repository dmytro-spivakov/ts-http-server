import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { TokenExpiredError } from "jsonwebtoken";

describe("Password Hashing", () => {
	const password1 = "correctPassword123!";
	const password2 = "anotherPassword456!";
	let hash1: string;
	let hash2: string;

	beforeAll(async () => {
		hash1 = hashPassword(password1);
		hash2 = hashPassword(password2);
	});

	it("should return true for the correct password", async () => {
		const result = checkPasswordHash(password1, hash1);
		expect(result).toBe(true);
	});
});

describe("JWT issuing and verification", () => {
	it("should fetch userID from a valid token", async () => {
		const userID: string = "apples";
		const jwt = makeJWT(userID, 10_000, config.api.secret);

		const userIDFromJWT = validateJWT(jwt, config.api.secret);
		expect(userIDFromJWT).to.eq(userID);
	});

	it("should reject expired tokens", async () => {
		const userID: string = "apples";
		const jwt = makeJWT(userID, -1_000, config.api.secret);

		expect(() => validateJWT(jwt, config.api.secret)).toThrowError(TokenExpiredError);
	});
});
