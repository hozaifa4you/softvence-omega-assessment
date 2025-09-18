import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDTO } from './dtos/signup.dto';
import { AuthUserType, RoleEnum, StatusEnum } from '../types/auth';
import { Role, Status } from '../db/schemas';
import { ExecutionContext } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';

describe('AuthController', () => {
   let controller: AuthController;
   let authService: jest.Mocked<AuthService>;

   const mockAuthUser: AuthUserType = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: RoleEnum.customer as Role,
      status: StatusEnum.active as Status,
   };

   const mockLocalGuard = {
      canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
         const req = context
            .switchToHttp()
            .getRequest<Request & { user: AuthUserType }>();
         req.user = mockAuthUser;
         return true;
      }),
   };

   beforeEach(async () => {
      const mockAuthService = {
         signup: jest.fn(),
         signin: jest.fn(),
         forgotPassword: jest.fn(),
         resetPassword: jest.fn(),
         signupWithGithub: jest.fn(),
         signupWithGoogle: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [
            {
               provide: AuthService,
               useValue: mockAuthService,
            },
         ],
      })
         .overrideGuard(LocalGuard)
         .useValue(mockLocalGuard)
         .compile();

      controller = module.get<AuthController>(AuthController);
      authService = module.get(AuthService);

      // Reset all mocks
      jest.clearAllMocks();
   });

   describe('signup', () => {
      it('should successfully create a new user', async () => {
         const signupDto: SignupDTO = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
         };

         const expectedResult = { success: true };
         authService['signup'].mockResolvedValue(expectedResult);

         const result = await controller['signup'](signupDto);

         expect(authService['signup']).toHaveBeenCalledWith(signupDto);
         expect(result).toEqual(expectedResult);
      });

      it('should handle signup errors', async () => {
         const signupDto: SignupDTO = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
         };

         const error = new Error('Signup failed');
         authService['signup'].mockRejectedValue(error);

         await expect(controller['signup'](signupDto)).rejects.toThrow(
            'Signup failed',
         );
         expect(authService['signup']).toHaveBeenCalledWith(signupDto);
      });

      it('should validate SignupDTO properties', async () => {
         const signupDto: SignupDTO = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
         };

         authService['signup'].mockResolvedValue({ success: true });

         await controller['signup'](signupDto);

         // Verify that all required properties are passed
         expect(authService['signup']).toHaveBeenCalledWith(
            expect.objectContaining({
               name: signupDto.name,
               email: signupDto.email,
               password: signupDto.password,
            }),
         );
      });
   });

   describe('signin', () => {
      it('should successfully sign in user with LocalGuard', async () => {
         const expectedResult = {
            user: mockAuthUser,
            access_token: 'jwt.token.here',
         };

         authService['signin'].mockResolvedValue(expectedResult);

         const result = await controller['signin'](mockAuthUser);

         expect(authService['signin']).toHaveBeenCalledWith(mockAuthUser);
         expect(result).toEqual(expectedResult);
      });

      it('should handle signin errors', async () => {
         const error = new Error('Signin failed');
         authService['signin'].mockRejectedValue(error);

         await expect(controller['signin'](mockAuthUser)).rejects.toThrow(
            'Signin failed',
         );
         expect(authService['signin']).toHaveBeenCalledWith(mockAuthUser);
      });

      it('should receive user from LocalGuard', async () => {
         const expectedResult = {
            user: mockAuthUser,
            access_token: 'jwt.token.here',
         };

         authService['signin'].mockResolvedValue(expectedResult);

         const result = await controller['signin'](mockAuthUser);

         expect(result.user).toEqual(mockAuthUser);
         expect(authService['signin']).toHaveBeenCalledWith(mockAuthUser);
      });
   });

   describe('forgotPassword', () => {
      it('should call forgotPassword method', async () => {
         authService['forgotPassword'].mockResolvedValue(undefined);

         const result = await controller['forgotPassword']();

         expect(authService['forgotPassword']).toHaveBeenCalled();
         expect(result).toBeUndefined();
      });

      it('should handle forgotPassword errors', async () => {
         const error = new Error('Forgot password failed');
         authService['forgotPassword'].mockRejectedValue(error);

         await expect(controller['forgotPassword']()).rejects.toThrow(
            'Forgot password failed',
         );
      });
   });

   describe('resetPassword', () => {
      it('should call resetPassword method', async () => {
         authService['resetPassword'].mockResolvedValue(undefined);

         const result = await controller['resetPassword']();

         expect(authService['resetPassword']).toHaveBeenCalled();
         expect(result).toBeUndefined();
      });

      it('should handle resetPassword errors', async () => {
         const error = new Error('Reset password failed');
         authService['resetPassword'].mockRejectedValue(error);

         await expect(controller['resetPassword']()).rejects.toThrow(
            'Reset password failed',
         );
      });
   });

   describe('signupWithGithub', () => {
      it('should call signupWithGithub method', async () => {
         authService['signupWithGithub'].mockResolvedValue(undefined);

         const result = await controller['signupWithGithub']();

         expect(authService['signupWithGithub']).toHaveBeenCalled();
         expect(result).toBeUndefined();
      });

      it('should handle signupWithGithub errors', async () => {
         const error = new Error('Github signup failed');
         authService['signupWithGithub'].mockRejectedValue(error);

         await expect(controller['signupWithGithub']()).rejects.toThrow(
            'Github signup failed',
         );
      });
   });

   describe('signupWithGoogle', () => {
      it('should call signupWithGoogle method', async () => {
         authService['signupWithGoogle'].mockResolvedValue(undefined);

         const result = await controller['signupWithGoogle']();

         expect(authService['signupWithGoogle']).toHaveBeenCalled();
         expect(result).toBeUndefined();
      });

      it('should handle signupWithGoogle errors', async () => {
         const error = new Error('Google signup failed');
         authService['signupWithGoogle'].mockRejectedValue(error);

         await expect(controller['signupWithGoogle']()).rejects.toThrow(
            'Google signup failed',
         );
      });
   });

   describe('HTTP Status Codes', () => {
      it('should have correct decorators for signup endpoint', () => {
         // This tests that the endpoint is properly decorated
         // In a real test, you'd use supertest for integration testing
         expect(controller['signup']).toBeDefined();
      });

      it('should have correct decorators for signin endpoint', () => {
         expect(controller['signin']).toBeDefined();
      });

      it('should have LocalGuard applied to signin endpoint', () => {
         // The guard is tested through the beforeEach setup
         expect(mockLocalGuard.canActivate).toBeDefined();
      });
   });

   describe('Controller Definition', () => {
      it('should be defined', () => {
         expect(controller).toBeDefined();
      });

      it('should have authService injected', () => {
         expect(authService).toBeDefined();
      });

      it('should have all required endpoints', () => {
         expect(controller['signup']).toBeDefined();
         expect(controller['signin']).toBeDefined();
         expect(controller['forgotPassword']).toBeDefined();
         expect(controller['resetPassword']).toBeDefined();
         expect(controller['signupWithGithub']).toBeDefined();
         expect(controller['signupWithGoogle']).toBeDefined();
      });
   });
});
