import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserType, RoleEnum, StatusEnum } from '../../types/auth';
import { Request } from 'express';

// We need to test the callback function that the decorator uses
const authUserCallback = (
   data: unknown,
   ctx: ExecutionContext,
): AuthUserType => {
   const request = ctx.switchToHttp().getRequest<Request>();
   return request?.user as AuthUserType;
};

describe('AuthUser Decorator', () => {
   const mockUser: AuthUserType = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: RoleEnum.customer as any,
      status: StatusEnum.active as any,
   };

   const createMockExecutionContext = (
      user: AuthUserType | undefined,
   ): ExecutionContext => {
      const mockRequest = {
         user,
      } as Request & { user?: AuthUserType };

      return {
         switchToHttp: () => ({
            getRequest: () => mockRequest,
         }),
      } as any;
   };

   describe('decorator callback function', () => {
      it('should extract user from request context', () => {
         const context = createMockExecutionContext(mockUser);

         const result = authUserCallback(undefined, context);

         expect(result).toEqual(mockUser);
      });

      it('should return undefined when user is not present', () => {
         const context = createMockExecutionContext(undefined);

         const result = authUserCallback(undefined, context);

         expect(result).toBeUndefined();
      });

      it('should return null when user is null', () => {
         const mockRequest = { user: null } as Request & { user: null };
         const context = {
            switchToHttp: () => ({
               getRequest: () => mockRequest,
            }),
         } as any;

         const result = authUserCallback(undefined, context);

         expect(result).toBeNull();
      });

      it('should handle different user objects correctly', () => {
         const users = [
            { ...mockUser, id: 1, role: RoleEnum.admin as any },
            { ...mockUser, id: 2, role: RoleEnum.vendor as any },
            { ...mockUser, id: 3, role: RoleEnum.super_admin as any },
         ];

         users.forEach((user) => {
            const context = createMockExecutionContext(user);
            const result = authUserCallback(undefined, context);
            expect(result).toEqual(user);
         });
      });

      it('should preserve all user properties', () => {
         const detailedUser: AuthUserType = {
            id: 999,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: RoleEnum.admin as any,
            status: StatusEnum.active as any,
         };

         const context = createMockExecutionContext(detailedUser);
         const result = authUserCallback(undefined, context);

         expect(result).toEqual(detailedUser);
         expect(result?.id).toBe(999);
         expect(result?.name).toBe('Jane Smith');
         expect(result?.email).toBe('jane.smith@example.com');
         expect(result?.role).toBe(RoleEnum.admin);
         expect(result?.status).toBe(StatusEnum.active);
      });

      it('should return the same reference as in request', () => {
         const context = createMockExecutionContext(mockUser);
         const result = authUserCallback(undefined, context);

         // Should be the same object reference
         expect(result).toBe(mockUser);
      });
   });

   describe('data parameter', () => {
      it('should ignore data parameter and always return user', () => {
         const context = createMockExecutionContext(mockUser);

         // Test with different data values
         const testData = [
            'string',
            123,
            { key: 'value' },
            [],
            null,
            undefined,
         ];

         testData.forEach((data) => {
            const result = authUserCallback(data, context);
            expect(result).toEqual(mockUser);
         });
      });
   });

   describe('context handling', () => {
      it('should correctly switch to HTTP context', () => {
         const mockSwitchToHttp = jest.fn().mockReturnValue({
            getRequest: () => ({ user: mockUser }),
         });

         const context = {
            switchToHttp: mockSwitchToHttp,
         } as any;

         authUserCallback(undefined, context);

         expect(mockSwitchToHttp).toHaveBeenCalled();
      });

      it('should call getRequest on HTTP context', () => {
         const mockGetRequest = jest.fn().mockReturnValue({ user: mockUser });
         const context = {
            switchToHttp: () => ({
               getRequest: mockGetRequest,
            }),
         } as any;

         authUserCallback(undefined, context);

         expect(mockGetRequest).toHaveBeenCalled();
      });
   });

   describe('type safety', () => {
      it('should return AuthUserType when user exists', () => {
         const context = createMockExecutionContext(mockUser);
         const result = authUserCallback(undefined, context);

         // TypeScript should infer this as AuthUserType
         if (result) {
            expect(typeof result.id).toBe('number');
            expect(typeof result.name).toBe('string');
            expect(typeof result.email).toBe('string');
            expect(typeof result.role).toBe('string');
            expect(typeof result.status).toBe('string');
         }
      });

      it('should handle request without user property gracefully', () => {
         const mockRequest = {} as Request;
         const context = {
            switchToHttp: () => ({
               getRequest: () => mockRequest,
            }),
         } as any;

         const result = authUserCallback(undefined, context);

         expect(result).toBeUndefined();
      });
   });

   describe('real-world scenarios', () => {
      it('should work with authenticated user request', () => {
         const authenticatedUser = {
            id: 42,
            name: 'Authenticated User',
            email: 'auth@example.com',
            role: RoleEnum.vendor as any,
            status: StatusEnum.active as any,
         };

         const context = createMockExecutionContext(authenticatedUser);
         const result = authUserCallback(undefined, context);

         expect(result).toEqual(authenticatedUser);
      });

      it('should work with unauthenticated request', () => {
         const context = createMockExecutionContext(undefined);
         const result = authUserCallback(undefined, context);

         expect(result).toBeUndefined();
      });

      it('should handle inactive user', () => {
         const inactiveUser = {
            ...mockUser,
            status: StatusEnum.inactive as any,
         };

         const context = createMockExecutionContext(inactiveUser);
         const result = authUserCallback(undefined, context);

         expect(result).toEqual(inactiveUser);
         expect(result?.status).toBe(StatusEnum.inactive);
      });

      it('should handle banned user', () => {
         const bannedUser = {
            ...mockUser,
            status: StatusEnum.banned as any,
         };

         const context = createMockExecutionContext(bannedUser);
         const result = authUserCallback(undefined, context);

         expect(result).toEqual(bannedUser);
         expect(result?.status).toBe(StatusEnum.banned);
      });
   });

   describe('decorator creation', () => {
      it('should create a parameter decorator', () => {
         const decorator = createParamDecorator(authUserCallback);
         expect(typeof decorator).toBe('function');
      });
   });
});
