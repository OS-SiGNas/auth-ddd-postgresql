import { z, ZodError } from "zod";
import { type Secrets, UnprocessableException422 } from "#Domain";

export const secretsParser = (origin: object): Secrets => {
	const zString = z.string().nonempty();
	const zPort = z.string().transform(Number).pipe(z.number().positive().min(80).max(65535));
	const zNumber = z.string().transform(Number).pipe(z.number().positive());
	const zPassword = z.string().min(8).max(64);

	const pgSchema = {
		PG_HOST: zString,
		PG_PORT: zPort,
		PG_USERNAME: zString,
		PG_PASSWORD: zPassword,
		PG_DATABASE: zString,
		PG_RETRY_TIME: zNumber,
	};

	const jwtSchema = {
		JWT_ACCESS_SECRET_KEY: zString,
		JWT_ACCESS_EXPIRED_TIME: zNumber,
		JWT_REFRESH_SECRET_KEY: zString,
		JWT_REFRESH_EXPIRED_TIME: zNumber,
		JWT_AA_SECRET_KEY: zString,
		JWT_AA_EXPIRED_TIME: zNumber,
	};

	const rabbitSchema = {
		RABBIT_QUEUE: zString,
		RABBIT_PORT: zPort,
		RABBIT_HOSTNAME: zString,
		RABBIT_PROTOCOL: zString,
		RABBIT_USERNAME: zString,
		RABBIT_PASSWORD: zPassword,
		RABBIT_VHOST: zString,
	};

	const schema = {
		SERVICE_NAME: zString,
		LOGGER_SERVICE: z.enum(["winston", "console"]),
		HTTP_SERVICE: z.enum(["express", "fastify"]),
		THIS_URL: zString,
		PORT: zPort,
		...pgSchema,
		...jwtSchema,
		...rabbitSchema,
	};

	try {
		return z.object(schema).parse(origin);
	} catch (error) {
		if (!(error instanceof ZodError)) throw error;
		const cause: string[] = error.issues.map(({ path, message }) => `${path}: ${message}`);
		throw new UnprocessableException422("*Config* Dotenv file incompatible 💩", { cause });
	}
};
