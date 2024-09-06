import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity.js";

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
