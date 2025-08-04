import { Request, Response } from "express";
import { config } from "../../config.js";

export async function handlerResetMetrics(req: Request, res: Response): Promise<void> {
	config.api.fileserverHits = 0;
	res.status(200);
	res.end();
};
