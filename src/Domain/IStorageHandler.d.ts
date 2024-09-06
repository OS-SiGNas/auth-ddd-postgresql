export interface IStorageHandler {
  readonly get: <T>(key: string) => Promise<T | null>;
  readonly set: (key: string, value: unknown) => Promise<void>;
}
