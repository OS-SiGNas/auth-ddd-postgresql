import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./roles.entity.js";

import type { IUser } from "../IUser";

@Entity()
export class User extends BaseEntity implements IUser {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ default: crypto.randomUUID() })
	uuid: string;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: false })
	name: string;

	@ManyToMany(() => Role, (role) => role.users)
	@JoinTable()
	roles: Role[];

	@Column({ name: "created_at", default: new Date() })
	createdAt: Date;

	@Column({ name: "is_active", default: false })
	isActive: boolean;
}
