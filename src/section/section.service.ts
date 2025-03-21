import { BadRequestException, Injectable } from '@nestjs/common';
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
import { UpdateSectionRequest } from './request/update-section.request';

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

    async findSectionEntityById(id: number): Promise<SectionEntity> {
        const section = await this.sectionRepository.findOne({ where: { id }, relations: ['course'] });

        if (!section) {
            throw new SectionNotFoundException(id);
        }

        return section;
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


    async updateSection(request: UpdateSectionRequest, id: number): Promise<SectionResponse> {
        const { title, order } = request;

        if (!title && !order) {
            throw new BadRequestException('At least one field must be provided');
        }
        
        const section = await this.findSectionEntityById(id);

        if (title) {
            section.title = title;
        }

        if (order && order !== section.order) {
            await this.reorderSections(section, order);
            section.order = order;
        }

        const updatedSection = await this.sectionRepository.save(section);
        return new SectionResponse(updatedSection);
    }

    private async reorderSections(section: SectionEntity, newOrder: number): Promise<void> {
        const courseId = section.course.id;
        const oldOrder = section.order;
        const maxOrder = await this.getLastSectionInCourse(courseId);

        if ( newOrder > maxOrder) {
            throw new BadRequestException(`New order must be less than or equal to ${maxOrder}`);
        }

        const queryBuilder = this.sectionRepository.createQueryBuilder()
            .update(SectionEntity);

        if (oldOrder < newOrder) { 
            queryBuilder
                .set({ order: () => 'order - 1' })
                .where('course_id = :courseId AND order > :oldOrder AND order <= :newOrder', {
                    courseId,
                    oldOrder,
                    newOrder,
                });
        } else {
            queryBuilder
                .set({ order: () => 'order + 1' })
                .where('course_id = :courseId AND order >= :newOrder AND order < :oldOrder', {
                    courseId,
                    oldOrder,
                    newOrder,
                });
        }

        await queryBuilder.execute();
    }
}

