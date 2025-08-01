import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", () => {
		try {
			const parsedBody = JSON.parse(body);
			res.header("Content-Type", "application/json");

			const msg = parsedBody["body"];
			if (!msg || msg.length > 100) {
				res.status(400);
				res.send(JSON.stringify({ error: "Chirp is too long" }));
				return;
			}

			res.status(200);
			res.send(JSON.stringify({ valid: true }));
		} catch (_err) {
			res.header("Content-Type", "application/json");
			res.status(400);
			res.send(JSON.stringify({ error: "Something went wrong" }));
		}
	});
};

