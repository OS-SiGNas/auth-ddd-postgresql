export interface ILogger {
  readonly info: (text: string) => void;
  readonly warn: (text: string) => void;
  readonly error: (error: unknown) => void;
  readonly debug: (object: unknown) => void;
}
