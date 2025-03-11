import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';
import { Repository } from 'typeorm';
import { CourseNotFoundException } from './exceptions/course-not-found.exception';
import { CreateCourseRequest } from './requests/create-course.request';
import { CourseResponse } from './responses/course.response';
import { FindCoursesRequest } from './requests/find-courses.request';
import { FindCoursesResponse } from './responses/find-courses.response';

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


    async findAllCourses(params: FindCoursesRequest): Promise<FindCoursesResponse> {
        const { page, limit, orderBy, orderDirection } = params;

        const offset = (page - 1) * limit;

        const [courses, total] = await this.courseRepository.findAndCount({
            skip: offset,
            take: limit,
            order: { [orderBy]: orderDirection },
        });

        return new FindCoursesResponse(courses, total, page, limit);
    }

    async createCourse(course: CreateCourseRequest): Promise<CourseEntity> {
        return await this.courseRepository.save(course);
    }
}
