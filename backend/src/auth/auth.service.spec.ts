import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SignupDTO } from './dtos/signup.dto';
import { RoleEnum, StatusEnum, AuthUserType } from '../types/auth';
import { Role, Status } from '../db/schemas';
import * as argon from 'argon2';

// Mock argon2
jest.mock('argon2');
const mockedArgon = argon as jest.Mocked<typeof argon>;

describe('AuthService', () => {
   let service: AuthService;
   let userService: jest.Mocked<UserService>;
   let jwtService: jest.Mocked<JwtService>;

   const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: RoleEnum.customer as Role,
      status: StatusEnum.active as Status,
      created_at: new Date(),
      updated_at: new Date(),
   };

   const mockAuthUser: AuthUserType = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: RoleEnum.customer as Role,
      status: StatusEnum.active as Status,
   };

   beforeEach(async () => {
      const mockUserService = {
         createUser: jest.fn(),
         findUserByEmail: jest.fn(),
         findUserById: jest.fn(),
      };

      const mockJwtService = {
         signAsync: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            {
               provide: UserService,
               useValue: mockUserService,
            },
            {
               provide: JwtService,
               useValue: mockJwtService,
            },
         ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      userService = module.get(UserService);
      jwtService = module.get(JwtService);

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

         userService['createUser'].mockResolvedValue(mockUser);

         const result = await service['signup'](signupDto);

         expect(userService['createUser']).toHaveBeenCalledWith(
            signupDto,
            RoleEnum.customer,
         );
         expect(result).toEqual({ success: true });
      });

      it('should throw error if user creation fails', async () => {
         const signupDto: SignupDTO = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
         };

         userService['createUser'].mockRejectedValue(
            new BadRequestException('User already exist with the email'),
         );

         await expect(service['signup'](signupDto)).rejects.toThrow(
            BadRequestException,
         );
         expect(userService['createUser']).toHaveBeenCalledWith(
            signupDto,
            RoleEnum.customer,
         );
      });
   });

   describe('signin', () => {
      it('should successfully sign in user and return tokens', async () => {
         const accessToken = 'jwt.token.here';
         jwtService['signAsync'].mockResolvedValue(accessToken);

         const result = await service['signin'](mockAuthUser);

         expect(jwtService['signAsync']).toHaveBeenCalledWith({
            sub: mockAuthUser.id,
         });
         expect(result).toEqual({
            user: mockAuthUser,
            access_token: accessToken,
         });
      });

      it('should handle JWT signing failure', async () => {
         jwtService['signAsync'].mockRejectedValue(
            new Error('JWT signing failed'),
         );

         await expect(service['signin'](mockAuthUser)).rejects.toThrow(
            'JWT signing failed',
         );
      });
   });

   describe('validateUser', () => {
      it('should successfully validate user with correct credentials', async () => {
         const email = 'john@example.com';
         const password = 'password123';

         userService['findUserByEmail'].mockResolvedValue(mockUser);
         mockedArgon.verify.mockResolvedValue(true);

         const result = await service['validateUser'](email, password);

         expect(userService['findUserByEmail']).toHaveBeenCalledWith(email);
         expect(mockedArgon.verify).toHaveBeenCalledWith(
            mockUser.password,
            password,
         );
         expect(result).toEqual({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            status: mockUser.status,
         });
      });

      it('should throw BadRequestException if user not found', async () => {
         const email = 'notfound@example.com';
         const password = 'password123';

         userService['findUserByEmail'].mockResolvedValue(undefined);

         await expect(service['validateUser'](email, password)).rejects.toThrow(
            new BadRequestException('Invalid credentials'),
         );
         expect(userService['findUserByEmail']).toHaveBeenCalledWith(email);
         expect(mockedArgon.verify).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException if password is incorrect', async () => {
         const email = 'john@example.com';
         const password = 'wrongpassword';

         userService['findUserByEmail'].mockResolvedValue(mockUser);
         mockedArgon.verify.mockResolvedValue(false);

         await expect(service['validateUser'](email, password)).rejects.toThrow(
            new BadRequestException('Invalid credentials'),
         );
         expect(userService['findUserByEmail']).toHaveBeenCalledWith(email);
         expect(mockedArgon.verify).toHaveBeenCalledWith(
            mockUser.password,
            password,
         );
      });

      it('should handle argon2 verification errors', async () => {
         const email = 'john@example.com';
         const password = 'password123';

         userService['findUserByEmail'].mockResolvedValue(mockUser);
         mockedArgon.verify.mockRejectedValue(new Error('Argon2 error'));

         await expect(service['validateUser'](email, password)).rejects.toThrow(
            'Argon2 error',
         );
      });
   });

   describe('validateJwtUser', () => {
      it('should successfully validate JWT user', async () => {
         const userId = 1;
         userService['findUserById'].mockResolvedValue(mockUser);

         const result = await service['validateJwtUser'](userId);

         expect(userService['findUserById']).toHaveBeenCalledWith(userId);
         expect(result).toEqual({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            status: mockUser.status,
         });
      });

      it('should throw NotFoundException if user not found', async () => {
         const userId = 999;
         userService['findUserById'].mockResolvedValue(undefined);

         await expect(service['validateJwtUser'](userId)).rejects.toThrow(
            new NotFoundException('User not found'),
         );
         expect(userService['findUserById']).toHaveBeenCalledWith(userId);
      });
   });

   describe('generateTokens (private method)', () => {
      it('should generate access token through signin method', async () => {
         const accessToken = 'jwt.token.here';
         jwtService['signAsync'].mockResolvedValue(accessToken);

         const result = await service['signin'](mockAuthUser);

         expect(jwtService['signAsync']).toHaveBeenCalledWith({
            sub: mockAuthUser.id,
         });
         expect(result.access_token).toBe(accessToken);
      });
   });

   describe('placeholder methods', () => {
      it('should have forgotPassword method', () => {
         expect(service['forgotPassword']).toBeDefined();
         expect(typeof service['forgotPassword']).toBe('function');
      });

      it('should have resetPassword method', () => {
         expect(service['resetPassword']).toBeDefined();
         expect(typeof service['resetPassword']).toBe('function');
      });

      it('should have signupWithGithub method', () => {
         expect(service['signupWithGithub']).toBeDefined();
         expect(typeof service['signupWithGithub']).toBe('function');
      });

      it('should have signupWithGoogle method', () => {
         expect(service['signupWithGoogle']).toBeDefined();
         expect(typeof service['signupWithGoogle']).toBe('function');
      });
   });
});
