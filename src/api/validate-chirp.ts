import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
	type parameters = {
		body: string;
	};

	let params: parameters = req.body;

	if (!params.body || typeof params.body !== "string") {
		respondWithError(res, 400, "Something went wrong");
		return;
	}

	const maxMsgLength = 140;
	if (params.body.length > maxMsgLength) {
		throw new BadRequestError(`Chirp is too long. Max length is ${maxMsgLength}`);
	}

	respondWithJSON(res, 200, {
		cleanedBody: cleanBody(params.body)
	});
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
