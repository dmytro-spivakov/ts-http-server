import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
	type parameters = {
		email: string;
	};
	const params: parameters = req.body;

	if (!params.email || typeof params.email !== "string") {
		throw new BadRequestError("Missing required field");
	}

	const newUser = await createUser({
		email: params.email
	});

	if (!newUser) {
		throw new Error("Could not create user");
	}

	respondWithJSON(res, 201, newUser);
}
