type APIConfig = {
	fileserverHits: number;
};

const config: APIConfig = {
	fileserverHits: 0,
}

function incFileserverHits(): number {
	return config.fileserverHits++;
}

function getFileserverHits(): number {
	return config.fileserverHits;
}

export { incFileserverHits, getFileserverHits };
