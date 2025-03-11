import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseRequest } from './requests/create-course.request';
import { Response } from 'express';
import { isValidId } from 'src/validators/is-valid-id.decorator';
import { cp } from 'fs';
import { FindCoursesRequest } from './requests/find-courses.request';

@Controller('courses')
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

}
