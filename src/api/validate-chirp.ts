import { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
	type parameters = {
		body: string;
	};

	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	let params: parameters;
	req.on("end", () => {
		try {
			params = JSON.parse(body);
		} catch (_e) {
			respondWithError(res, 400, "Something went wrong");
			return;
		}

		const paramsBody = params.body;
		if (!paramsBody) {
			respondWithError(res, 400, "Something went wrong");
			return;
		}
		if (paramsBody.length > 140) {
			respondWithError(res, 400, "Chirp is too long");
			return;
		}

		respondWithJSON(res, 200, { valid: true });
	});
};

