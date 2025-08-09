import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import type { JwtPayload, Jwt } from "jsonwebtoken";

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
export function makeJWT(userID: string, expiresIn: number, secret: string): string {
	type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

	const iat = Math.floor(Date.now() / 1000);
	const jwtPayload: payload = {
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
	const decodedJWT = jwt.verify(tokenString, secret, { complete: true }) as Jwt;

	let userID;
	try {
		userID = decodedJWT.payload.sub;
	} catch (err) {
		console.log(`Failed to validate JWT ${tokenString}, decodedJWT=${JSON.stringify(decodedJWT)}`);
	}
	if (!userID || typeof userID !== "string") {
		throw new Error(`Failed to validate JWT ${tokenString}, userID=${userID}, decodedJWT=${JSON.stringify(decodedJWT)}`);
	}

	return userID;
}
