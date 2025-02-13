import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../enums/rols.enum";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    role: Roles = Roles.USER;
}