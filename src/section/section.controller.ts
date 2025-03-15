import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionRequest } from './request/create-section.request';
import { Response } from 'express';
import { isValidCourseId } from './validator/is-valid-course-id.decorator';
import { isValidOrder } from './validator/is-valid-order.decorator';

@Controller('course/:courseId/section')
export class SectionController {
    constructor(
        private readonly sectionService: SectionService,
    ) {}

    @Post()
    async createSection(@isValidCourseId() courseId: number, @Body() section: CreateSectionRequest, @Res() res :Response) {
        const newSection = await this.sectionService.createSection(section, courseId);

        return res.status(201).json({
            data: newSection,
        });
    }

    @Get(':order')
    async getSectionByOrderForCourse(@isValidOrder() order: number, @isValidCourseId() courseId: number, @Res() res: Response) {
        const section = await this.sectionService.getSectionByOrderForCourse(order, courseId);

        return res.status(200).json({
            data: section,
        });
    }

    @Get()
    async getSectionsByCourseId(@isValidCourseId() courseId: number, @Res() res: Response) {
        const sections = await this.sectionService.getSectionsByCourseId(courseId);

        return res.status(200).json({
            data: sections,
        });
    }

    @Put(':order')
    async updateSection(@isValidOrder() order: number, @isValidCourseId() courseId: number, @Body() section: CreateSectionRequest, @Res() res: Response) {
        const updatedSection = await this.sectionService.updateSection(courseId, order, section);

        return res.status(200).json({
            data: updatedSection,
        });
    }

    @Delete(':order')
    async softDeleteSection(@isValidOrder() order: number, @isValidCourseId() courseId: number, @Res() res: Response) {
        await this.sectionService.softDeleteSection(order, courseId);

        return res.status(204).send();
    }
}
