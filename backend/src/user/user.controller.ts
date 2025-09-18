import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PaginationDto } from 'src/common/pipes/pagination.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/types/auth';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.admin)
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get()
   public async findAll(@Query() pagination: PaginationDto) {
      return this.userService.findAll(pagination);
   }
}
