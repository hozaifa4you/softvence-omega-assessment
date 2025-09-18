import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { SignupDTO } from '../auth/dtos/signup.dto';
import { DB } from '../db/db.module';
import { Role, users } from '../db/schemas';
import { type Database } from '../db/types/db';
import { PaginationDto } from 'src/common/pipes/pagination.dto';

@Injectable()
export class UserService {
   constructor(@Inject(DB) private readonly db: Database) {}

   public async findAll(pagination: PaginationDto) {
      return this.db.query.users.findMany({
         columns: {
            password: false,
         },
      });
   }

   public async createUser(createUserDto: SignupDTO, role: Role) {
      const existingUser = await this.findUserByEmail(createUserDto.email);
      if (existingUser) {
         throw new BadRequestException('User already exist with the email');
      }

      const hashedPassword = await argon2.hash(createUserDto.password);
      createUserDto.password = hashedPassword;

      const returning = await this.db
         .insert(users)
         .values({ ...createUserDto, role })
         .returning();

      return returning[0];
   }

   public async findUserByEmail(email: string) {
      return this.db.query.users.findFirst({
         where: eq(users.email, email),
      });
   }

   public async findUserById(userId: number) {
      return this.db.query.users.findFirst({
         where: eq(users.id, userId),
      });
   }
}
