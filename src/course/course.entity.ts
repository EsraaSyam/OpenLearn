import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DifficultyLevel } from "./enum/level.enum";
import { SectionEntity } from "src/section/section.entity";

@Entity('courses')
export class CourseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    uniqueTitle: string;

    @Column()
    description: string;

    @Column({ type: "decimal"})
    price: number;

    @Column({ type: "enum", enum: DifficultyLevel })
    difficultyLevel: DifficultyLevel;

    @Column()
    coverUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;

    @OneToMany(() => SectionEntity, section => section.course, { cascade: true })
    sections: SectionEntity[];

}