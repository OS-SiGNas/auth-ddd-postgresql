import { Socket } from "node:net";

type ServerStatus = {
	online: boolean;
	responseTime?: number;
	error?: string;
};

export interface PingProxy {
	getServerStatus: (hos: string, port: number, timeout: number) => Promise<ServerStatus>;
}

export const ping: PingProxy["getServerStatus"] = async (host, port, timeout = 5000): Promise<ServerStatus> => {
	let startTime: number;
	const _connectListener = (): void => {
		startTime = Date.now();
		console.log(`Listener: ${startTime}`);
	};

	const socket = new Socket().setTimeout(timeout).connect(port, host, _connectListener);
	const _destroy = (): Socket => socket.removeAllListeners().destroy();

	return new Promise((resolve) => {
		socket
			.on("connect", () => {
				const responseTime = Date.now() - startTime;
				void _destroy();
				resolve({ online: true, responseTime });
			})
			.on("timeout", () => {
				void _destroy();
				resolve({ online: false, error: "Connection timeout" });
			})
			.on("error", (err) => {
				void _destroy();
				resolve({ online: false, error: err.message });
			});
	});
};
