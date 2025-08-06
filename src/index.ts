import express from "express";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerGetMetrics } from "./api/admin/metrics.js";
import { handlerResetMetrics } from "./api/admin/reset.js";
import { handlerCreateChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirps.js";
import { handlerCreateUser, handlerLogin } from "./api/users.js";

import { config } from "./config.js";

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.join(PROJECT_ROOT, 'src');
const VIEWS_ROOT = path.join(SRC_ROOT, "app", "views");

// automatic migrations
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.set("view engine", "ejs");
app.set("views", VIEWS_ROOT);
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(express.json());

// routes

// healthcheck
app.get("/api/healthz", (req, res, next) => {
	Promise.resolve(handlerReadiness(req, res)).catch(next);
});

// admin
app.get("/admin/metrics", (req, res, next) => {
	Promise.resolve(handlerGetMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
	Promise.resolve(handlerResetMetrics(req, res)).catch(next)
});

// chirps
app.post("/api/chirps", (req, res, next) => {
	Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
	Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpID", (req, res, next) => {
	Promise.resolve(handlerGetChirp(req, res)).catch(next);
});

// users
app.post("/api/users", (req, res, next) => {
	Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
	Promise.resolve(handlerLogin(req, res)).catch(next);
});

// err handling
app.use(errorHandler);

// start
app.listen(PORT);
