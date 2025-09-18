import { AuthUserType } from '../../types/auth';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
   (data: unknown, ctx: ExecutionContext): AuthUserType => {
      const request = ctx.switchToHttp().getRequest<Request>();
      return request?.user as AuthUserType;
   },
);
