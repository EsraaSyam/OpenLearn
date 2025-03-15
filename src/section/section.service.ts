import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { Repository } from 'typeorm';
import { CreateSectionRequest } from './request/create-section.request';
import { CoursesService } from 'src/course/course.service';
import { SectionAlreadyExistsException } from './exception/section-already-exists.exception';
import { SectionResponse } from './response/section.response';
import { SectionNotFoundException } from './exception/section-not-found.exception';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(SectionEntity)
        private readonly sectionRepository: Repository<SectionEntity>,
        private readonly courseService: CoursesService,
    ) { }

    async checkSectionDoesNotExist(order: number, courseId: number): Promise<void> {
        const section = await this.sectionRepository.findOne({ where: { order, course: { id: courseId } } });

        if (section) {
            throw new SectionAlreadyExistsException(courseId, order);
        }
    }

    async createSection(section: CreateSectionRequest, courseId: number): Promise<SectionResponse> {
        const course = await this.courseService.findCourseEntityById(courseId);

        await this.checkSectionDoesNotExist(section.order, courseId);

        const newSection = this.sectionRepository.create({ ...section, course });

        const savedSection = await this.sectionRepository.save(newSection);

        return new SectionResponse(savedSection);
    }

    async getSectionByOrderForCourse(order: number, courseId: number): Promise<SectionResponse> {
        const section = await this.sectionRepository.findOne({ where: { order, course: { id: courseId }, deletedAt: null }, relations: ['course'] });

        if (!section) {
            throw new SectionNotFoundException(order);
        }

        return new SectionResponse(section);
    }

    async findSectionById(id: number): Promise<SectionResponse> {
        const section = await this.sectionRepository.findOne({ where: { id, deletedAt: null }, relations: ['course'] });

        if (!section) {
            throw new SectionNotFoundException(id);
        }

        return new SectionResponse(section);
    }

    async getSectionsByCourseId(courseId: number): Promise<SectionResponse[]> {
        const sections = await this.sectionRepository.find({ where: { course: { id: courseId }, deletedAt: null }, relations: ['course'] });

        return sections.map(section => new SectionResponse(section));
    }

    async getSectionEntityById(id: number): Promise<SectionEntity> {
        const section = await this.sectionRepository.findOne({ where: { id, deletedAt: null }, relations: ['course'] });

        if (!section) {
            throw new SectionNotFoundException(id);
        }

        return section;
    }

    async updateSection(courseId:number, order: number, updateData: CreateSectionRequest): Promise<SectionResponse> {
        const section = await this.getSectionByOrderForCourse(order, courseId);

        await this.sectionRepository.save(
            Object.assign(section, {
                title: updateData.title ?? section.title,
                order: updateData.order ?? section.order,
            }
            )
        );

        const updatedSection = await this.getSectionEntityById(section.id);

        return new SectionResponse(updatedSection);
    }

    async softDeleteSection(order: number, courseId: number): Promise<void> {
        const section = await this.getSectionByOrderForCourse(order, courseId);

        await this.sectionRepository.update(section.id, { deletedAt: new Date() });
    }

}
