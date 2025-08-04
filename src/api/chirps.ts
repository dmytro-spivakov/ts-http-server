import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { createChrip } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
	type parameters = {
		body: string;
		userId: string;
	};

	let params: parameters = req.body;

	if (!params.body || !params.userId) {
		throw new BadRequestError("Missing required field");
	}

	if (typeof params.body !== "string" || typeof params.userId !== "string") {
		throw new BadRequestError("One or more invalid params");
	}

	const maxMsgLength = 140;
	if (params.body.length > maxMsgLength) {
		throw new BadRequestError(`Chirp is too long. Max length is ${maxMsgLength}`);
	}

	const newChirp = createChrip(params);
	if (!newChirp) {
		throw new Error("Could not create Chrip");
	}


	respondWithJSON(res, 201, newChirp);
};

function cleanBody(raw: string): string {
	const bannedWords = [
		"kerfuffle",
		"sharbert",
		"fornax"
	];
	const bannedWordReplacement = "****";

	const words = raw.split(" ");
	words.forEach((word, idx) => {
		const lcWord = word.toLowerCase();
		if (bannedWords.includes(lcWord)) {
			words[idx] = bannedWordReplacement;
		}
	});

	return words.join(" ");
}
