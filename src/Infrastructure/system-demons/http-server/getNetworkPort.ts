type GetNetworkPort = (targetPort?: string | number) => number;

/**
 * @description This function check target port from external origin
 * @param {targetPort} string or undefined, use with external origin like argv[2] or env.PORT
 * @description if {targetPort} is undefined or incompatible or in use this function return 0 for random available port
 * @description use -> const PORT = getNetworkPort(argv[2] ?? env.PORT)
 * @returns port number available in range 1024-65535 */
export const getNetworkPort = ((): GetNetworkPort => {
	const log = (m: string): void => console.log(`[GetNetworkPort]: ${m}`);

	return (p) => {
		if (!p) return 0;
		const port = typeof p === "number" ? p : parseInt(p);

		if (isNaN(port)) {
			log(`Target port '${p}' is incompatible, only numbers values`);
			return 0;
		}

		if (port < 1024 || port > 65535) {
			log("Invalid range, ports available 1024-65535");
			return 0;
		}

		return port;
	};
})();
