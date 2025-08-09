import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";
import type { JwtPayload, Jwt } from "jsonwebtoken";

const TOKEN_ISSUER = "chirpy";

// password
export function hashPassword(password: string): string {
	const saltRounds = 2;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

export function checkPasswordHash(password: string, hash: string): boolean {
	return bcrypt.compareSync(password, hash);
}

// jwt
type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
	const iat = Math.floor(Date.now() / 1000);
	const jwtPayload: Payload = {
		iss: "chirpy",
		sub: userID,
		iat: iat,
		exp: iat + expiresIn,
	};

	const token = jwt.sign(jwtPayload, secret);
	console.log(`JWT = ${token}`);
	return token;
}

export function validateJWT(tokenString: string, secret: string): string {
	let decoded;
	try {
		decoded = jwt.verify(tokenString, secret, { complete: true }) as Jwt;
	} catch (err) {
		if (err instanceof Error) {
			throw new UnauthorizedError(`Invalid token - ${err.message}`);
		} else {
			throw new UnauthorizedError("Invalid token");
		}
	}

	let payload = decoded.payload as JwtPayload;

	if (payload.iss != TOKEN_ISSUER) {
		throw new UnauthorizedError("Invalid token issuer");
	}

	const userID = payload.sub;
	if (!userID || typeof userID !== "string") {
		throw new UnauthorizedError("Token must contain valid userID");
	}
	return userID;
}
