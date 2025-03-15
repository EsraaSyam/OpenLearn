import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const isValidCourseId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const courseId = Number(request.params.courseId);

        if (isNaN(courseId) || !Number.isInteger(courseId) || courseId <= 0) {
            throw new BadRequestException('Course ID must be a positive integer');
        }

        return courseId;
    },
); 