import { writeFile } from "node:fs/promises";
import type { Transport } from "../Transport.ts";

/**
 * @description singleton transport for writeable stream .log file */
export class FileAsyncTransport implements Transport {
    static #instance?: FileAsyncTransport;

    readonly #file: string;

    constructor() {
        if (FileAsyncTransport.#instance !== undefined) return FileAsyncTransport.#instance;
        else FileAsyncTransport.#instance = this;

        const date = new Date().toISOString();
        this.#file = `./logs/${date}.log`;
    }

    public readonly exec: Transport["exec"] = async (l, ...meta) => {
        const message = `${l.level} ${l.date} [${l.name}] ${l.message}`;
        await writeFile(this.#file, message);

        if (meta.length === 0) return Promise.resolve();

        for (const out of meta) {
            const stringOutput = out instanceof Error ? String(out.stack) : String(out);
            await writeFile(this.#file, stringOutput);
        }

        return Promise.resolve();
    };
}
