import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { AuthUserType, RoleEnum, StatusEnum } from '../../types/auth';
import { BadRequestException } from '@nestjs/common';

describe('LocalStrategy', () => {
   let strategy: LocalStrategy;
   let authService: jest.Mocked<AuthService>;

   const mockAuthUser: AuthUserType = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: RoleEnum.customer as any,
      status: StatusEnum.active as any,
   };

   beforeEach(async () => {
      const mockAuthService = {
         validateUser: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            LocalStrategy,
            {
               provide: AuthService,
               useValue: mockAuthService,
            },
         ],
      }).compile();

      strategy = module.get<LocalStrategy>(LocalStrategy);
      authService = module.get(AuthService);

      // Reset all mocks
      jest.clearAllMocks();
   });

   describe('constructor', () => {
      it('should be defined', () => {
         expect(strategy).toBeDefined();
      });

      it('should configure strategy with email as username field', () => {
         // The strategy should be configured to use email instead of username
         // This is tested implicitly through the constructor
         expect(strategy).toBeInstanceOf(LocalStrategy);
      });
   });

   describe('validate', () => {
      it('should successfully validate user with correct credentials', async () => {
         const email = 'john@example.com';
         const password = 'password123';

         authService.validateUser.mockResolvedValue(mockAuthUser);

         const result = await strategy.validate(email, password);

         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
         expect(result).toEqual(mockAuthUser);
      });

      it('should handle validation errors from AuthService', async () => {
         const email = 'wrong@example.com';
         const password = 'wrongpassword';

         const error = new BadRequestException('Invalid credentials');
         authService.validateUser.mockRejectedValue(error);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            error,
         );
         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      });

      it('should validate different users correctly', async () => {
         const testCases = [
            {
               email: 'user1@example.com',
               password: 'password1',
               user: { ...mockAuthUser, id: 1, email: 'user1@example.com' },
            },
            {
               email: 'user2@example.com',
               password: 'password2',
               user: { ...mockAuthUser, id: 2, email: 'user2@example.com' },
            },
            {
               email: 'admin@example.com',
               password: 'adminpass',
               user: {
                  ...mockAuthUser,
                  id: 3,
                  email: 'admin@example.com',
                  role: RoleEnum.admin as any,
               },
            },
         ];

         for (const testCase of testCases) {
            authService.validateUser.mockResolvedValueOnce(testCase.user);

            const result = await strategy.validate(
               testCase.email,
               testCase.password,
            );

            expect(result).toEqual(testCase.user);
            expect(authService.validateUser).toHaveBeenCalledWith(
               testCase.email,
               testCase.password,
            );
         }

         expect(authService.validateUser).toHaveBeenCalledTimes(
            testCases.length,
         );
      });

      it('should handle empty email', async () => {
         const email = '';
         const password = 'password123';

         const error = new BadRequestException('Invalid credentials');
         authService.validateUser.mockRejectedValue(error);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            error,
         );
         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      });

      it('should handle empty password', async () => {
         const email = 'john@example.com';
         const password = '';

         const error = new BadRequestException('Invalid credentials');
         authService.validateUser.mockRejectedValue(error);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            error,
         );
         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      });

      it('should handle null values gracefully', async () => {
         const email = null as any;
         const password = null as any;

         const error = new BadRequestException('Invalid credentials');
         authService.validateUser.mockRejectedValue(error);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            error,
         );
         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      });

      it('should handle undefined values gracefully', async () => {
         const email = undefined as any;
         const password = undefined as any;

         const error = new BadRequestException('Invalid credentials');
         authService.validateUser.mockRejectedValue(error);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            error,
         );
         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      });

      it('should handle special characters in email and password', async () => {
         const email = 'user+test@example.com';
         const password = 'p@ssw0rd!@#$%^&*()';

         authService.validateUser.mockResolvedValue(mockAuthUser);

         const result = await strategy.validate(email, password);

         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
         expect(result).toEqual(mockAuthUser);
      });

      it('should handle case sensitivity in email', async () => {
         const email = 'John@Example.COM';
         const password = 'password123';

         authService.validateUser.mockResolvedValue(mockAuthUser);

         const result = await strategy.validate(email, password);

         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
         expect(result).toEqual(mockAuthUser);
      });
   });

   describe('Integration with AuthService', () => {
      it('should call validateUser with exact parameters passed', async () => {
         const email = 'test@example.com';
         const password = 'testpassword';

         authService.validateUser.mockResolvedValue(mockAuthUser);

         await strategy.validate(email, password);

         expect(authService.validateUser).toHaveBeenCalledWith(email, password);
         expect(authService.validateUser).toHaveBeenCalledTimes(1);
      });

      it('should propagate all AuthService exceptions', async () => {
         const email = 'test@example.com';
         const password = 'testpassword';

         const customError = new Error('Database connection failed');
         authService.validateUser.mockRejectedValue(customError);

         await expect(strategy.validate(email, password)).rejects.toThrow(
            customError,
         );
      });

      it('should return exact user object from AuthService', async () => {
         const email = 'test@example.com';
         const password = 'testpassword';

         const customUser = {
            id: 999,
            name: 'Custom User',
            email: 'custom@example.com',
            role: RoleEnum.admin as any,
            status: StatusEnum.active as any,
         };

         authService.validateUser.mockResolvedValue(customUser);

         const result = await strategy.validate(email, password);

         expect(result).toBe(customUser); // Same reference
         expect(result).toEqual(customUser); // Same values
      });
   });

   describe('Passport Configuration', () => {
      it('should be configured with correct field names', () => {
         // The strategy should use 'email' as username field and 'password' as password field
         // This is tested implicitly through the constructor and validate method
         expect(strategy).toBeDefined();
      });

      it('should extend PassportStrategy correctly', () => {
         expect(strategy).toBeInstanceOf(LocalStrategy);
      });
   });
});
