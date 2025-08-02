process.loadEnvFile();

type APIConfig = {
	dbURL: string;
	fileserverHits: number;
};

const config: APIConfig = {
	dbURL: envOrThrow("DB_URL"),
	fileserverHits: 0,
}

function envOrThrow(key: string): string {
	const envVal = process.env[key];
	if (typeof envVal === "string") {
		return envVal;
	}

	throw new Error(`ENV VARIABLE MISSING - ${key}`);
}

export { config };
