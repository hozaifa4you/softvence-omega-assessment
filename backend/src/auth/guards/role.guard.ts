import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Role } from '../../db/schemas';
import { AuthUserType, RoleEnum } from '../../types/auth';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private readonly reflector: Reflector) {}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<
         Role[] | undefined
      >(ROLE_KEY, [context.getHandler(), context.getClass()]);

      if (!requiredRoles) {
         return true;
      }

      const request = context
         .switchToHttp()
         .getRequest<Request & { user: AuthUserType }>();
      const userRole = request.user.role;
      const rolesSet = new Set([...requiredRoles, RoleEnum.super_admin]);

      return rolesSet.has(userRole);
   }
}
