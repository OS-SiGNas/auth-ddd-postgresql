import { type ISession } from "#Domain";
import type { HttpProxyResponse, IHttpProxy, Method, Req1, Req2, RequestParams } from "../domain/IHttpProxy";

interface Dependences {
	url?: string;
	timeout: number;
	mode?: RequestMode;
	cache?: RequestCache;
	credentials?: RequestCredentials;
	headers?: HeadersInit;
	debug: boolean;
}

export class HttpProxy implements IHttpProxy {
	readonly #name = `${this.constructor.name}`;
	readonly #debug: boolean;
	readonly #logger = {
		warn: (msg: string): void => console.warn(`[${this.#name}]: ${msg}`),
		info: (msg: string): void => console.info(`[${this.#name}]: ${msg}`),
		error: (error: unknown): void => console.error(`[${this.#name}]: `, error),
	};

	readonly #url: string;
	readonly #timeout: number;
	readonly #options: RequestInit;
	#session?: ISession;
	constructor(d: Readonly<Dependences>) {
		this.#debug = d.debug;
		this.#timeout = d.timeout;
		this.#url = d.url ?? "";
		this.#options = {
			credentials: d.credentials ?? "same-origin",
			cache: d.cache ?? "no-cache",
			mode: d.mode ?? "cors",
			headers: d.headers,
		};
	}

	public readonly setHeader = (key: string, value: string): HttpProxy => {
		this.#options.headers = { ...this.#options.headers, [key]: value };
		return this;
	};

	public get session(): ISession | undefined {
		if (this.#session === undefined) this.#logger.warn("session undefined");
		return this.#session;
	}

	public set session(session: ISession | undefined) {
		// const headers: HeadersInit = { ...this.#options.headers, Authorization: `Bearer ${session.accessToken}` };
		// this.#options.headers = headers;
		if (this.#session !== undefined && this.#debug) this.#logger.info("current session muted");
		if (session === undefined) this.setHeader("Authorization", "");
		else this.setHeader("Authorization", `Bearer ${session.accessToken}`);
		this.#session = session;
	}

	public readonly sendRequest = async <R>(request: RequestParams, signal: AbortSignal): HttpProxyResponse<R> => await this.#request<R>(request, signal);

	public readonly get: Req1 = async (endpoint, signal) => await this.#request({ method: "GET", endpoint }, signal);
	public readonly post: Req2 = async (endpoint, body, signal) => await this.#request({ method: "POST", endpoint, body }, signal);
	public readonly put: Req2 = async (endpoint, body, signal) => await this.#request({ method: "PUT", endpoint, body }, signal);
	public readonly patch: Req2 = async (endpoint, body, signal) => await this.#request({ method: "PATCH", endpoint, body }, signal);
	public readonly del: Req1 = async (endpoint, signal) => await this.#request({ method: "DELETE", endpoint }, signal);

	readonly #getOptions = (method: Method, signals: AbortSignal[], body?: object): Readonly<RequestInit> => ({
		...this.#options,
		signal: AbortSignal.any(signals),
		body: JSON.stringify(body),
		method,
	});

	readonly #request = async <R>({ method, endpoint, body }: RequestParams, signal: AbortSignal): HttpProxyResponse<R> => {
		const path = `${this.#url}${endpoint}`;
		const timeoutSignal = AbortSignal.timeout(this.#timeout);
		const options = this.#getOptions(method, [timeoutSignal, signal], body);
		if (this.#debug) this.#logger.info(`🌎 ${path}`);
		try {
			const response = await globalThis.fetch(path, options);
			const contentType = response.headers.get("content-type");
			if (contentType !== null && !contentType.includes("json"))
				throw new Error(`${response.status} - ${await response.text()}`, { cause: `Non-serializable content` });
			return await response.json();
		} catch (error) {
			if (this.#debug) this.#logger.error(error);
			const timestamp = Date.now().toString();
			const message = (error as Error)?.message ?? "null";
			const status = { success: false, code: 500 - 500, timestamp, message };
			return { status, error };
		}
	};
}
