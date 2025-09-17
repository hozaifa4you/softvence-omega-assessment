import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { AuthUserType, RoleEnum, StatusEnum } from '../../types/auth';
import { Request } from 'express';

describe('RolesGuard', () => {
   let guard: RolesGuard;
   let reflector: jest.Mocked<Reflector>;

   const mockUser: AuthUserType = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: RoleEnum.customer as any,
      status: StatusEnum.active as any,
   };

   const createMockExecutionContext = (
      user: AuthUserType,
   ): ExecutionContext => {
      const mockRequest = {
         user,
      } as Request & { user: AuthUserType };

      return {
         switchToHttp: () => ({
            getRequest: () => mockRequest,
         }),
         getHandler: jest.fn(),
         getClass: jest.fn(),
      } as any;
   };

   beforeEach(async () => {
      const mockReflector = {
         getAllAndOverride: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            RolesGuard,
            {
               provide: Reflector,
               useValue: mockReflector,
            },
         ],
      }).compile();

      guard = module.get<RolesGuard>(RolesGuard);
      reflector = module.get(Reflector);

      // Reset all mocks
      jest.clearAllMocks();
   });

   describe('constructor', () => {
      it('should be defined', () => {
         expect(guard).toBeDefined();
      });

      it('should have reflector injected', () => {
         expect(reflector).toBeDefined();
      });
   });

   describe('canActivate', () => {
      it('should allow access when no roles are required', () => {
         const context = createMockExecutionContext(mockUser);
         reflector.getAllAndOverride.mockReturnValue(undefined);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
         expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
            context.getHandler(),
            context.getClass(),
         ]);
      });

      it('should allow access when user role matches required role', () => {
         const user = { ...mockUser, role: RoleEnum.admin as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should allow access when user role is in required roles array', () => {
         const user = { ...mockUser, role: RoleEnum.vendor as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([
            RoleEnum.admin,
            RoleEnum.vendor,
         ]);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should always allow super_admin access regardless of required roles', () => {
         const user = { ...mockUser, role: RoleEnum.super_admin as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should deny access when user role does not match required roles', () => {
         const user = { ...mockUser, role: RoleEnum.customer as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         const result = guard.canActivate(context);

         expect(result).toBe(false);
      });

      it('should deny access when user role is not in required roles array', () => {
         const user = { ...mockUser, role: RoleEnum.customer as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([
            RoleEnum.admin,
            RoleEnum.vendor,
         ]);

         const result = guard.canActivate(context);

         expect(result).toBe(false);
      });

      it('should handle multiple required roles correctly', () => {
         const testCases = [
            {
               userRole: RoleEnum.admin,
               requiredRoles: [RoleEnum.admin, RoleEnum.vendor],
               expected: true,
            },
            {
               userRole: RoleEnum.vendor,
               requiredRoles: [RoleEnum.admin, RoleEnum.vendor],
               expected: true,
            },
            {
               userRole: RoleEnum.customer,
               requiredRoles: [RoleEnum.admin, RoleEnum.vendor],
               expected: false,
            },
            {
               userRole: RoleEnum.super_admin,
               requiredRoles: [RoleEnum.admin, RoleEnum.vendor],
               expected: true, // super_admin always has access
            },
         ];

         testCases.forEach(({ userRole, requiredRoles, expected }) => {
            const user = { ...mockUser, role: userRole as any };
            const context = createMockExecutionContext(user);
            reflector.getAllAndOverride.mockReturnValue(requiredRoles);

            const result = guard.canActivate(context);

            expect(result).toBe(expected);
         });
      });

      it('should handle single required role', () => {
         const user = { ...mockUser, role: RoleEnum.admin as any };
         const context = createMockExecutionContext(user);
         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should handle empty required roles array', () => {
         const context = createMockExecutionContext(mockUser);
         reflector.getAllAndOverride.mockReturnValue([]);

         const result = guard.canActivate(context);

         expect(result).toBe(true); // Should allow access with super_admin fallback
      });
   });

   describe('reflector integration', () => {
      it('should call reflector with correct parameters', () => {
         const context = createMockExecutionContext(mockUser);
         const handler = context.getHandler();
         const cls = context.getClass();

         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         guard.canActivate(context);

         expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
            handler,
            cls,
         ]);
      });

      it('should handle reflector returning null', () => {
         const context = createMockExecutionContext(mockUser);
         reflector.getAllAndOverride.mockReturnValue(null);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should handle reflector returning undefined', () => {
         const context = createMockExecutionContext(mockUser);
         reflector.getAllAndOverride.mockReturnValue(undefined);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });
   });

   describe('request user extraction', () => {
      it('should correctly extract user from request', () => {
         const customUser = {
            ...mockUser,
            id: 99,
            role: RoleEnum.admin as any,
         };
         const context = createMockExecutionContext(customUser);
         reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

         const result = guard.canActivate(context);

         expect(result).toBe(true);
      });

      it('should work with different user objects', () => {
         const users = [
            { ...mockUser, role: RoleEnum.admin as any },
            { ...mockUser, role: RoleEnum.vendor as any },
            { ...mockUser, role: RoleEnum.customer as any },
            { ...mockUser, role: RoleEnum.super_admin as any },
         ];

         users.forEach((user) => {
            const context = createMockExecutionContext(user);
            reflector.getAllAndOverride.mockReturnValue([RoleEnum.admin]);

            const result = guard.canActivate(context);

            // Only admin and super_admin should pass
            const expected =
               user.role === RoleEnum.admin ||
               user.role === RoleEnum.super_admin;
            expect(result).toBe(expected);
         });
      });
   });

   describe('guard behavior', () => {
      it('should implement CanActivate interface', () => {
         expect(typeof guard.canActivate).toBe('function');
      });

      it('should return boolean', () => {
         const context = createMockExecutionContext(mockUser);
         reflector.getAllAndOverride.mockReturnValue(undefined);

         const result = guard.canActivate(context);

         expect(typeof result).toBe('boolean');
      });
   });
});
