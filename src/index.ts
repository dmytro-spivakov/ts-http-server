import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses } from "./api/middleware-log-responses.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

const handlerReadiness = async (req: Request, res: Response): Promise<void> => {
	res.set("Content-Type", "text/plain");
	res.status(200);
	res.send("OK");
};
app.get("/healthz", handlerReadiness);

app.listen(PORT);
