import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./enums/rols.enum";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ type: 'enum', enum: Roles, default: Roles.USER })
    role: Roles = Roles.USER;

    @Column({ default: false })
    isOAuthUser: boolean = false;
}