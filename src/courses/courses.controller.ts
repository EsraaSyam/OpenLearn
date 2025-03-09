import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseRequest } from './requests/create-course.request';
import { Response } from 'express';
import { isValidId } from 'src/validators/is-valid-id.decorator';

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

    @Get('all')
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('orderBy') orderBy: string = 'title',
        @Query('orderDirection') orderDirection: string = 'ASC',
        @Res() res: Response
    )  {
        const courses = await this.coursesService.findAllCourses(page, limit, orderBy, orderDirection);

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
