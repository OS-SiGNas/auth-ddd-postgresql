import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity.js";
import { RoleName } from "../role-name.enum.js";

@Entity()
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ type: "enum", enum: RoleName, unique: true, nullable: false })
	name: RoleName;

	@ManyToMany(() => User, (user) => user.roles)
	users: User[];
}
