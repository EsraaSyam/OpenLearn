import { HttpException, HttpStatus } from '@nestjs/common';

export class CourseNotFoundException extends HttpException {
    constructor(courseId: number) {
        super(`Course with ID '${courseId}' not found`, HttpStatus.NOT_FOUND);
    }
}
