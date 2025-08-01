import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses } from "./api/middleware.js";
import { incFileserverHits, getFileserverHits } from "./config.js";

const app = express();
const PORT = 8080;

const middlewareMetrics = (_req: Request, _res: Response, next: NextFunction) => {
	incFileserverHits();
	next();
}
app.use(middlewareMetrics);
app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

const handlerReadiness = async (req: Request, res: Response): Promise<void> => {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send("OK");
};
app.get("/healthz", handlerReadiness);

const handlerGetMetrics = async (req: Request, res: Response): Promise<void> => {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send(`Hits: ${getFileserverHits()}`);
}
app.get("/metrics", handlerGetMetrics);

app.listen(PORT);
