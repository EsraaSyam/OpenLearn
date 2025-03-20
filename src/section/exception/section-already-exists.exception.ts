import { HttpException, HttpStatus } from '@nestjs/common';

export class SectionAlreadyExistsException extends HttpException {
    constructor(courseId: number, order: number) {
        super(`Section with order '${order}' already exists in course '${courseId}'`, HttpStatus.CONFLICT);
    }
}