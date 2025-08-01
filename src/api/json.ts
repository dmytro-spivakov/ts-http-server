import { Response } from "express";

export function respondWithError(res: Response, code: number, message: string): void {
	respondWithJSON(res, 400, { error: message });
}

export function respondWithJSON(res: Response, code: number, payload: any): void {
	res.header("Content-Type", "application/json");
	const body = JSON.stringify(payload);
	res.status(code).send(body);
	res.end();
}
