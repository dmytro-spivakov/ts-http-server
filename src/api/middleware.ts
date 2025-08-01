import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

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

export { middlewareLogResponses, middlewareMetricsInc };
