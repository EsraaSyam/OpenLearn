import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const isValidOrder = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const order = Number(request.params.order);

        if (isNaN(order) || !Number.isInteger(order) || order <= 0) {
            throw new BadRequestException('Order must be a positive integer');
        }

        return order;
    },
); 