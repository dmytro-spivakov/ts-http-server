import bcrypt from "bcrypt"

export function hashPassword(password: string): string {
	const saltRounds = 2;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

export function checkPasswordHash(password: string, hash: string): boolean {
	return bcrypt.compareSync(password, hash);
}
