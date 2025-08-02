import express from "express";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerGetMetrics } from "./api/admin/metrics.js";
import { handlerResetMetrics } from "./api/admin/reset.js";
import { handlerValidateChirp } from "./api/validate-chirp.js";

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(PROJECT_ROOT, 'src');
const VIEWS_ROOT = path.join(SRC_ROOT, "app", "views");

const app = express();
app.set("view engine", "ejs");
app.set("views", VIEWS_ROOT);
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());

// routes
app.get("/api/healthz", (req, res, next) => {
	Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
	Promise.resolve(handlerGetMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
	Promise.resolve(handlerResetMetrics(req, res)).catch(next)
});
app.post("/api/validate_chirp", (req, res, next) => {
	Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

// err handling
app.use(errorHandler);

// start
app.listen(PORT);
