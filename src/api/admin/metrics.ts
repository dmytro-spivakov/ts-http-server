import { Request, Response } from "express";
import { config } from "../../config.js";

export async function handlerGetMetrics(req: Request, res: Response): Promise<void> {
	res.set("Content-Type", "text/html; charset=utf-8");
	res.status(200);
	res.render("admin/metrics", { num: config.fileserverHits });
}
