import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    return Array.isArray(userAgent) ? userAgent.join(', ') : userAgent || '';
  },
);