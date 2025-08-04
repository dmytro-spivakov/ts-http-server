import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type DBConfig = {
	url: string;
	migrationConfig: MigrationConfig;
}

type APIConfig = {
	fileserverHits: number;
	platform: string;
}

type Config = {
	db: DBConfig;
	api: APIConfig;
};

const config: Config = {
	db: {
		url: envOrThrow("DB_URL"),
		migrationConfig: {
			migrationsFolder: "./src/db/migrations",
		},
	},
	api: {
		platform: envOrThrow("PLATFORM"),
		fileserverHits: 0,
	}
}

function envOrThrow(key: string): string {
	const envVal = process.env[key];
	if (typeof envVal === "string") {
		return envVal;
	}

	throw new Error(`ENV VARIABLE MISSING - ${key}`);
}

export { config };
