import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const middlewareLogResponses: Middleware = (req, res, next) => {
	res.on("finish", () => {
		if (res.statusCode >= 300) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
		}
	});
	next();
}

const middlewareMetricsInc = (_req: Request, _res: Response, next: NextFunction) => {
	config.fileserverHits++;
	next();
}

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.log(err);
	respondWithError(res, 500, "Something went wrong on our end");

}

export { middlewareLogResponses, middlewareMetricsInc, errorHandler };
