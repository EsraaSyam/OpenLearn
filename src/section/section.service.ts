import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateSectionRequest } from './request/create-section.request';
import { CoursesService } from 'src/course/course.service';
import { SectionAlreadyExistsException } from './exception/section-already-exists.exception';
import { SectionResponse } from './response/section.response';
import { FindSectionRequest } from './request/find-sections.request';
import { FindSectionResponse } from './response/find-sections.response';
import { SectionIdNotFoundException } from './exception/section-id-not-found.exception';
import { UpdateSectionRequest } from './request/update-section.request';
import { SectionOrderNotFoundException } from './exception/section-order-not-found.exception';

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
            throw new SectionIdNotFoundException(id);
        }

        return new SectionResponse(section);
    }

    async findSectionEntityById(id: number): Promise<SectionEntity> {
        const section = await this.sectionRepository.findOne({ where: { id }, relations: ['course'] });

        if (!section) {
            throw new SectionIdNotFoundException(id);
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

        const targetSection = await this.findSectionEntityById(id);

        targetSection.title = title ?? targetSection.title;

        if (order && order !== targetSection.order) {
            await this.reorderSections(targetSection, order);
        }

        const updatedSection = await this.sectionRepository.save(targetSection);
        return new SectionResponse(updatedSection);
    }

    private async findSectionByOrder(courseId: number, order: number): Promise<SectionEntity> {
        const section =  this.sectionRepository.findOne({ where: { course: { id: courseId }, order } });

        if (!section) {
            throw new SectionOrderNotFoundException(order);
        }

        return section;
    }

    private async reorderSections(targetSection: SectionEntity, newOrder: number): Promise<void> {
        const courseId = targetSection.course.id;

        const maxOrder = await this.getLastSectionInCourse(courseId);

        if (newOrder > maxOrder) {
            throw new BadRequestException(`New order must be between 1 and ${maxOrder}`);
        }

        const sectionToMove = targetSection; 
        const sectionAtTargetPosition = await this.findSectionByOrder(courseId, newOrder);

        await this.sectionRepository.manager.transaction(async (manager) => {
            const tempOrder = sectionToMove.order;
            sectionToMove.order = sectionAtTargetPosition.order;
            sectionAtTargetPosition.order = tempOrder;

            await manager.save([sectionToMove, sectionAtTargetPosition]);
        });
    }

    async softDeleteSection(id: number): Promise<void> {
        const section = await this.findSectionEntityById(id);

        await this.sectionRepository.update(id, { deletedAt: new Date() });

        await this.reorderSectionsOnDelete(section);
    }

    private async reorderSectionsOnDelete(section: SectionEntity): Promise<void> {
        const courseId = section.course.id;
    
        await this.sectionRepository.manager.transaction(async (manager) => {
            await manager
                .createQueryBuilder()
                .update(SectionEntity)
                .set({ order: () => 'order - 1' })
                .where('course_id = :courseId AND order > :order', {
                    courseId,
                    order: section.order,
                })
                .execute();
        });
    }
}

