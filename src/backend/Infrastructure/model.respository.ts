import type { BaseEntity } from "typeorm";

import { User } from "#users/v1/domain/entities/users.entity.js";
import { Role } from "#users/v1/domain/entities/roles.entity.js";

type Entities = "User" | "Role";
export interface ModelRepository {
	get: <T extends typeof BaseEntity>(name: Entities) => T;
}

export const modelRepository: ModelRepository = new (class {
	readonly #map: Map<Entities, typeof BaseEntity> = new Map();
	constructor() {
		this.#map.set("User", User);
		this.#map.set("Role", Role);
	}

	public readonly get = <T extends typeof BaseEntity>(name: Entities): T => {
		const entitie = this.#map.get(name);
		if (entitie === undefined) throw new Error(`Model '${name}' is undefined`);
		return entitie as T;
	};
})();
