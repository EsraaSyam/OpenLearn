import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';
import { Repository } from 'typeorm';
import { CourseNotFoundException } from './exception/course-not-found.exception';
import { CreateCourseRequest } from './request/create-course.request';
import { CourseResponse } from './response/course.response';
import { FindCoursesRequest } from './request/find-courses.request';
import { FindCoursesResponse } from './response/find-courses.response';
import { UpdateCourseRequest } from './request/update-course.request';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepository: Repository<CourseEntity>,
    ) { }

    async findCourseById(id: number): Promise<CourseResponse> {
        const course = await this.findCourseEntityById(id);

        return new CourseResponse(course);
    }


    async findAllCourses(params: FindCoursesRequest): Promise<FindCoursesResponse> {
        const { page, limit, orderBy, orderDirection } = params;

        const offset = (page - 1) * limit;

        const [courses, total] = await this.courseRepository.findAndCount({
            where: { deletedAt: null },
            skip: offset,
            take: limit,
            order: { [orderBy]: orderDirection },
        });

        return new FindCoursesResponse(courses, total, page, limit);
    }

    async createCourse(course: CreateCourseRequest): Promise<CourseResponse> {
        const newCourse = await this.courseRepository.save(course);
        return new CourseResponse(newCourse);
    }

    async findCourseEntityById(id: number): Promise<CourseEntity> {
        const course = await this.courseRepository.findOneBy({ id, deletedAt: null });

        if (!course) {
            throw new CourseNotFoundException(id);
        }

        return course;
    }

    async updateCourse(id: number, updateData: UpdateCourseRequest): Promise<CourseResponse> {
        const existingCourse = await this.findCourseEntityById(id);

        const updatedCourse = await this.courseRepository.save(
            Object.assign(existingCourse, {
                title: updateData.title ?? existingCourse.title,
                description: updateData.description ?? existingCourse.description,
                difficultyLevel: updateData.difficultyLevel ?? existingCourse.difficultyLevel,
                price: updateData.price ?? existingCourse.price,
            })
        );

        return new CourseResponse(updatedCourse);
    }

    async softDeleteCourse(id: number): Promise<void> {
        const course = await this.findCourseEntityById(id);

        await this.courseRepository.update(id, { deletedAt: new Date() });
    }
}
