import express, { NextFunction, Request, Response } from "express";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerGetMetrics } from "./api/metrics.js";
import { handlerResetMetrics } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerGetMetrics);
app.get("/reset", handlerResetMetrics);

app.listen(PORT);
