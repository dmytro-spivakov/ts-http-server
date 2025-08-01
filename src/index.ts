import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses } from "./api/middleware.js";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

const middlewareMetrics = (_req: Request, _res: Response, next: NextFunction) => {
	config.fileserverHits++;
	next();
}
app.use(middlewareLogResponses);
app.use(middlewareMetrics);

const handlerReadiness = async (req: Request, res: Response): Promise<void> => {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send("OK");
};
app.get("/healthz", handlerReadiness);

const handlerGetMetrics = async (req: Request, res: Response): Promise<void> => {
	config.fileserverHits--;
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send(`Hits: ${config.fileserverHits}`);
}
app.get("/metrics", handlerGetMetrics);

const handlerResetMetrics = async (req: Request, res: Response): Promise<void> => {
	config.fileserverHits = 0;
	res.status(200);
	res.end();
}
app.get("/reset", handlerResetMetrics);

app.use("/app", express.static("./src/app"));
app.listen(PORT);
