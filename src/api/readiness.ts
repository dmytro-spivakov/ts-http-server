import type { Request, Response } from "express";

export async function handlerReadiness(req: Request, res: Response): Promise<void> {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send("OK");
};
