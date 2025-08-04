import { Request, Response } from "express";
import { config } from "../../config.js";
import { UnauthorizedError } from "../errors.js";
import { resetUsers } from "../../db/queries/users.js";

export async function handlerResetMetrics(req: Request, res: Response): Promise<void> {
	if (config.api.platform != "dev") {
		throw new UnauthorizedError("403 Forbidden");
	}

	await resetUsers();
	config.api.fileserverHits = 0;
	res.status(200);
	res.end();
};
