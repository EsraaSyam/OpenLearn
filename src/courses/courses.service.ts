import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CourseNotFoundException } from './exceptions/course-not-found.exception';
import { CreateCourseRequest } from './requests/create-course.request';
import { CourseResponse } from './responses/course.response';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
    ) { }

    async findCourseById(id: number): Promise<CourseEntity> {
        const course = await this.courseRepository.findOneBy({ id });

        if (!course) {
            throw new CourseNotFoundException(id);
        }

        return course;
    }

    async findAllCourses(page: number, limit: number, orderBy: string, orderDirection: string): Promise<{ courses: CourseEntity[], total: number, page: number, numberOfPages: number, limit: number }> {
        if (isNaN(page)) page = 1;
        if (isNaN(limit)) limit = 10;

        if (page <= 0) {
            throw new BadRequestException('page must be greater than or equal to 1');
        }

        if (limit <= 0) {
            throw new BadRequestException('limit must be greater than or equal to 1');
        }

        const validOrderDirections = ['ASC', 'DESC'];

        const normalizedOrderDirection = orderDirection.toUpperCase();

        if (!validOrderDirections.includes(normalizedOrderDirection)) {
            throw new BadRequestException('Order direction must be ASC or DESC');
        }

        const offset = (page - 1) * limit;

        const [courses, total] = await this.courseRepository.findAndCount({
            skip: offset,
            take: limit,
            order: { [orderBy]: orderDirection },
        });

        const numberOfPages = Math.ceil(total / limit);

        page = Number(page);
        limit = Number(limit);

        return {
            courses,
            total,
            page,
            numberOfPages,
            limit,
        }
    }

    async createCourse(course: CreateCourseRequest): Promise<CourseEntity> {
        return await this.courseRepository.save(course);
    }
}
