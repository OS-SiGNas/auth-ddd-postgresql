import type { SystemDaemon } from "#Domain";

export default new (class implements SystemDaemon {
	constructor() {}
	restart: () => Promise<void>;
	stop: () => Promise<void>;
	start: () => Promise<void>;
})();
