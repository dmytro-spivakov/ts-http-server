import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
	type parameters = {
		body: string;
	};

	let params: parameters = req.body;

	if (!params.body || typeof params.body !== "string") {
		respondWithError(res, 400, "Something went wrong");
		return;
	}
	if (params.body.length > 140) {
		respondWithError(res, 400, "Chirp is too long");
		return;
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
