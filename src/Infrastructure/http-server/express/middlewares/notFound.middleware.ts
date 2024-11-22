import type { RequestHandler } from "express";

export const notFound: RequestHandler = (_, res) => res.sendStatus(404);
