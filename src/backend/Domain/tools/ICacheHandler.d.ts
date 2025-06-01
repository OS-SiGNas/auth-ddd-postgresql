export interface ICacheHandler {
	/**
	 * @param key unique string identify
	 * @param value data */
	readonly set: (key: string, value: unknown) => Promise<void>;
	readonly get: <T>(key: string) => Promise<T | null>;
	readonly delete: (key: string) => Promise<boolean>;
}
