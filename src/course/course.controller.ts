import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, Req, Res } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseRequest } from './request/create-course.request';
import { Response } from 'express';
import { isValidId } from 'src/validator/is-valid-id.decorator';
import { cp } from 'fs';
import { FindCoursesRequest } from './request/find-courses.request';
import { UpdateCourseRequest } from './request/update-course.request';

@Controller('course')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Post()
    async createCourse(@Body() body: CreateCourseRequest, @Res() res: Response) {
        const course = await this.coursesService.createCourse(body);

        return res.status(201).json({
            data: course,
        });
    }

    @Get()
    async findAll(@Query() params: FindCoursesRequest, @Res() res: Response)  {
        const courses = await this.coursesService.findAllCourses(params);

        return res.status(200).json({
            data: courses,
        });

    }


    @Get(':id')
    async findCourseById(@isValidId() id: number, @Res() res: Response) {
        const course = await this.coursesService.findCourseById(id);
        return res.status(200).json({
            data: course,
        });
    }

    @Put(':id')
    async updateCourse(@isValidId() id: number, @Body() body: UpdateCourseRequest, @Res() res: Response) {
        const course = await this.coursesService.updateCourse(id, body);

        return res.status(200).json({
            data: course,
        });
    }

    @Delete(':id')
    async softDeleteCourse(@isValidId() id: number, @Res() res: Response) {
        await this.coursesService.softDeleteCourse(id);

        return res.status(204).send();
    }

}
