import { z } from "zod";

export interface IRequest {
	correlationId: string;
	headers: {
		authorization: string;
	};
}

export const RequestSchemas = {
	correlationId: z.string().uuid(),
	headers: z.object({
		authorization: z.string().regex(/^Bearer\s([^\s]+)$/),
	}),
};
