import { Request, Response, NextFunction } from "express";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
const middlewareLogResponses: Middleware = (req, res, next) => {
	res.on("finish", () => {
		if (res.statusCode !== 0) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
		}
	});
	next();
}

export { middlewareLogResponses };
