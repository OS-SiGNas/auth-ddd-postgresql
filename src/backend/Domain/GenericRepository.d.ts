import type { Pagination } from "./response/IResponse";

export interface GenericRepository<Entity, Filters extends Partial<Entity>> {
	exists: (unique: Filters) => Promise<boolean>;
	search: (f: Filters, order: "asc" | "desc", limit: number) => Promise<{ pagination: Pagination; data: Entity[] }>;

	getOneBy: (unique: Filters) => Promise<Entity | null>;

	save: (e: Entity) => void;
	delete: (unique: keyof Filters) => Promise<void>;
}
