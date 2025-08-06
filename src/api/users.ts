import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "./auth.js";
import { User } from "../db/schema.js";

type SanitizedUser = Omit<User, "hashedPassword">;

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

	const sanitized: SanitizedUser = (function() {
		const { hashedPassword, ...sanitizedUser } = { ...newUser };
		return sanitizedUser;
	})();
	respondWithJSON(res, 201, sanitized);
}
