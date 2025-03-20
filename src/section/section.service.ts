import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { Repository } from 'typeorm';
import { CreateSectionRequest } from './request/create-section.request';
import { CoursesService } from 'src/course/course.service';
import { SectionAlreadyExistsException } from './exception/section-already-exists.exception';
import { SectionResponse } from './response/section.response';
import { FindSectionRequest } from './request/find-sections.request';
import { FindSectionResponse } from './response/find-sections.response';
import { SectionNotFoundException } from './exception/section-not-found.exception';

@Injectable()
export class SectionService {
    constructor(
        @InjectRepository(SectionEntity)
        private readonly sectionRepository: Repository<SectionEntity>,
        private readonly courseService: CoursesService,
    ) { }

    async getLastSectionInCourse(courseId: number): Promise<number> {
        return this.sectionRepository.count({ where: { course: { id: courseId } } });
    }

    async createSection(section: CreateSectionRequest): Promise<SectionResponse> {
        const { courseId } = section;

        const lastSection = await this.getLastSectionInCourse(courseId);

        const course = await this.courseService.findCourseEntityById(courseId);

        const newSection = await this.sectionRepository.create({ ...section, course, order: lastSection + 1 });

        const savedSection = await this.sectionRepository.save(newSection);

        return new SectionResponse(savedSection);
    }

    async findSectionById(id: number): Promise<SectionResponse> {
        const section = await this.sectionRepository.findOne({ where: { id } });

        if (!section) {
            throw new SectionNotFoundException(id);
        }

        return new SectionResponse(section);
    }

    async findAllSections(params: FindSectionRequest): Promise<FindSectionResponse> {
        const { page, limit, orderBy, orderDirection } = params;

        const offset = (page - 1) * limit;

        const whereClause: any = { deletedAt: null }; 

        if (params.courseId) {
            whereClause.course = { id: params.courseId };
        }

        const [sections, total] = await this.sectionRepository.findAndCount({
            where: whereClause,
            skip: offset,
            take: limit,
            order: { [orderBy]: orderDirection },
            relations: ['course'],
        });

        return new FindSectionResponse(sections, total, page, limit);
    }


}