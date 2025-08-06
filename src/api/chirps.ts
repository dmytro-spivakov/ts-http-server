import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChrip, getChirps, getChirpById } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
	type parameters = {
		body: string;
		userId: string;
	};
	const maxMsgLength = 140;

	let params: parameters = req.body;

	if (!params.body || !params.userId) {
		throw new BadRequestError("Missing required field");
	}

	if (typeof params.body !== "string" || typeof params.userId !== "string") {
		throw new BadRequestError("One or more invalid params");
	}

	if (params.body.length > maxMsgLength) {
		throw new BadRequestError(`Chirp is too long. Max length is ${maxMsgLength}`);
	}

	const cleaned = cleanedBody(params.body);
	const newChirp = await createChrip({ userId: params.userId, body: cleaned });
	if (!newChirp) {
		throw new Error("Could not create Chrip");
	}

	respondWithJSON(res, 201, newChirp);
};

function cleanedBody(raw: string): string {
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

export async function handlerGetAllChirps(req: Request, res: Response) {
	const chirps = await getChirps();
	respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
	const chirpID = req.params.chirpID;
	const chirp = await getChirpById(chirpID);

	if (!chirp) {
		throw new NotFoundError("Chirp not found");
	}

	respondWithJSON(res, 200, chirp);
}
