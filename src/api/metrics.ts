import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerGetMetrics(req: Request, res: Response): Promise<void> {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send(`Hits: ${config.fileserverHits}`);
}
