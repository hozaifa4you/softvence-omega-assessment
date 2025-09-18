import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { type AuthUserType, RoleEnum } from 'src/types/auth';
import { VendorService } from './vendor.service';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { ExistGuard } from './exist/exist.guard';

@Controller('vendors')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleEnum.customer)
export class VendorController {
   constructor(private readonly vendorService: VendorService) {}

   @HttpCode(HttpStatus.CREATED)
   @UseGuards(ExistGuard)
   @Post()
   public async create(
      @AuthUser() user: AuthUserType,
      @Body() createVendorDto: CreateVendorDto,
   ) {
      return this.vendorService.create(user.id, createVendorDto);
   }
}
