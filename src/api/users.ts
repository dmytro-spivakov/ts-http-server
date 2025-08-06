import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { hashPassword, checkPasswordHash } from "./auth.js";
import { User } from "../db/schema.js";

type UserResponse = Omit<User, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response) {
	type parameters = {
		email: string;
		password: string;
	};
	const params: parameters = req.body;

	if (
		!params.email || typeof params.email !== "string" ||
		!params.password || typeof params.password !== "string"
	) {
		throw new BadRequestError("Missing required field");
	}


	const hashedPassword = hashPassword(params.password);
	const newUser = await createUser({
		email: params.email,
		hashedPassword: hashedPassword,
	});

	if (!newUser) {
		throw new Error("Could not create user");
	}

	const sanitized = sanitizeUser(newUser);
	respondWithJSON(res, 201, sanitized);
}

export async function handlerLogin(req: Request, res: Response) {
	const err = new UnauthorizedError("Incorrect email or password");

	const { email, password } = req.body;
	if (
		!email || typeof email !== "string" || email.length === 0 ||
		!password || typeof password !== "string" || password.length === 0
	) {
		throw err;
	}

	const currentUser = await getUserByEmail(email)
	if (!currentUser || !checkPasswordHash(password, currentUser.hashedPassword)) {
		throw err;
	}

	const sanitized = sanitizeUser(currentUser);
	respondWithJSON(res, 200, sanitized);
};

function sanitizeUser(user: User): UserResponse {
	const { hashedPassword, ...sanitizedUser } = { ...user };
	return sanitizedUser;
}
