import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { Repository } from 'typeorm';
import { CreateSectionRequest } from './request/create-section.request';
import { CoursesService } from 'src/course/course.service';
import { SectionAlreadyExistsException } from './exception/section-already-exists.exception';
import { SectionResponse } from './response/section.response';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(SectionEntity)
        private readonly sectionRepository: Repository<SectionEntity>,
        private readonly courseService: CoursesService,
    ) { }

    async sectionCount(courseId: number): Promise<number> {
        return this.sectionRepository.count({ where: { course: { id: courseId } }});
    }

    async createSection(section: CreateSectionRequest): Promise<SectionResponse> {
        const { courseId } = section;

        const sectionCount = await this.sectionCount(courseId);

        const course = await this.courseService.findCourseEntityById(courseId);

        const newSection = await this.sectionRepository.create({ ...section, course, order: sectionCount + 1 });

        const savedSection = await this.sectionRepository.save(newSection);

        return new SectionResponse(savedSection);
    }

}