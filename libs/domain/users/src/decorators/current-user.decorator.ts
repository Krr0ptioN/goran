import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  }
);
